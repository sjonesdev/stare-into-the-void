import * as React from "react";
import ImagePreview from "../../components/ImagePreview";
// import { useState, useEffect } from 'react';

export default function Recent() {
  return (
    <>
      <div className="w-10/12 bg-charcoal bg-opacity-90 rounded-xl max-h-max mx-auto my-12 p-8 flex flex-wrap justify-between">
        <ImagePreview
          imgUrl="http://www.nasa.gov/sites/default/files/thumbnails/image/pia01492-main.jpg"
          dispText="Neptune"
          lastOpened="1 day ago"
        />
        <ImagePreview
          imgUrl="https://solarsystem.nasa.gov/internal_resources/4909"
          dispText="Jupiter"
          lastOpened="6 days ago"
        />
        <ImagePreview
          imgUrl="https://cdn.britannica.com/70/94870-050-2ECAB6AD/Cats-Eye-nebula.jpg"
          dispText="Nebulae"
          lastOpened="2 weeks ago"
        />
        <ImagePreview
          imgUrl="https://cdn.mos.cms.futurecdn.net/F3uDn2LY8hHM64Txj8DRK7.jpg"
          dispText="Supernova"
          lastOpened="3 weeks ago"
        />
        <ImagePreview
          imgUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3hiqqOgaTnG5BulC7TIxdKRZh2U3w5E-3ClvzGKB7j9Mdg1mUaFFb0QU7h2wT6x4xLbA&usqp=CAU"
          dispText="Trumpler 14"
          lastOpened="1 month ago"
        />
        <ImagePreview
          imgUrl="https://www.nasa.gov/images/content/188404main_hurt_Milky_Way_2005-590_lg.jpg"
          dispText="Milky Way"
          lastOpened="2 months ago"
        />
        <ImagePreview
          imgUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/STS41B-35-1613_-_Bruce_McCandless_II_during_EVA_%28Retouched%29.jpg/1200px-STS41B-35-1613_-_Bruce_McCandless_II_during_EVA_%28Retouched%29.jpg"
          dispText="Astronaut"
          lastOpened="6 months ago"
        />
      </div>
    </>
  );
}
