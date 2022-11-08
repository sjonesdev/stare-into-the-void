interface ImagePreviewProps {
  imgUrl: string;
  dispText: string;
  imgAltText?: string;
}

export default function ImagePreview({
  imgUrl,
  dispText,
  imgAltText,
}: ImagePreviewProps) {
  return (
    <div className="flex flex-col">
      <div className="">
        <img src={imgUrl} alt={imgAltText ?? ""} />
      </div>
      <span className="">{dispText}</span>
    </div>
  );
}
