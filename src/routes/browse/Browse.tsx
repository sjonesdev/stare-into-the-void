/* eslint-disable @typescript-eslint/no-unused-vars */
import { Listbox } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import Button from "../../components/Button";
import CheckboxDropdown from "../../components/CheckboxDropdown";
import DatePicker from "../../components/DatePicker";
import ImagePreview from "../../components/ImagePreview";
import SelectDropdown from "../../components/SelectDropdown";
import { FunctionsService } from "../../lib/firebase-services";
import { ApiInfo } from "../../lib/apiInfo";
import { title } from "process";
import { type ImageAsset } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { useParams } from "react-router-dom";

const apis: {
  value: string;
  tooltip: string;
  isDefault: boolean;
}[] = [];
for (const key in ApiInfo) {
  const apiVal = {
    value: ApiInfo[key].name,
    tooltip: ApiInfo[key].desc,
    isDefault: true,
  };
  apis.push(apiVal);
}

const sortOpts = ["Recent", "Relevant", "Something else idk"];

const testImgInfo = [
  {
    url: "https://picsum.photos/500/500",
    title: "Random Picture",
  },
  {
    url: "https://picsum.photos/300/500",
    title: "Random Picture 2",
  },
  {
    url: "https://picsum.photos/500/300",
    title: "Random Picture 3",
  },
  {
    url: "https://picsum.photos/250/250",
    title: "Random Picture 4",
  },
  {
    url: "https://picsum.photos/1000/1000",
    title: "Random Picture 5",
  },
  {
    url: "https://picsum.photos/640/480",
    title: "Random Picture 6",
  },
  {
    url: "https://picsum.photos/480/640",
    title: "Random Picture 6",
  },
];

export default function Browse() {
  const { query } = useParams();
  const [selectedAPIs, setSelectedAPIs] = React.useState<Set<string>>();
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();
  const [sortBy, setSortBy] = React.useState(sortOpts[0]);
  const [selectedPreview, setSelectedPreview] = React.useState<number | null>();

  // If image drawer is not open, will be null or undefined, else will be url of selected img
  const [openImg, setOpenImg] = React.useState<string>("");
  const [imgs, setImgs] = React.useState<ImageAsset[]>([]);

  React.useEffect(() => {
    FunctionsService.instance.getNIVLWithQuery("earth").then((val) => {
      const processedVal = val.map((img, idx) => {
        img.date = new Date(img.date);
        return img;
      });
      setImgs(val);
    });
  }, []);

  const apiSelector = (
    <CheckboxDropdown
      dropdownText="Select Source APIs"
      values={apis}
      setValues={setSelectedAPIs}
    />
  );

  const dateRangeSelector = (
    <fieldset className="flex items-center mx-4">
      <DatePicker labelText="From" inputName="from" setDate={setFromDate} />
      <DatePicker labelText="To" inputName="to" setDate={setToDate} />
    </fieldset>
  );

  const sortBySelector = (
    <SelectDropdown values={sortOpts} setValue={setSortBy} />
  );

  const getImgs = () => {
    const imgResults: JSX.Element[] = [];
    imgs.forEach((img, idx) => {
      if (
        (!fromDate || img.date.valueOf() >= fromDate.valueOf()) &&
        (!toDate || img.date.valueOf() <= toDate.valueOf()) &&
        (!selectedAPIs || selectedAPIs.has(img.sourceAPI))
      ) {
        imgResults.push(
          <ImagePreview
            onClick={() => setSelectedPreview(idx)}
            key={idx}
            cols={selectedPreview ? 3 : 6}
            selected={selectedPreview === idx}
            {...img}
          />
        );
      }
    });

    return imgResults;
  };

  return (
    <>
      <div className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <form className="relative h-16 flex items-center text-gray-300">
            {apiSelector}
            {dateRangeSelector}
            {sortBySelector}
          </form>
        </div>
      </div>
      <div className="w-10/12 bg-charcoal bg-opacity-80 rounded-xl max-h-max mx-auto my-12 p-8">
        <h2 className="text-white text-xl text-center">
          Results for <span className="font-bold">"{query}"</span>
        </h2>
        <div
          className={`${
            selectedPreview ? "w-1/2" : "w-full"
          } flex flex-col md:flex-row flex-wrap justify-around items-center md:items-start`}
        >
          {getImgs()}
        </div>
      </div>
      {selectedPreview && (
        <div className="fixed right-0 bottom-12 top-12 shadow-lg shadow-black/40 rounded-l-xl w-1/2 bg-gray-500 text-white">
          <button
            className="absolute pt-4 pl-4"
            onClick={() => setSelectedPreview(null)}
          >
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-col items-center">
            <div className="my-7 mx-auto w-10/12 bg-gray-700 rounded-lg shadow-black/40 shadow-md">
              <img
                className="h-[24rem] object-scale-down mx-auto"
                src={imgs[selectedPreview].url}
                alt=""
              />
            </div>
            <div className="w-10/12 flex justify-between mb-4 items-end">
              <span className="font-bold text-xl ">
                {imgs[selectedPreview].title}
              </span>
              <div>
                <span>Taken: </span>
                <span>
                  {imgs[selectedPreview].date.toUTCString().slice(0, 16)}
                </span>
              </div>
            </div>
            <p className="w-10/12">{imgs[selectedPreview].description}</p>
            <div className="w-10/12 flex justify-evenly m-8">
              <Button text="Download" />
              <Button text="Edit" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
