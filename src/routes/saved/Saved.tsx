import { useContext, useEffect, useState } from "react";
import { SourceAPI } from "../../../stare-into-the-void-functions/src/models/image-assets";
import ImagePreview from "../../components/ImagePreview";
import {
  AuthContext,
  StorageService,
  FunctionsService,
} from "../../lib/firebase-services";
import { useNavigate } from "react-router-dom";
import { getBlob, getBytes } from "firebase/storage";

export default function Saved() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    const userImages = StorageService.imagesRef(user.uid);
    const userThumbnails = StorageService.thumbnailsRef(user.uid);
    userImages.listAll().then((res) => {
      console.log(`res ${res.items.length}`);
      const previewPromises = res.items.map(async (item) => {
        let thumbnailURL;
        try {
          thumbnailURL = await userThumbnails.child(item.name).getDownloadURL();
        } catch (e) {
          console.warn("Error getting thumbnail", e);
        }
        const [metadata, image] = await Promise.all([
          item.getMetadata(),
          item.getDownloadURL(),
        ]);
        if (!metadata.contentType) return null;
        const downloadURL = image;
        return (
          <ImagePreview
            key={downloadURL}
            img={{
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
            }}
            lastOpened="6 days ago"
            onDelete={() => {
              const deletedIndex = imagePreviews.findIndex((preview) => {
                return preview.key === downloadURL;
              });
              if (deletedIndex) {
                imagePreviews.splice(deletedIndex, 1);
                setImagePreviews([...imagePreviews]);
              }
            }}
          />
        );
      });
      const previews: React.ReactElement[] = [];

      Promise.allSettled(previewPromises).then((results) => {
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            previews.push(result.value);
          }
        });
        setImagePreviews(previews);
      });
    });
  }, []);

  return <>{imagePreviews}</>;
}
