import * as React from "react";
import { useState } from "react";

import ImageEditor from "@toast-ui/react-image-editor";
import ImageEditorClass from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";

interface EditProps {
  imgUrl?: string;
}

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

export default function Edit({ imgUrl }: EditProps) {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const editorRef = React.createRef<ImageEditorClass>();

  const handleWindowResize = () => {
    const newWinSize = getWindowSize();
    setWindowSize((curWinSize) => ({ ...curWinSize, ...newWinSize }));
    editorRef.current?.ui?.resizeEditor({
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

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize]);

  return (
    <ImageEditor
      includeUI={{
        loadImage: {
          path: imgUrl ?? "",
          name: "SampleImage",
        },
        //menu: ["shape", "filter"],
        initMenu: "filter",
        uiSize: {
          width: `${windowSize.innerWidth - 100}px`,
          height: `${windowSize.innerHeight - 100}px`,
        },
        menuBarPosition: "bottom",
      }}
      cssMaxHeight={500}
      cssMaxWidth={700}
      selectionStyle={{
        cornerSize: 20,
        rotatingPointOffset: 70,
      }}
      usageStatistics={true}
      ref={editorRef}
    />
  );
}
