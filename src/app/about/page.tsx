import Image from "next/image";
import "./About.css";

export default async function About() {
  return (
    <div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-gray-800 text-white shadow-lg">
          <Image
            className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
            src="nebula.jpg"
            alt=""
          />
          <div className="p-6 flex flex-col justify-start">
            <h5 className="text-xl font-medium mb-2">Browse</h5>
            <p className="text-base mb-4">
              View thousands of images from NASA&#39;s image libraries in a
              variety of subjects, from astronomy to rocketry.
            </p>
          </div>
        </div>
        <div className="pad-div"></div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="pad-div"></div>
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-gray-800 text-white shadow-lg">
          <Image
            className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
            src="browser.jpg"
            alt=""
          />
          <div className="p-6 flex flex-col justify-start">
            <h5 className="text-xl font-medium mb-2">Search</h5>
            <p className="text-base mb-4">
              Quick and easy keyword searches to help you find the exact images
              you need.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-gray-800 text-white shadow-lg">
          <Image
            className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
            src="editor.jpg"
            alt=""
          />
          <div className="p-6 flex flex-col justify-start">
            <h5 className="text-xl font-medium mb-2">Edit</h5>
            <p className="text-base mb-4">
              Draw, crop, scale, filter, and more with a robust image editing
              tool. One-click downloads make saving the images you need easy!
            </p>
          </div>
        </div>
        <div className="pad-div"></div>
      </div>
    </div>
  );
}
