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
  const title = query ? (
    <>
      Results for <span className="font-bold">"{query}"</span>
    </>
  ) : (
    "Please enter a search query"
  );

  const [queryImgs, setQueryImgs] = React.useState<ImageAsset[]>([]);

  React.useEffect(() => {
    const newQueryImgs: ImageAsset[] = [];

    const promises = [
      FunctionsService.getPictureOfTheDay().then((val) => {
        // if there is no query, we want to still show APOD, but if there is a query, we only want to show APOD if it matches the query
        if (val) {
          if (
            !query ||
            (query && val.title.toLowerCase().includes(query.toLowerCase()))
          ) {
            newQueryImgs.push(val);
          }
        }
      }),
    ];

    if (query) {
      promises.push(
        FunctionsService.getNIVLWithQuery(query ?? "").then((val) => {
          val.forEach((img) => {
            img.date = new Date(img.date);
            newQueryImgs.push(img);
          });
        })
      );
    }

    Promise.allSettled(promises).then(() => {
      setQueryImgs(newQueryImgs);
    });
  }, [query]);

  return <ImageBrowser images={queryImgs} title={title} />;
}
