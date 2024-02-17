import BrowseClient from "./BrowseClient";
import { queryImages } from "../../server-lib/nasa-api";

export default async function Browse() {
  const images = await queryImages("");
  return <BrowseClient initialQueryImgs={images} />;
}
