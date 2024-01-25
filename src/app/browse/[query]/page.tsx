import BrowseClient from "../BrowseClient";
import { FunctionsService } from "../../../lib/firebase-services";

export default async function BrowseQuery(
  {
    params,
  }: {
    params: { query: string };
  } = { params: { query: "" } }
) {
  // TODO maybe switch to using query params instead of path params using export const dynamic = 'force-dynamic'; and useSearchParams on server
  const images = await FunctionsService.fetchImages(params.query ?? "");
  return <BrowseClient initialQueryImgs={images} />;
}
