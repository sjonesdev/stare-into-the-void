import { redirect } from "next/navigation";
import ClientSaved from "./ClientSaved";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import {
  ImageAsset,
  SourceAPI,
} from "../../../stare-into-the-void-functions/src/models/image-assets";
import {
  imageFiles,
  imgNamePrefixLen,
  thumbNamePrefixLen,
  thumbnailFiles,
  getDownloadURL,
} from "../../lib-server/storage-helpers";
import { app } from "../../lib-server/firebase";

export default async function Saved() {
  const auth = getAuth(app);
  const user = await auth
    .verifySessionCookie(cookies().get("__session")!.value, true)
    .then((decodedClaims) => {
      console.log("session cookie valid", decodedClaims);
      // Check custom claims to confirm user is an admin.
      // if (decodedClaims.admin === true) {
      //   return serveContentForAdmin('/admin', req, res, decodedClaims);
      // }
      // res.status(401).send('UNAUTHORIZED REQUEST!');
      return decodedClaims;
    })
    .catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      // res.redirect('/login');
      console.log("session cookie invalid", error);
    });

  if (!user) {
    redirect("/signin");
  }

  const imgPrefixLen = imgNamePrefixLen(user.uid);
  const thumbPrefixLen = thumbNamePrefixLen(user.uid);
  const userImgsPromise = imageFiles(user.uid);
  const userThumbsPromise = thumbnailFiles(user.uid);
  const saved = await Promise.all([userImgsPromise, userThumbsPromise]).then(
    (results) => {
      const [[imgs], [unorderedThumbs]] = results;

      // reorder thumbnails to match images order and get metadata
      const thumbUrls: Promise<string>[] = [];
      const thumbNames = unorderedThumbs.map((thumb) =>
        thumb.name.slice(thumbPrefixLen)
      );
      const imgUrls: Promise<string>[] = [];
      const imgMetadata = imgs.map((img) => {
        imgUrls.push(getDownloadURL(img));
        const imgName = img.name.slice(imgPrefixLen);
        const thumbIdx = thumbNames.findIndex((name) => {
          return name === imgName;
        });
        if (thumbIdx === -1) {
          console.warn("No thumbnail found for", imgName);
          thumbUrls.push(imgUrls[imgUrls.length - 1]);
        } else {
          thumbUrls.push(getDownloadURL(unorderedThumbs[thumbIdx]));
        }
        return img.getMetadata();
      });

      return Promise.all([
        Promise.all(imgUrls),
        Promise.all(thumbUrls),
        Promise.all(imgMetadata),
      ]).then((results) => {
        const [imgUrls, thumbUrls, imgMetadata] = results;
        const saved: ImageAsset[] = [];
        for (let i = 0; i < imgUrls.length; i++) {
          const img = imgUrls[i];
          const thumb = thumbUrls[i];
          const metadata = imgMetadata[i];
          if (!metadata[0].contentType) {
            console.warn("No content type for", img);
            continue;
          }
          const asset: ImageAsset = {
            title: metadata[0].metadata?.title ?? "Untitled",
            urls: {
              orig: img,
              thumb: thumb,
            },
            description: metadata[0].metadata?.description ?? "No description",
            date: metadata[0].updated
              ? new Date(metadata[0].updated)
              : new Date(),
            sourceAPI:
              (metadata[0].metadata?.sourceAPI as SourceAPI) ??
              ("None" as SourceAPI),
          };
          saved.push(asset);
        }
        return saved;
      });
    }
  ); // handle error

  return <ClientSaved initialSaved={saved} />;
}
