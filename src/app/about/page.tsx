import Image from "next/image";
import "./About.css";
import Link from "next/link";

export default async function About() {
  return (
    <div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-gray-800 text-white shadow-lg">
          <Image
            className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
            src="/nebula.jpg"
            alt="nebula"
            width={1074}
            height={895}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
            src="/browser.jpg"
            alt="image browser example"
            width={1497}
            height={825}
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
            src="/editor.jpg"
            alt="editor example"
            width={657}
            height={756}
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
      <div className="mx-auto my-4 text-center text-white">
        <Link className="hover:text-gray-300 transition" href="/about/tos">
          Terms of Service
        </Link>
        <span className="mx-2">|</span>
        <Link className="hover:text-gray-300 transition" href="/about/privacy">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
