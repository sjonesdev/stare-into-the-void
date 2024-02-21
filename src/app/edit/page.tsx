"use client";

import { createRef, useContext, useEffect, useState } from "react";
import type TuiImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import {
  type ImageAsset,
  SourceAPI,
} from "../../../stare-into-the-void-functions/src/models/image-assets";
import { useSearchParams } from "next/navigation";
import "firebase/compat/storage";
import { FaSpinner } from "react-icons/fa";
import { AuthContext } from "../../lib-client/FirebaseContextProvider";
import useStorage from "../../lib-client/useStorage";
import useFunctions from "../../lib-client/useFunctions";

export default function Edit() {
  const searchParams = useSearchParams();
  const [imagePassed, setImagePassed] = useState<ImageAsset | null>();

  const editorRef = createRef<HTMLDivElement>();
  const user = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageEditor, setImageEditor] = useState<TuiImageEditor | null>(null);
  const storage = useStorage();
  const functions = useFunctions();

  useEffect(() => {
    if (!functions || !editorRef.current)
      return console.warn("No functions or editor ref");
    console.log("Edit page mounted");
    const urlImage = {
      title: searchParams.get("title") ?? "Untitled",
      description: "User edited image",
      urls: {
        orig: searchParams.get("orig") ?? "",
        thumb: searchParams.get("orig") ?? "",
      },
      sourceAPI: searchParams.get("sourceAPI") ?? SourceAPI.None,
      date: new Date(),
    } as ImageAsset;
    setImagePassed(urlImage);

    // TUI Image Editor is not made for Next.js with initial HTML construction being on the server, as it references "self" object on import
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TuiImageEditor = require("tui-image-editor");

    const ref = editorRef.current;

    const setImageEditorFromPath = (path: string) => {
      setImageEditor(
        new TuiImageEditor(ref, {
          includeUI: {
            loadImage: {
              path: path,
              name: urlImage?.title ?? "Untitled",
            },
            theme,
            //menu: ["shape", "filter"],
            initMenu: "filter",
            uiSize: {
              width: 0,
              height: 0,
            },
            menuBarPosition: "bottom",
          },
          selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70,
          },
          usageStatistics: true,
        })
      );
    };

    if (urlImage?.urls.orig) {
      console.debug("Downloading Image");
      functions.downloadImage(urlImage?.urls.orig).then((blob) => {
        if (blob) {
          console.debug("blob", blob);
          setImageEditorFromPath(URL.createObjectURL(blob));
        } else {
          console.error("Blob was null");
          setImageEditorFromPath("");
        }
      });
    } else {
      console.debug("No image URL provided");
      setImageEditorFromPath("");
    }
  }, [functions, searchParams]);

  useEffect(() => {
    const handleWindowResize = () => {
      const newWinSize = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
      };
      imageEditor?.ui?.resizeEditor({
        uiSize: {
          width: `${newWinSize.innerWidth - 100}px`,
          height: `${newWinSize.innerHeight - 100}px`,
        },
      });
    };
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [imageEditor]);
  console.debug(`Image URL: ${imagePassed?.urls.orig}`);

  const saveImage = () => {
    if (!storage) {
      console.warn("Save before storage is ready");
      return;
    }
    // Can't let file names have commas or it causes issues with content disposition header
    const title =
      (imagePassed?.title ?? "Untitled") +
      ` (edited ${new Date().toISOString()})`;
    storage.saveImage(
      imageEditor?.toDataURL() ?? "",
      title,
      imagePassed?.description ?? "",
      imagePassed?.sourceAPI ?? SourceAPI.None,
      user?.uid ?? "",
      (error) => {
        console.error(error);
        setLoading(false);
      },
      () => {
        console.debug("Image saved successfully");
        setLoading(false);
      }
    );
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
      <div ref={editorRef} />
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
