interface ImagePreviewProps {
  imgUrl: string;
  dispText: string;
  imgAltText?: string;
  lastOpened?: string;
  onClick?: () => void;
}

export default function ImagePreview({
  imgUrl,
  dispText,
  imgAltText,
  lastOpened,
  onClick,
}: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center w-full sm:w-3/12 p-4 h-fit w-fit xl:max-w-2xs">
      <div className="m-2 w-full h-full">
        <img
          className="rounded-md shadow-md shadow-black/40 object-cover h-56 w-56 sm:h-32 lg:h-48"
          src={imgUrl}
          alt={imgAltText ?? ""}
        />
      </div>
      <span className="text-md text-white text-center">{dispText}</span>
      <span className="text-sm text-white text-center">{lastOpened ?? ""}</span>
    </div>
  );
}
