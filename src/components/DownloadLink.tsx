import React from "react";
import { saveAs } from "file-saver";

interface DownloadProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  /**
   * Used for file saving
   */
  imgTitle?: string;
  /**
   * The description of the target of the download for screenreaders.
   * For example, passing "image" will have the screen reader read
   * "download image".
   */
  downloadTargetDesc?: string;
}

export default function Download(props: DownloadProps) {
  const fileName =
    (props.imgTitle?.replace(/\s/g, "_").replace("orig", "") ??
      props.href?.split("\\").pop()?.split("/").pop() ??
      "download") + ".jpg";
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const dataURL = props.href ?? ""; //this.toDataURL();
    saveAs(dataURL, fileName);
  };
  // const onClick = props.href ? handleDownloadClick : undefined; // eslint-disable-line @typescript-eslint/no-unused-vars
  const { imgTitle, downloadTargetDesc, ...anchorProps } = props;
  return (
    <a
      {...anchorProps}
      aria-label={`download ${downloadTargetDesc ?? ""}`}
      download
      onClick={handleDownloadClick}
    >
      {props.children}
    </a>
  );
}
