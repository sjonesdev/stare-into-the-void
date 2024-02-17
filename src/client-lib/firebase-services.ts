"use client";

import { HttpsCallable, getFunctions, httpsCallable } from "firebase/functions";
import {
  ImageAsset,
  ImageAssetRaw,
  SourceAPI,
} from "../../stare-into-the-void-functions/src/models/image-assets";
import {
  getBase64DataStringUint8Array,
  getUint8ArrayImageblob,
  resizeImageBlob,
} from "./util";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

class FunctionsService {
  private static _functions = getFunctions();
  private static apod: HttpsCallable<unknown, ImageAsset> = httpsCallable(
    FunctionsService._functions,
    "apod"
  );
  private static nivl: HttpsCallable<unknown, ImageAsset[]> = httpsCallable(
    FunctionsService._functions,
    "nivl"
  );
  public static downloadImageData: HttpsCallable<unknown, ImageAssetRaw> =
    httpsCallable(FunctionsService._functions, "downloadProxy");

  get functions() {
    return FunctionsService._functions;
  }

  static async getPictureOfTheDay() {
    const apod = await FunctionsService.apod();
    if (!apod.data) return null;
    apod.data.date = new Date(apod.data.date);
    if (!apod.data.urls.thumb) apod.data.urls.thumb = apod.data.urls.orig;
    return apod.data;
  }

  static async getNIVLWithQuery(query: string): Promise<ImageAsset[]> {
    let nivlUrls: ImageAsset[] = [];
    await FunctionsService.nivl({ search: query })
      .then((res) => {
        nivlUrls = res.data;
        return res.data;
      })
      .catch((reason) => {
        console.error("error: " + reason);
      });
    return nivlUrls;
  }

  static async fetchImages(query: string) {
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
        FunctionsService.getNIVLWithQuery(query).then((val) => {
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
  private static _storage = getStorage();
  static imagesRef(userId: string) {
    return ref(StorageService._storage, `users/${userId}/saved/images`);
  }
  static thumbnailsRef(userId: string) {
    return ref(StorageService._storage, `users/${userId}/saved/thumbnails`);
  }
  static get storage() {
    return StorageService._storage;
  }

  static async saveImage(
    dataUrl: string,
    title: string,
    description: string,
    sourceAPI: SourceAPI,
    uid: string,
    onError: (error: Error) => void,
    onComplete: () => void
  ) {
    const img = getBase64DataStringUint8Array(dataUrl);
    const imgBlob = getUint8ArrayImageblob(img, "image/png"); // could check type here, but we know tui-image-editor always uses png

    if (!imgBlob || !imgBlob.size) {
      onError(new Error("Error getting image blob"));
    }
    console.debug(`Uploading ${imgBlob.size} byte ${imgBlob.type}`);
    const imgThumbBlob = await resizeImageBlob(imgBlob, 200);
    const uploadRef = ref(StorageService.imagesRef(uid), title); // upload main image
    uploadBytes(uploadRef, imgBlob, {
      contentType: imgBlob.type,
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

    // upload thumbnail, we don't really care if it fails
    if (imgThumbBlob) {
      const uploadThumbRef = ref(StorageService.thumbnailsRef(uid), title);
      uploadBytes(uploadThumbRef, imgThumbBlob, {
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
}

export { FunctionsService, StorageService };
