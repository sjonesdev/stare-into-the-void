import React from "react";
import { RiImageEditLine } from "react-icons/ri";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";
import DownloadLink from "./DownloadLink";

interface ImagePreviewProps {
  img: ImageAsset;
  lastOpened?: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ImagePreview({
  img,
  lastOpened,
  selected,
  onClick,
}: ImagePreviewProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center p-2 lg:p-4 md:max-w-3xs lg:max-w-2xs 3xl:max-w-sm text-white`}
      onClick={onClick}
    >
      <div className="m-2 w-full h-full">
        {selected && (
          <div className="absolute -translate-x-2 -translate-y-2 h-[15rem] lg:w-[15rem] lg:h-[13rem] 3xl:w-[23rem] 3xl:h-[21rem] rounded-md bg-indigo-300/25 border-indigo-300 border-solid border-2" />
        )}
        <div className="absolute bg-black/50 rounded-tl-md rounded-br-md">
          <button
            className="block m-1 3xl:m-2"
            aria-label="Open image in editor"
            onClick={() => navigate("/edit", { state: img })}
          >
            <RiImageEditLine
              aria-hidden={true}
              className="h-7 w-7 3xl:h-10 3xl:w-10"
            />
          </button>
          <DownloadLink
            href={img.urls.orig}
            className="block m-2 3xl:m-3"
            imgTitle={img.title}
          >
            <FaDownload
              aria-hidden={true}
              className=" w-5 h-5 3xl:h-8 3xl:w-8"
            />
          </DownloadLink>
        </div>
        <img
          className="rounded-md shadow-md shadow-black/40 object-cover md:w-48 md:h-40 lg:w-56 lg:h-48 3xl:w-[24rem] 3xl:h-80"
          src={img.urls.thumb}
          alt={img.title}
          loading="lazy"
        />
      </div>
      <span className="hidden md:block text-md 3xl:text-xl text-center">
        {img.title}
      </span>
      <span className="text-sm 3xl:text-xl text-center">
        {lastOpened ?? ""}
      </span>
    </div>
  );
}
