"use client";

import { useContext, useState } from "react";
import type { ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { useRouter } from "next/navigation";
import ImageBrowser from "../../components/ImageBrowser";
import { AuthContext } from "../../lib-client/FirebaseContextProvider";

export default function ClientSaved({
  initialSaved,
}: {
  initialSaved: ImageAsset[];
}) {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [saved, setSaved] = useState<ImageAsset[]>(initialSaved);

  if (!user) {
    router.push("/signin");
    return <></>;
  }

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
      imgResults={{ images: saved }}
      title="Saved Images"
      onDeleteImage={deleteImage}
      saved
    />
  );
}
