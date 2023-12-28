import { useEffect, useState } from "react";
import { FunctionsService } from "../lib/firebase-services";
import {
  ImageAsset,
  SourceAPI,
} from "../../stare-into-the-void-functions/src/models/image-assets";
import { useNavigate } from "react-router-dom";

const MAX_LENGTH = 215;

/**
 * Astronomy Picture of the Day
 */
export default function Apod() {
  const navigate = useNavigate();
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
        <button onClick={() => navigate(`/browse/${title}`)}>
          <img
            className="h-48 w-60 3xl:h-56 3xl:w-64 rounded-lg"
            alt={title}
            src={urls.orig}
          ></img>
        </button>
      </div>
      <div className="text-white w-64 3xl:w-80">
        <p className="text-white text-center font-medium">{title}</p>

        <p className="font-medium text-center">
          {date.toString().substring(0, 15)}
        </p>

        <div className="font-normal text-sm 3xl:text-xl text-clip">
          {`${description.substring(0, MAX_LENGTH).trim()}...`}
          <small>
            {" "}
            [
            <button onClick={() => navigate(`/browse/${title}`)}>
              Learn more
            </button>
            ]
          </small>
        </div>
      </div>
    </div>
  );
}
