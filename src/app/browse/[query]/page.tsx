import { queryImages } from "../../../server-lib/nasa-api";
import BrowseClient from "../BrowseClient";

export default async function BrowseQuery({
  params,
}: {
  params: { query: string };
}) {
  // TODO maybe switch to using query params instead of path params using export const dynamic = 'force-dynamic'; and useSearchParams on server
  const images = await queryImages(params.query ?? "");
  return <BrowseClient initialQueryImgs={images} />;
}
