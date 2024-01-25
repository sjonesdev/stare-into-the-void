"use client";

// TODO - change this to be a mapped type or whatever tf from SourceAPI
export const ApiInfo: { [index: string]: { name: string; desc: string } } = {
  APOD: {
    name: "Astronomy Picture Of The Day",
    desc: "NASA Selected Astronomy Picture Of The Day",
  },
  Earth: {
    name: "Earth",
    desc: "Unlock the significant public investment in Earth observation data",
  },
  EONET: {
    name: "EONET",
    desc: "The Earth Observatory Natural Event Tracker",
  },
  EPIC: {
    name: "EPIC",
    desc: "Earth Polychromatic Imaging Camera",
  },
  MarsRoverPhotos: {
    name: "Mars Rover Photos",
    desc: "Image data gathered by NASA's Curiosity, Opportunity, and Spirit Rovers on Mars",
  },
  ImageAndVideoLibrary: {
    name: "NASA Image & Video Lib",
    desc: "API to access the NASA Image and Video Library site at images.nasa.gov",
  },
  VMMTWMTS: {
    name: "Vesta/Moon/Mars Trek WMTS",
    desc: "A Web Map Tile Service for the Vesta, Moon, and Mars Trek imagery projects",
  },
} as const;

export type ApiInfoValue = (typeof ApiInfo)[keyof typeof ApiInfo];
