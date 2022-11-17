import React from "react";
import { RiImageEditLine } from "react-icons/ri";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";

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
      className={`flex flex-col items-center p-4 h-fit max-w-2xs text-white`}
      onClick={onClick}
    >
      <div className="m-2 w-full h-full">
        {selected && (
          <div className="absolute -translate-x-2 -translate-y-2 h-[15rem] w-[15rem] md:h-[13rem] rounded-md bg-indigo-300/25 border-indigo-300 border-solid border-2" />
        )}
        <div className="absolute bg-black/50 rounded-tl-md rounded-br-md">
          <button
            className="block m-1"
            aria-label="Open image in editor"
            onClick={() => navigate("/edit", { state: img })}
          >
            <RiImageEditLine aria-hidden={true} className="h-7 w-7" />
          </button>
          <a
            href={img.urls.orig}
            className="block m-2"
            aria-label="Download image"
            target="_blank"
            rel="noreferrer noopener"
            download
          >
            <FaDownload aria-hidden={true} className=" w-5 h-5" />
          </a>
        </div>
        <img
          className="rounded-md shadow-md shadow-black/40 object-cover h-56 w-56 md:h-48"
          src={img.urls.thumb}
          alt={img.title}
          loading="lazy"
        />
      </div>
      <span className="text-md text-center">{img.title}</span>
      <span className="text-sm text-center">{lastOpened ?? ""}</span>
    </div>
  );
}
