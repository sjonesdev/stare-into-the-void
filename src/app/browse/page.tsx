import BrowseClient from "./BrowseClient";
import { queryImages } from "../../lib-server/nasa-api";

export default async function Browse() {
  const images = await queryImages("");
  return <BrowseClient initialQueryImgs={images} />;
}
