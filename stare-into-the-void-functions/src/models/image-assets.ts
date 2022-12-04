import * as ImageResponses from "./image-responses";

export enum SourceAPI {
  APOD="APOD",
  Earth="Earth",
  EONET="EONET",
  EPIC="EPIC",
  MarsRoverPhotos="MarsRoverPhotos",
  ImageAndVideoLibrary="ImageAndVideoLibrary",
  VMMTWMTS="VMMTWMTS"
}

/**
 * NASA image asset class to be used in frontend components
 */
export class ImageAsset {
  public title: string;
  public urls: {
    orig: string,
    thumb: string
  };
  public description: string;
  public date: Date;
  public sourceAPI: SourceAPI;

  constructor(title: string, urls: {orig: string, thumb: string}, description: string, date: Date, source: SourceAPI) {
    this.title = title;
    this.urls = urls;
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
    super(response.data.title, {orig: response.href, thumb: ""}, response.data.description, response.data.date_created, SourceAPI.ImageAndVideoLibrary);
    this.center = response.data.center;
    this.keywords = response.data.keywords;
    this.nasaId = response.data.nasa_id;
  }
}

export class APODImageAsset extends ImageAsset {
  copyright: string;
  serviceVersion: string;
  mediaType: string;

  constructor(response: ImageResponses.APODResponse) {
    super(response.title, {orig: response.url, thumb: ""}, response.explanation, response.date, SourceAPI.APOD);
    this.copyright = response.copyright;
    this.serviceVersion = response.service_version;
    this.mediaType = response.media_type;
  }
}

export class MRPImageAsset extends ImageAsset {
  sol: number;

  constructor(response: ImageResponses.MRPResponse) {
    super(MRPImageAsset.getTitle(response), {orig: response.img_src, thumb: ""}, MRPImageAsset.getDescription(response), response.earth_date, SourceAPI.MarsRoverPhotos);
    this.sol = response.sol;
  }

  private static getTitle(response: ImageResponses.MRPResponse) {
    return response.rover.name + " rover image " + response.id;
  }

  private static getDescription(response: ImageResponses.MRPResponse) {
    return "This image was taken by the " + response.rover.name + " rover with its " + response.camera.name + "on Martian sol " + response.sol + ".";
  }
}
