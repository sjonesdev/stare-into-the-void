import { useContext, useState } from "react";
import { RiImageEditLine } from "react-icons/ri";
import { BiSolidErrorCircle } from "react-icons/bi";
import {
  FaDownload,
  FaSave,
  FaTrash,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";
import DownloadLink from "./DownloadLink";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import {
  AuthContext,
  FunctionsService,
  StorageService,
} from "../lib/firebase-services";

interface ImagePreviewProps {
  img: ImageAsset;
  lastOpened?: string;
  selected?: boolean;
  saved?: boolean;
  onDelete?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ImagePreview({
  img,
  lastOpened,
  selected,
  saved = false,
  onClick,
  onDelete,
}: ImagePreviewProps) {
  const navigate = useNavigate();
  const user = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const saveImage = async () => {
    if (!user) {
      console.warn("Save with no user");
      return;
    }
    setLoading(true);
    const imgBuf = await FunctionsService.getImageBlob(img.urls.orig); //getImageBuffer(img.urls.orig);
    if (!imgBuf || !imgBuf.size) {
      //buffer.byteLength) {
      console.error("Error getting image buffer");
      setLoading(false);
      setError(true);
      setDone(true);
      return;
    }
    console.debug(`Uploading ${imgBuf.size} byte ${imgBuf.type}`);
    const imgThumbBuf = await FunctionsService.getImageBlob(img.urls.thumb); //.getImageBuffer(img.urls.thumb);
    const uploadTask = StorageService.imagesRef(user.uid) // upload main image
      .child(img.title)
      // .putString(img.urls.orig, "raw", { TODO: support storing original URL for unmodified files to save space
      .put(imgBuf, {
        //.buffer, {
        contentType: imgBuf.type,
        customMetadata: {
          title: img.title,
          description: img.description,
          sourceAPI: img.sourceAPI,
        },
      });
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      null,
      (error) => {
        console.error("Error uploading image", error);
        setLoading(false);
        setError(true);
        // todo: delete/cancel thumbnail here
      },
      () => {
        console.debug("Image uploaded successfully");
        setLoading(false);
        setDone(true);
      }
    );

    // upload thumbnail, we don't really care if it fails
    if (imgThumbBuf) {
      StorageService.thumbnailsRef(user.uid)
        .child(img.title)
        .put(imgThumbBuf /*.buffer*/, { contentType: imgThumbBuf.type })
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          null,
          (error) => {
            console.error("Error uploading thumbnail", error);
          },
          () => {
            console.debug("Thumbnail uploaded successfully");
          }
        );
    }
  };

  const deleteImage = () => {
    if (!user) return;
    setLoading(true);
    StorageService.imagesRef(user.uid)
      .child(img.title)
      .delete()
      .then(() => {
        console.debug("Image deleted successfully");
        setLoading(false);
        setError(false);
        setDone(true);
        if (onDelete) {
          setTimeout(onDelete, 1000);
        }
      })
      .catch((error) => {
        console.error("Error deleting file", error);
        setLoading(false);
        setError(true);
        setDone(true);
      });
  };

  const getStorageButton = () => {
    if (!user) return <></>;
    let onClick;
    let label = "Operation success";
    let disabled = true;
    let Icon = FaCheck;
    let iconClassName = "w-5 h-5 3xl:h-8 3xl:w-8";
    let tooltip = "";
    if (loading) {
      Icon = FaSpinner;
      iconClassName += " animate-spin";
    } else if (error) {
      Icon = BiSolidErrorCircle;
      tooltip = "Error saving image, please refresh the page and try again";
    } else if (done) {
      Icon = FaCheck;
    } else if (saved) {
      Icon = FaTrash;
      disabled = false;
      onClick = deleteImage;
      label = "Delete image from account";
    } else {
      Icon = FaSave;
      disabled = false;
      onClick = saveImage;
      label = "Save image on account";
    }
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="block m-2"
        aria-label={label}
      >
        <Icon aria-hidden={true} className={iconClassName} />
        {tooltip && <span className="absolute text-xs">{tooltip}</span>}
      </button>
    );
  };

  return (
    <div
      className={`flex flex-col items-center p-2 lg:p-4 md:max-w-3xs lg:max-w-2xs 3xl:max-w-sm text-white`}
      onClick={onClick}
    >
      <div className="m-2 w-full h-full">
        <div
          className={`${
            selected
              ? "bg-indigo-300/25 border-indigo-300"
              : "bg-transparent border-transparent"
          } absolute -translate-x-2 -translate-y-2 h-[15rem] lg:w-[15rem] lg:h-[13rem] 3xl:w-[23rem] 3xl:h-[21rem] rounded-md border-solid border-2 transition-all`}
        />
        <div className="absolute bg-black/50 rounded-tl-md rounded-br-md">
          <button
            className="block m-1 3xl:m-2"
            aria-label="Open image in editor"
            onClick={() =>
              navigate("/edit", {
                state: img,
              })
            }
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
          {getStorageButton()}
        </div>
        <img
          className="rounded-md shadow-md shadow-black/40 object-cover md:w-48 md:h-40 lg:w-56 lg:h-48 3xl:w-[24rem] 3xl:h-80"
          src={img.urls.thumb}
          alt={img.title}
          loading="lazy"
        />
      </div>
      <span className="hidden md:block text-md 3xl:text-xl text-center">
        {img.title} {img.date.toUTCString().slice(5, 16)}
      </span>
      <span className="text-sm 3xl:text-xl text-center">
        {lastOpened ?? ""}
      </span>
    </div>
  );
}
