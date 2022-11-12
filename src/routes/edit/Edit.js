import * as React from 'react';
import { useState } from 'react';

import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";

export default function Edit() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  React.useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return() => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  return (
    <ImageEditor
      includeUI={{
        loadImage: {
          path: "img/sampleImage.jpg",
          name: "SampleImage",
        },
        //menu: ["shape", "filter"],
        initMenu: "filter",
        uiSize: {
          width: windowSize.innerWidth,
          height: "875px"
        },
        menuBarPosition: "bottom"
      }}
      cssMaxHeight={500}
      cssMaxWidth={700}
      selectionStyle={{
        cornerSize: 20,
        rotatingPointOffset: 70,
      }}
      usageStatistics={true}
    />
  );
}