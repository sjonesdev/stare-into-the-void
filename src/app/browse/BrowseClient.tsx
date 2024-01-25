"use client";
import useSWR from "swr";
import { FunctionsService } from "../../lib/firebase-services";
import { ApiInfo } from "../../lib/apiInfo";
import { type ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { usePathname } from "next/navigation";
import ImageBrowser from "../../components/ImageBrowser";

const apis: {
  value: string;
  tooltip: string;
  isDefault: boolean;
}[] = [];
for (const key in ApiInfo) {
  const apiVal = {
    value: ApiInfo[key].name,
    tooltip: ApiInfo[key].desc,
    isDefault: true,
  };
  if (
    ApiInfo[key].name === ApiInfo.ImageAndVideoLibrary.name ||
    ApiInfo[key].name === ApiInfo.APOD.name
  ) {
    apis.push(apiVal);
  }
}

interface BrowseClientProps {
  initialQueryImgs: ImageAsset[];
}

export default function BrowseClient({ initialQueryImgs }: BrowseClientProps) {
  const path = usePathname().split("/");
  const query = path[path.length - 1];
  const title = query ? (
    <>
      Results for <span className="font-bold">&ldquo;{query}&rdquo;</span>
    </>
  ) : (
    "Please enter a search query"
  );

  const { data: queryImgs } = useSWR(
    `/browse/${query}`,
    () => FunctionsService.fetchImages(query),
    {
      fallbackData: initialQueryImgs,
    }
  );

  return <ImageBrowser images={queryImgs} title={title} />;
}
