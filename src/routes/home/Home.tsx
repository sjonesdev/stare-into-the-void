import * as React from 'react';
import { FaRegEye } from "react-icons/fa";
import { BsSearch } from 'react-icons/bs';
import Apod from '../../components/Apod';
// import { useState, useEffect } from 'react';



export default function Home() {
  return (
   <div className="h-2/3 w-3/4 mx-auto mt-20 flex flex-col items-center justify-center">
      <FaRegEye 
        className="h-1/2 w-1/2 text-white"  
      />
      <h1 className="text-white text-3xl mb-5 font-medium">
        Stare Into The Void
      </h1>
      <form className="flex bg-charcoal bg-opacity-90 rounded-md text-white w-2/3 h-20">
        <button type="submit" className="mx-2 text-white">
          <BsSearch />
        </button>
        <input 
          type="text" 
          className="border-none outline-none rounded-md bg-charcoal bg-opacity-70 placeholder-white text-md font-medium flex-grow"
          placeholder="Search"
        />
      </form>
      <div className="bg-gray-500 bg-opacity-80 rounded-xl h-5/6 w-2/3 my-5 flex-col justify-center">
        <h1 className="text-white font-medium text-center mt-5">
          Astronomy Picture of the Day
        </h1>
        <Apod
          imgUrl="https://apod.nasa.gov/apod/image/2211/LunarEclipseRyanHan1024.jpg"
          date="11 November 2022"
          title="Blood Moon, Ice Giant"
          description="On November 8 the Full Moon turned blood red as it slid through Earth's shadow in a beautiful total lunar eclipse.
          During totality it also passed in front of, or occulted, outer planet Uranus for eclipse viewers located in parts of northern America 
          and Asia. For a close-up and wider view these two images were taken just before the occultation began, captured with different 
          telescopes and cameras from the same roof top in Shanghai, China. Normally very faint compared to a Full Moon, the tiny, pale, greenish 
          disk of the distant ice giant is just to the left of the Moon's edge and about to disappear behind the darkened, red lunar limb. Though 
          only visible from certain locations across planet Earth, lunar occultations of planets are fairly common. But for this rare lunar 
          eclipse occultation to take place, at the time of the total eclipse the outer planet had to be both at opposition and very near the 
          ecliptic plane to fall in line with Sun, Earth, and Moon."
        />
      </div>
   </div>
  );
}