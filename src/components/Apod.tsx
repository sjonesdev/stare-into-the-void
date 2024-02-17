"use client";

import { redirect } from "next/navigation";
import RedirectOnClick from "./RedirectOnClick";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";

const MAX_LENGTH = 215;

/**
 * Astronomy Picture of the Day
 */
export default function Apod({
  apod,
  apodImage,
}: {
  apod: ImageAsset;
  apodImage: React.ReactNode;
}) {
  const { title, description, date } = apod;

  return (
    <div className="flex flex-wrap justify-evenly mt-5 3xl:text-3xl p-4 3xl:p-8">
      <div className="3xl:w-64">
        <RedirectOnClick url={`/browse/${title}`}>{apodImage}</RedirectOnClick>
      </div>
      <div className="text-white w-64 3xl:w-80">
        <p className="text-white text-center font-medium">{title}</p>

        <p className="font-medium text-center">
          {date.toString().substring(0, 15)}
        </p>

        <div className="font-normal text-sm 3xl:text-xl text-clip">
          {`${description?.substring(0, MAX_LENGTH).trim()}...`}
          <small>
            {" "}
            [
            <button onClick={() => redirect(`/browse/${title}`)}>
              Learn more
            </button>
            ]
          </small>
        </div>
      </div>
    </div>
  );
}
