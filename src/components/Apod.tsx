import { useEffect, useState } from "react";
import { FunctionsService } from "../lib/firebase-services";
import {
  ImageAsset,
  SourceAPI,
} from "../../stare-into-the-void-functions/src/models/image-assets";

const MAX_LENGTH = 260;

/**
 * Astronomy Picture of the Day
 */
export default function Apod() {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [apod, setApod] = useState<ImageAsset>({
    title: "",
    urls: {
      orig: "",
      thumb: "",
    },
    description: "",
    date: new Date(),
    sourceAPI: "None" as SourceAPI,
  });

  useEffect(() => {
    FunctionsService.getPictureOfTheDay().then((res) => {
      if (res) setApod(res);
    });
  }, []);

  const { title, urls, description, date } = apod;

  return (
    <div className="flex flex-wrap justify-evenly mt-5 3xl:text-3xl p-4 3xl:p-8">
      <div className="3xl:w-64">
        <img
          className="h-36 w-40 3xl:h-56 3xl:w-64 rounded-lg"
          alt={title}
          src={urls.orig}
        ></img>
        <p className="text-white text-center font-medium">{title}</p>
      </div>
      <div className="text-white w-64 3xl:w-80">
        <p className="font-medium text-center">{date.toString()}</p>
        {!showFullDesc && description.length > MAX_LENGTH ? (
          <div className="font-normal text-sm 3xl:text-xl text-clip">
            {`${description.substring(0, MAX_LENGTH).trim()}...`}
            <small>
              {" "}
              [<button onClick={() => setShowFullDesc(true)}>Show more</button>]
            </small>
          </div>
        ) : (
          <p className="break-words font-normal text-sm 3xl:text-xl text-ellipsis overflow-hidden">
            {description}
            <small>
              {" "}
              [<button onClick={() => setShowFullDesc(false)}>Show less</button>
              ]
            </small>
          </p>
        )}
      </div>
    </div>
  );
}
