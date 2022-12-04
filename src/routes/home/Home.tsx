import * as React from "react";
import { FaRegEye } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import Apod from "../../components/Apod";
import { useNavigate } from "react-router-dom";
import { FunctionsService } from "../../lib/firebase-services";
import { APODImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
// import { useState, useEffect } from 'react';

export default function Home() {
  const [searchStr, setSearchStr] = React.useState<string>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/browse/${searchStr}`);
  };

  const[apodImg, setApodImg] = React.useState<APODImageAsset>();

  React.useEffect(() => {
    FunctionsService.instance.getPictureOfTheDay().then(res => {
      setApodImg(res ?? "");
    });
  }, []);

  return (
    <div className="h-2/3 w-3/4 mx-auto mt-20 flex flex-col items-center justify-center">
      <FaRegEye className="h-1/2 w-1/2 text-white" />
      <h1 className="text-white text-3xl mb-5 font-medium">
        Stare Into The Void
      </h1>
      <form
        className="flex bg-charcoal bg-opacity-90 rounded-md text-white w-2/3 h-20"
        onSubmit={handleSubmit}
      >
        <button type="submit" className="mx-2 text-white">
          <BsSearch />
        </button>
        <input
          type="text"
          className="border-none outline-none rounded-md bg-charcoal bg-opacity-70 placeholder-white text-md font-medium flex-grow"
          placeholder="Search"
          onChange={(e) => setSearchStr(e.target.value)}
        />
      </form>
      <div className="bg-gray-500 bg-opacity-80 rounded-xl h-5/6 w-2/3 my-5 flex-col justify-center">
        <h1 className="text-white font-medium text-center mt-5">
          Astronomy Picture of the Day
        </h1>
        <Apod
          imgUrl= { apodImg?.urls.orig! }
          date= { apodImg?.date! }
          title= { apodImg?.title! }
          description= { apodImg?.description! }
          mediaType = { apodImg?.mediaType! }
        />
      </div>
    </div>
  );
}
