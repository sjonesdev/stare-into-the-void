"use client"; // TODO remove

import type {
  ImageAsset,
  SourceAPI,
} from "../../../stare-into-the-void-functions/src/models/image-assets";
import { StorageService } from "../../client-lib/firebase-services";
import { redirect } from "next/navigation";
import ClientSaved from "./ClientSaved";
import { useContext, useEffect, useState } from "react"; // TODO remove
import { AuthContext } from "../../client-lib/auth-context"; // TODO remove

export default function Saved() {
  // const user = auth.currentUser;
  const user = useContext(AuthContext);
  if (!user) {
    redirect("/signin");
  }

  const userImagesRef = StorageService.imagesRef(user.uid);
  const userThumbnails = StorageService.thumbnailsRef(user.uid);

  const [saved, setSaved] = useState<ImageAsset[]>([]);
  useEffect(() => {
    userImagesRef.listAll().then((userImages) => {
      const assetPromises: Promise<ImageAsset | null>[] = userImages.items.map(
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
      const newSaved: ImageAsset[] = [];

      Promise.allSettled(assetPromises).then((results) => {
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            newSaved.push(result.value);
          }
        });
        setSaved(newSaved);
      });
    });
  }, [userImagesRef, userThumbnails]);

  return <ClientSaved initialSaved={saved} />;
}
