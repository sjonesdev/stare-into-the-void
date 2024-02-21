"use client";

import { useContext } from "react";
import type { ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { useRouter } from "next/navigation";
import ImageBrowser from "../../components/ImageBrowser";
import { AuthContext } from "../../lib-client/FirebaseContextProvider";
import useSWR from "swr";
import useStorage from "../../lib-client/useStorage";

export default function ClientSaved({
  initialSaved,
}: {
  initialSaved: ImageAsset[];
}) {
  const user = useContext(AuthContext);
  const router = useRouter();
  const storage = useStorage();

  const { data, mutate } = useSWR(
    `/saved/${user?.uid}`,
    () => storage?.fetchSaved(user?.uid) ?? [],
    {
      fallbackData: initialSaved,
    }
  );

  if (!user) {
    router.push("/signin");
    return <></>;
  }

  const deleteImage = (img: ImageAsset) => {
    const deletedIndex = data.findIndex((asset) => {
      return asset.urls.orig === img.urls.orig;
    });
    if (deletedIndex) {
      data.splice(deletedIndex, 1);
      mutate(data);
    }
  };

  return (
    <ImageBrowser
      imgResults={{ images: data }}
      title="Saved Images"
      onDeleteImage={deleteImage}
      saved
    />
  );
}
