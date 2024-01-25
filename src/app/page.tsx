"use client";
import { FaRegEye } from "react-icons/fa";
import Apod from "../components/Apod";
import SearchBar from "./SearchBar";
import { FunctionsService } from "../lib/firebase-services";
import { type SourceAPI } from "../../stare-into-the-void-functions/src/models/image-assets";
import { useState } from "react";
import useOnMount from "../hooks/useOnMount";

export default function Home() {
  const [apod, setApod] = useState({
    title: "",
    urls: {
      orig: "",
      thumb: "",
    },
    description: "",
    date: new Date(),
    sourceAPI: "None" as SourceAPI,
  });
  useOnMount(() => {
    FunctionsService.getPictureOfTheDay().then((newApod) => {
      if (newApod) {
        setApod(newApod);
      }
    });
  });

  return (
    <div className="h-2/3 w-3/4 mx-auto pt-20 flex flex-col items-center justify-center max-h-screenminusnav">
      <FaRegEye className="h-1/2 w-1/2 text-white" />
      <h1 className="text-white text-3xl mb-5 font-medium 2xl:text-6xl">
        Stare Into The Void
      </h1>
      <SearchBar />
      <div className="bg-gray-500 bg-opacity-80 rounded-xl h-5/6 w-2/3 3xl:w-1/2 my-5 flex-col justify-center">
        <h2 className="text-white font-medium text-center mt-5 3xl:text-3xl">
          Astronomy Picture of the Day
        </h2>
        <Apod apod={apod} />
      </div>
    </div>
  );
}
