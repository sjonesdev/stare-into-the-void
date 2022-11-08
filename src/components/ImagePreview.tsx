interface ImagePreviewProps {
  imgUrl: string;
  dispText: string;
  imgAltText?: string;
  onClick?: () => void;
}

export default function ImagePreview({
  imgUrl,
  dispText,
  imgAltText,
  onClick,
}: ImagePreviewProps) {
  return (
    <div className="flex flex-col w-full sm:w-3/12 p-4 max-w-3xs h-fit xl:max-w-2xs">
      <div className="m-2">
        <img
          className="rounded-md shadow-md shadow-black/40"
          src={imgUrl}
          alt={imgAltText ?? ""}
        />
      </div>
      <span className="text-md text-white text-center">{dispText}</span>
    </div>
  );
}
