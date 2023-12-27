import { useContext, useEffect, useState } from "react";
import type {
  ImageAsset,
  SourceAPI,
} from "../../../stare-into-the-void-functions/src/models/image-assets";
import { AuthContext, StorageService } from "../../lib/firebase-services";
import { useNavigate } from "react-router-dom";
import ImageBrowser from "../../components/ImageBrowser";

export default function Saved() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState<ImageAsset[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const userImages = StorageService.imagesRef(user.uid);
    const userThumbnails = StorageService.thumbnailsRef(user.uid);

    userImages.listAll().then((res) => {
      const assetPromises: Promise<ImageAsset | null>[] = res.items.map(
        async (item) => {
          let thumbnailURL;
          try {
            thumbnailURL = await userThumbnails
              .child(item.name)
              .getDownloadURL();
          } catch (e) {
            console.warn("Error getting thumbnail", e);
          }

          const [metadata, image] = await Promise.all([
            item.getMetadata(),
            item.getDownloadURL(),
          ]);

          if (!metadata.contentType) return null;
          const downloadURL = image;

          const asset: ImageAsset = {
            title: metadata.customMetadata?.title ?? "Untitled",
            urls: {
              orig: downloadURL,
              thumb: thumbnailURL ? thumbnailURL : downloadURL,
            },
            description:
              metadata.customMetadata?.description ?? "No description",
            date: new Date(metadata.updated),
            sourceAPI:
              (metadata.customMetadata?.sourceAPI as SourceAPI) ??
              ("None" as SourceAPI),
          };
          return asset;
        }
      );
      const imageAssets: ImageAsset[] = [];

      Promise.allSettled(assetPromises).then((results) => {
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            imageAssets.push(result.value);
          }
        });
        setSaved(imageAssets);
      });
    });
  }, [navigate, user]);

  const deleteImage = (img: ImageAsset) => {
    const deletedIndex = saved.findIndex((asset) => {
      return asset.urls.orig === img.urls.orig;
    });
    if (deletedIndex) {
      saved.splice(deletedIndex, 1);
      setSaved([...saved]);
    }
  };

  return (
    <ImageBrowser
      images={saved}
      title="Saved Images"
      onDeleteImage={deleteImage}
      saved
    />
  );
}
