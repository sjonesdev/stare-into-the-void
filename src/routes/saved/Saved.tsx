import { useContext, useState } from "react";
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

  if (!user) {
    navigate("/signin");
    return <></>;
  }

  const userImages = storage.ref(`users/${user.uid}/saved/images`);
  const userThumbnails = storage.ref(`users/${user.uid}/saved/thumbnails`);

  userThumbnails.listAll().then((res) => {
    res.items.forEach((item) => {
      const metadata = item.getMetadata();
      const downloadURL = item.getDownloadURL();
      Promise.all([metadata, downloadURL]).then(([metadata, url]) => {
        const previews = [];
        previews.push(
          <ImagePreview
            img={{
              title: metadata.customMetadata?.title ?? "Untitled",
              urls: {
                orig: url,
                thumb: url,
              },
              description:
                metadata.customMetadata?.description ?? "No description",
              date: new Date(metadata.updated),
              sourceAPI:
                (metadata.customMetadata?.sourceAPI as SourceAPI) ??
                ("None" as SourceAPI),
            }}
            lastOpened="6 days ago"
          />
        );
        setImagePreviews(previews);
      });
    });
  });

  return <>imagePreviews</>;
}
