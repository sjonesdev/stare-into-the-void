import {
  getStorage,
  getDownloadURL as firebaseGetDownloadURL,
} from "firebase-admin/storage";
import type { File } from "@google-cloud/storage";
import fetch from "cross-fetch";
import { FullMetadata } from "@firebase/storage-types";

export function imgNamePrefixLen(userId: string) {
  return `users/${userId}/saved/images/`.length;
}

export function imageFiles(userId: string) {
  // TODO pagination, nextQuery, apiResponse
  return getStorage()
    .bucket("gs://stare-into-the-void.appspot.com")
    .getFiles({
      prefix: `users/${userId}/saved/images`,
    });
}

export function thumbNamePrefixLen(userId: string) {
  return `users/${userId}/saved/thumbnails/`.length;
}

export function thumbnailFiles(userId: string) {
  const storage = getStorage();
  return storage
    .bucket("gs://stare-into-the-void.appspot.com")
    .getFiles({ prefix: `users/${userId}/saved/thumbnails` });
}

/**
 * Asynchronously generates and returns the download URL for a file in a specified Firebase Storage emulator bucket.
 * The generated URL can be used to download the file.
 *
 * @param {string} bucket - The name of the Firebase Storage emulator bucket.
 * @param {string} filePath - The path to the file inside the bucket.
 * @returns {Promise<string>} - A promise that resolves to the download URL as a string.
 */
const getEmulatorDownloadURL = async (bucket: string, filePath: string) => {
  // fetch a new download token
  const tokenGenerationFetch = await fetch(
    `http://${
      process.env.FIREBASE_STORAGE_EMULATOR_HOST
    }/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?create_token=true`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer owner",
      },
    }
  );
  const tokenGenerationResponse: FullMetadata & { downloadTokens: string } =
    await tokenGenerationFetch.json();
  const downloadToken = tokenGenerationResponse.downloadTokens.split(",")[0];

  // manually construct the emulator download url
  return `http://${
    process.env.FIREBASE_STORAGE_EMULATOR_HOST
  }/v0/b/${bucket}/o/${encodeURIComponent(
    filePath
  )}?alt=media&token=${downloadToken}`;
};

export const getDownloadURL = async (file: File) => {
  if (process.env.NODE_ENV === "production") {
    return firebaseGetDownloadURL(file);
  }
  return getEmulatorDownloadURL(file.bucket.name, file.name);
};
