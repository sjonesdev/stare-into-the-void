import * as React from "react";
import Recents from "../../components/Recents";
import { ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";

// import { useState, useEffect } from 'react';

export default function Recent({recentImgs}: {recentImgs: ImageAsset[]}) {

  if(recentImgs === undefined){
    return (
      <div className="w-10/12 text-white bg-charcoal bg-opacity-90 rounded-xl max-h-max mx-auto my-12 p-8 flex flex-wrap justify-between">
          <h1>No recent images</h1>
      </div>
    );
  }
 else {
  return (
    <>
      <div className="w-10/12 bg-charcoal bg-opacity-90 rounded-xl max-h-max mx-auto my-12 p-8 flex flex-wrap justify-between">
        <Recents imgs={recentImgs} />
      </div>
    </>
  );
 }
}
