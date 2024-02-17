"use client";

import { useContext, useState } from "react";
import type { ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { AuthContext } from "../../client-lib/auth-context";
import { useRouter } from "next/navigation";
import ImageBrowser from "../../components/ImageBrowser";

export default function ClientSaved({
  initialSaved,
}: {
  initialSaved: ImageAsset[];
}) {
  const user = useContext(AuthContext);
  const router = useRouter();

  const [saved, setSaved] = useState(initialSaved);

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
      images={saved}
      title="Saved Images"
      onDeleteImage={deleteImage}
      saved
    />
  );
}
