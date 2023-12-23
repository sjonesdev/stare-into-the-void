import * as React from "react";
import { FunctionsService } from "../../lib/firebase-services";
import { ApiInfo } from "../../lib/apiInfo";
import { type ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { useParams } from "react-router-dom";
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

export default function Browse() {
  const { query } = useParams();
  const title = (
    <>
      Results for <span className="font-bold">"{query}"</span>
    </>
  );

  const [queryImgs, setQueryImgs] = React.useState<ImageAsset[]>([]);

  React.useEffect(() => {
    FunctionsService.getNIVLWithQuery(query ?? "").then((val) => {
      const processedVal = val.map((img, idx) => {
        img.date = new Date(img.date);
        return img;
      });
      setQueryImgs(processedVal);
    });
  }, [query]);

  return <ImageBrowser images={queryImgs} title={title} />;
}
