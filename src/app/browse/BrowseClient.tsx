"use client";

import { ApiInfo } from "../../lib-client/apiInfo";
import { usePathname } from "next/navigation";
import ImageBrowser from "../../components/ImageBrowser";
import { ImageQueryResults } from "../../lib-server/nasa-api";
import useSWR from "swr";
import useFunctions from "../../lib-client/useFunctions";

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
  initialQueryImgs: ImageQueryResults;
}

export default function BrowseClient({ initialQueryImgs }: BrowseClientProps) {
  const functions = useFunctions();
  const path = usePathname().split("/");
  const query = path.length > 2 ? path[path.length - 1] : "";
  const title = query ? (
    <>
      Results for <span className="font-bold">&ldquo;{query}&rdquo;</span>
    </>
  ) : (
    "Please enter a search query"
  );

  const { data: queryImgs } = useSWR(
    `/browse/${query}`,
    () => functions?.fetchImages(query) ?? { images: [] },
    {
      fallbackData: initialQueryImgs,
    }
  );

  return <ImageBrowser imgResults={queryImgs} title={title} />;
}
