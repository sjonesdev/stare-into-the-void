"use client";

import { Functions, HttpsCallable, httpsCallable } from "firebase/functions";
import {
  ImageAsset,
  ImageAssetRaw,
  SourceAPI,
} from "../../stare-into-the-void-functions/src/models/image-assets";
import {
  FirebaseStorage,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { b64toBlob, resizeImage } from "./util";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

class FunctionsService {
  public functions;
  private apod: HttpsCallable<unknown, ImageAsset>;
  private nivl: HttpsCallable<unknown, ImageAsset[]>;
  private downloadImageData: HttpsCallable<unknown, ImageAssetRaw>;

  constructor(functions: Functions) {
    this.functions = functions;
    this.apod = httpsCallable(this.functions, "apod");
    this.nivl = httpsCallable(this.functions, "nivl");
    this.downloadImageData = httpsCallable(this.functions, "downloadProxy");
  }

  async downloadImage(url: string) {
    const response = await this.downloadImageData({
      url,
    }).catch((reason) => {
      console.error("Error downloading image: ", reason);
    });
    console.debug(
      `Got image buffer of size ${response?.data.buffer.length} and type ${response?.data.type}`
    );
    if (!response?.data.buffer.length) return null;
    const { data } = response;

    const buffer = Uint8Array.from(data.buffer);
    return new Blob([buffer], { type: data.type });
  }

  async getPictureOfTheDay() {
    const apod = await this.apod();
    if (!apod.data) return null;
    apod.data.date = new Date(apod.data.date);
    if (!apod.data.urls.thumb) apod.data.urls.thumb = apod.data.urls.orig;
    return apod.data;
  }

  async getNIVLWithQuery(query: string): Promise<ImageAsset[]> {
    let nivlUrls: ImageAsset[] = [];
    await this.nivl({ search: query })
      .then((res) => {
        nivlUrls = res.data;
        return res.data;
      })
      .catch((reason) => {
        console.error("error: " + reason);
      });
    return nivlUrls;
  }

  async fetchImages(query: string) {
    const newQueryImgs: ImageAsset[] = [];

    // const promises = [
    //   FunctionsService.getPictureOfTheDay().then((val) => {
    //     // if there is no query, we want to still show APOD, but if there is a query, we only want to show APOD if it matches the query
    //     if (val) {
    //       if (
    //         !query ||
    //         (query && val.title.toLowerCase().includes(query.toLowerCase()))
    //       ) {
    //         newQueryImgs.push(val);
    //       }
    //     }
    //   }),
    // ];
    const promises = [];
    if (query) {
      promises.push(
        this.getNIVLWithQuery(query).then((val) => {
          val.forEach((img) => {
            img.date = new Date(img.date);
            newQueryImgs.push(img);
          });
        })
      );
    }

    await Promise.allSettled(promises);
    return { images: newQueryImgs };
  }
}

class StorageService {
  public storage;
  imagesRef(userId: string) {
    return ref(this.storage, `users/${userId}/saved/images`);
  }
  thumbnailsRef(userId: string) {
    return ref(this.storage, `users/${userId}/saved/thumbnails`);
  }

  constructor(storage: FirebaseStorage) {
    this.storage = storage;
  }

  /**
   *
   * @param url base64 data url string as to pass to an img src or image blob. Be warned, this function will not check for the validity of the base64 string
   * @param title
   * @param description
   * @param sourceAPI
   * @param uid
   * @param onError
   * @param onComplete
   */
  async saveImage(
    image: Blob | string,
    title: string,
    description: string,
    sourceAPI: SourceAPI,
    uid: string,
    onError: (error: Error) => void,
    onComplete: () => void
  ) {
    // could check type here, but we know tui-image-editor always uses png
    let blob: Blob | null;
    if (typeof image === "string") {
      blob = b64toBlob(image);
    } else {
      blob = image;
    }

    if (!blob || !blob.size) {
      onError(new Error("Error getting image blob"));
      return;
    }
    console.debug(`Uploading ${blob.size} byte ${blob.type}`);
    const imgThumbBlob = await resizeImage(blob, 200);
    console.debug("Resized image");
    const uploadRef = ref(this.imagesRef(uid), title); // upload main image
    await uploadBytes(uploadRef, blob, {
      contentType: blob.type,
      customMetadata: {
        title: title,
        description: description,
        sourceAPI,
      },
    })
      .then(() => {
        console.debug("Image uploaded successfully");
        onComplete();
      })
      .catch((error) => {
        onError(error);
      });
    console.debug("Uploaded image");

    // upload thumbnail, we don't really care if it fails
    if (imgThumbBlob) {
      console.debug("Uploading thumbnail");
      const uploadThumbRef = ref(this.thumbnailsRef(uid), title);
      await uploadBytes(uploadThumbRef, imgThumbBlob, {
        contentType: imgThumbBlob.type,
      })
        .then(() => {
          console.debug("Thumbnail uploaded successfully");
        })
        .catch((error) => {
          console.error("Error uploading thumbnail", error);
        });
    }
  }

  async fetchSaved(uid?: string) {
    if (!uid) return [];
    const thumbRef = this.thumbnailsRef(uid);
    const savedRefs = await listAll(this.imagesRef(uid));
    const assetPromises: Promise<ImageAsset | null>[] = savedRefs.items.map(
      async (item) => {
        let thumbnailURL;
        try {
          thumbnailURL = await getDownloadURL(ref(thumbRef, item.name));
        } catch (e) {
          console.warn("Error getting thumbnail", e);
        }

        const [metadata, image] = await Promise.all([
          getMetadata(item),
          getDownloadURL(item),
        ]);

        if (!metadata.contentType) return null;
        const downloadURL = image;

        const asset: ImageAsset = {
          title: metadata.customMetadata?.title ?? "Untitled",
          urls: {
            orig: downloadURL,
            thumb: thumbnailURL ? thumbnailURL : downloadURL,
          },
          description: metadata.customMetadata?.description ?? "No description",
          date: new Date(metadata.updated),

          sourceAPI:
            (metadata.customMetadata?.sourceAPI as SourceAPI) ??
            ("None" as SourceAPI),
        };
        return asset;
      }
    );
    const saved: ImageAsset[] = [];

    const results = await Promise.allSettled(assetPromises);
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        saved.push(result.value);
      }
    }
    return saved;
  }
}

export { FunctionsService, StorageService };
