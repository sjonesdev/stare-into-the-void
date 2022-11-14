interface ImagePreviewProps {
  imgUrl: string;
  dispText: string;
  imgAltText?: string;
  lastOpened?: string;
  cols?: number;
  onClick?: () => void;
}

export default function ImagePreview({
  imgUrl,
  dispText,
  imgAltText,
  lastOpened,
  cols = 3,
  onClick,
}: ImagePreviewProps) {
  return (
    <div
      className={`flex flex-col items-center w-${cols}/12 p-4 h-fit xl:max-w-2xs`}
      onClick={onClick}
    >
      <div className="m-2 w-full h-full">
        <img
          className="rounded-md shadow-md shadow-black/40 object-cover h-56 w-56 md:h-32 md:h-48"
          src={imgUrl}
          alt={imgAltText ?? ""}
        />
      </div>
      <span className="text-md text-white text-center">{dispText}</span>
      <span className="text-sm text-white text-center">{lastOpened ?? ""}</span>
    </div>
  );
}
