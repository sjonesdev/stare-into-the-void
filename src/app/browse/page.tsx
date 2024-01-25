import BrowseClient from "./BrowseClient";
import { FunctionsService } from "../../lib/firebase-services";

export default async function Browse() {
  const images = await FunctionsService.fetchImages("");
  return <BrowseClient initialQueryImgs={images} />;
}
