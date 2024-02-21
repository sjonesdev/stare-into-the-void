import {
  SourceAPI,
  type ImageAsset,
} from "../../stare-into-the-void-functions/src/models/image-assets";

export async function getPictureOfTheDay(): Promise<ImageAsset> {
  const URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
  const response = await fetch(URL);
  if (response.status !== 200)
    throw new Error(
      `Failed to fetch APOD with status ${response.status} and message ${response.statusText}`
    );
  const data = await response.json();

  return {
    title: data.title,
    urls: {
      orig: data.url,
      thumb: "",
    },
    description: data.explanation,
    date: new Date(), //data.date,
    sourceAPI: SourceAPI.APOD,
  };
}

interface NIVLNextLink {
  rel: "next";
  prompt: "Next";
  href: string;
}

interface NIVLPrevLink {
  rel: "prev";
  prompt: "Previous";
  href: string;
}

interface NIVLResponse {
  collection?: {
    version: string;
    href: string;
    items: {
      href: string;
      data: [
        {
          center: string;
          title: string;
          keywords: string[];
          nasa_id: string;
          date_created: string;
          media_type: string;
          description: string;
        }
      ];
      links: { href: string; rel: string; render: string }[];
    }[];
    metadata: { total_hits: number };
    links: (NIVLNextLink | NIVLPrevLink)[];
  };
  reason?: string;
}

export interface ImageQueryResults {
  images: ImageAsset[];
  loadMore?: () => Promise<ImageQueryResults>; // if there are more images to load
}

function getImageURLs(manifestUrl: string) {
  const baseUrl = "https://images-assets.nasa.gov/image/";
  const strings = manifestUrl.split("/");
  const urls = {
    orig: baseUrl + strings[4] + "/" + strings[4] + "~orig.jpg",
    thumb: baseUrl + strings[4] + "/" + strings[4] + "~thumb.jpg",
  };
  // return baseUrl + strings[4] + "/" + strings[4] + "~orig.jpg";
  return urls;
  // TODO - also probably need to handle other types of images other than jpg, as that's
  // likely where the errors are coming from client side
}

export async function queryImages(
  query: string,
  page = 1
): Promise<ImageQueryResults> {
  const URL = `https://images-api.nasa.gov/search?q=${query}&page=${page}`;
  const response = await fetch(URL);
  const body: NIVLResponse = await response.json();
  if (body.reason || !body.collection) {
    return {
      images: [],
    };
  }
  const images: ImageAsset[] = [];
  for (const item of body.collection.items) {
    images.push({
      title: item.data[0].title,
      urls: getImageURLs(item.href),
      description: item.data[0].description,
      date: new Date(item.data[0].date_created),
      sourceAPI: SourceAPI.ImageAndVideoLibrary,
    });
  }
  const hasMore = body.collection.links.some((link) => link.rel === "next");
  return {
    images,
    loadMore: hasMore
      ? async () => {
          "use server";
          return queryImages(query, page + 1);
        }
      : undefined,
  };
}
