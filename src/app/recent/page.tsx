"use client";

import { ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import ImageBrowser from "../../components/ImageBrowser";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Recent() {
  const [recent] = useLocalStorage<ImageAsset[]>("recent", []);

  return <ImageBrowser images={recent} title="Recent" presorted prefiltered />;
}
