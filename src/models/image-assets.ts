import * as ImageResponses from "./image-responses";

export enum SourceAPI{
  ImageAndVideoLibrary="ImageAndVideoLibrary",
  APOD="AstronomyPictureOfTheDay",
  MarsRoverPhotos="MarsRoverPhotos"
}

/**
 * NASA image asset class to be used in frontend components
 */
export class ImageAsset {
  public title: string;
  public url: string;
  public description: string;
  public date: Date;
  public sourceAPI: SourceAPI;

  constructor(title: string, url: string, description: string, date: Date, source: SourceAPI) {
    this.title = title;
    this.url = url;
    this.description = description;
    this.date = date;
    this.sourceAPI = source;
  }
}

/**
 * Encapsulates extra information specific to each API
 */
export class IVLImageAsset extends ImageAsset {
  public center: string;
  public keywords: string[];
  public nasaId: string;

  constructor(response: ImageResponses.NIVLResponse) {
    super(response.data.title, response.href, response.data.description, response.data.date_created, SourceAPI.ImageAndVideoLibrary);
    this.center = response.data.center;
    this.keywords = response.data.keywords;
    this.nasaId = response.data.nasa_id;
  }
}

export class APODImageAsset extends ImageAsset {
  copyright: string;
  serviceVersion: string;

  constructor(response: ImageResponses.APODResponse) {
    super(response.title, response.url, response.explanation, response.date, SourceAPI.APOD);
    this.copyright = response.copyright;
    this.serviceVersion = response.service_version;
  }
}

export class MRPImageAsset extends ImageAsset {
  sol: number;

  constructor(response: ImageResponses.MRPResponse) {
    super(MRPImageAsset.getTitle(response), response.img_src, MRPImageAsset.getDescription(response), response.earth_date, SourceAPI.MarsRoverPhotos);
    this.sol = response.sol;
  }

  private static getTitle(response: ImageResponses.MRPResponse) {
    return response.rover.name + " rover image " + response.id;
  }

  private static getDescription(response: ImageResponses.MRPResponse) {
    return "This image was taken by the " + response.rover.name + " rover with its " + response.camera.name + "on Martian sol " + response.sol + ".";
  }
}
