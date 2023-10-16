import * as React from "react";
import { useState } from "react";

import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import { useLocation } from "react-router-dom";
import { ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import {
  AuthContext,
  StorageService,
  FunctionsService,
} from "../../lib/firebase-services";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { FaSpinner } from "react-icons/fa";

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

export default function Edit() {
  const loc = useLocation();
  const imagePassed: ImageAsset | null = loc.state; // TODO maybe change to where can check if this is already saved to provide an overwrite option
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const editorRef = React.createRef<ImageEditor>();
  const user = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!user) navigate("/signin");
  }, [user, navigate]);

  React.useEffect(() => {
    const handleWindowResize = () => {
      const newWinSize = getWindowSize();
      setWindowSize((curWinSize) => ({ ...curWinSize, ...newWinSize }));
      editorRef.current?.getInstance().ui.resizeEditor({
        uiSize: {
          width: `${newWinSize.innerWidth - 100}px`,
          height: `${newWinSize.innerHeight - 100}px`,
        },
      });
      // editorRef.current?.resizeCanvasDimension({
      //   width: newWinSize.innerWidth - 100,
      //   height: newWinSize.innerHeight - 100,
      // });
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize, editorRef]);
  console.debug(`Image URL: ${imagePassed?.urls.orig}`);

  const saveImage = async () => {
    if (!user) return;
    setLoading(true);
    const img = FunctionsService.getBase64DataStringUint8Array(
      editorRef.current?.getInstance().toDataURL() ?? ""
    );
    console.log("Data", img);
    const imgBlob = FunctionsService.getUint8ArrayImageblob(img, "image/png"); // could check type here, but we know tui-image-editor always uses png

    if (!imgBlob || !imgBlob.size) {
      console.error("Error getting image blob");
      setLoading(false);
      return;
    }
    console.log(`Uploading ${imgBlob.size} byte ${imgBlob.type}`);
    const imgThumbBlob = await FunctionsService.resizeImageBlob(imgBlob, 200);
    // Can't let file names have commas or it causes issues with content dispotition header
    const title =
      (imagePassed?.title ?? "Untitled") +
      ` (edited ${new Date().toISOString()})`;
    const uploadTask = StorageService.imagesRef(user.uid) // upload main image
      .child(title)
      .put(imgBlob, {
        contentType: imgBlob.type,
        customMetadata: {
          title: title,
          description: imagePassed?.description ?? "",
          sourceAPI: imagePassed?.sourceAPI ?? "None",
        },
      });
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      null,
      (error) => {
        console.error("Error uploading image", error);
        setLoading(false);
        // todo: delete/cancel thumbnail here
      },
      () => {
        console.debug("Image uploaded successfully");
        setLoading(false);
      }
    );

    // upload thumbnail, we don't really care if it fails
    if (imgThumbBlob) {
      StorageService.thumbnailsRef(user.uid)
        .child(title)
        .put(imgThumbBlob, { contentType: imgThumbBlob.type })
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

  return (
    <div className="max-w-min mx-auto my-4">
      <button
        onClick={saveImage}
        className="bg-grey-900 flex justify-center text-center text-white border-white border-solid border-2 rounded-3xl text-sm font-bold absolute top-24 left-14 z-50 w-[120px] py-2"
      >
        {loading ? (
          <FaSpinner
            aria-hidden={true}
            className="w-5 h-5 3xl:h-8 3xl:w-8 animate-spin"
          />
        ) : (
          "Save"
        )}
      </button>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: imagePassed?.urls.orig ?? "",
            name: "SampleImage",
          },
          theme,
          //menu: ["shape", "filter"],
          initMenu: "filter",
          uiSize: {
            width: `${windowSize.innerWidth - 100}px`,
            height: `${windowSize.innerHeight - 100}px`,
          },
          menuBarPosition: "bottom",
        }}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
        ref={editorRef}
      />
    </div>
  );
}

const theme = {
  "common.bi.image": "https://www.colorhexa.com/374151.png",
  "common.bisize.width": "50px",
  "common.bisize.height": "50px",
  "common.backgroundImage": "none",
  "common.backgroundColor": "#374151",
  "common.border": "0px",

  // header
  "header.backgroundImage": "none",
  "header.backgroundColor": "transparent",
  "header.border": "0px",

  // load button
  "loadButton.backgroundColor": "#fff",
  "loadButton.border": "1px solid #ddd",
  "loadButton.color": "#222",
  "loadButton.fontFamily": `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  "loadButton.fontSize": "12px",

  // download button
  "downloadButton.backgroundColor": "#1f2937",
  "downloadButton.border": "2px solid #fff",
  "downloadButton.color": "#fff",
  "downloadButton.fontFamily": `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  "downloadButton.fontSize": "14px",

  "menu.backgroundColor": "#1f2937",

  // icons default
  "menu.normalIcon.color": "#8a8a8a",
  "menu.activeIcon.color": "#fff",
  "menu.disabledIcon.color": "#555555",
  "menu.hoverIcon.color": "#e9e9e9",
  "submenu.normalIcon.color": "#8a8a8a",
  "submenu.activeIcon.color": "#e9e9e9",

  "menu.iconSize.width": "24px",
  "menu.iconSize.height": "24px",
  "submenu.iconSize.width": "32px",
  "submenu.iconSize.height": "32px",

  // submenu primary color
  "submenu.backgroundColor": "#1f2937",
  "submenu.partition.color": "#858585",

  // submenu labels
  "submenu.normalLabel.color": "#1f2937",
  "submenu.normalLabel.fontWeight": "lighter",
  "submenu.activeLabel.color": "#fff",
  "submenu.activeLabel.fontWeight": "lighter",

  // checkbox style
  "checkbox.border": "1px solid #ccc",
  "checkbox.backgroundColor": "#fff",

  // rango style
  "range.pointer.color": "#fff",
  "range.bar.color": "#666",
  "range.subbar.color": "#d1d1d1",

  "range.disabledPointer.color": "#414141",
  "range.disabledBar.color": "#282828",
  "range.disabledSubbar.color": "#414141",

  "range.value.color": "#fff",
  "range.value.fontWeight": "lighter",
  "range.value.fontSize": "11px",
  "range.value.border": "1px solid #353535",
  "range.value.backgroundColor": "#151515",
  "range.title.color": "#fff",
  "range.title.fontWeight": "lighter",

  // colorpicker style
  "colorpicker.button.border": "1px solid #1e1e1e",
  "colorpicker.title.color": "#fff",
};
