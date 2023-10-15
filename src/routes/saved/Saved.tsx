import { useContext, useEffect, useState } from "react";
import { SourceAPI } from "../../../stare-into-the-void-functions/src/models/image-assets";
import ImagePreview from "../../components/ImagePreview";
import { AuthContext } from "../../lib/firebase-services";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const user = useContext(AuthContext);
  const storage = firebase.storage();
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    const userImages = storage.ref(`users/${user.uid}/saved/images`);
    const userThumbnails = storage.ref(`users/${user.uid}/saved/thumbnails`);
    userImages.listAll().then((res) => {
      console.log("userImages", res);
      const previewPromises = res.items.map(async (item) => {
        let thumbnailURL;
        try {
          thumbnailURL = await userThumbnails.child(item.name).getDownloadURL();
        } catch (e) {
          console.warn("Error getting thumbnail", e);
        }
        const [metadata, downloadURL] = await Promise.all([
          item.getMetadata(),
          item.getDownloadURL(),
        ]);
        console.log(metadata, downloadURL, thumbnailURL);
        return (
          <ImagePreview
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
            saved
          />
        );
      });
      const previews: React.ReactNode[] = [];

      Promise.allSettled(previewPromises).then((results) => {
        results.forEach((result) => {
          console.log("result", result);
          if (result.status === "fulfilled") {
            previews.push(result.value);
          }
        });
        console.log("previews", previews);
        setImagePreviews(previews);
      });
    });
  }, []);

  return <>{imagePreviews}</>;
}
