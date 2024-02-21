"use client";

import { type ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";

/**
 * Converts a base64 data URL or raw data string to a Blob
 * @param b64Data
 * @param contentType
 * @param sliceSize
 * @returns
 */
export const b64toBlob = (
  b64Data: string,
  contentType = "",
  sliceSize = 512
) => {
  if (!window) return null;

  if (b64Data.startsWith("data:")) {
    b64Data = b64Data.split(",")[1];
  }
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export function imageToQueryParams(img: ImageAsset) {
  return `?title=${img.title}&orig=${img.urls.orig}&api=${img.sourceAPI}`;
}

export function promisify(fn: (...args: unknown[]) => unknown) {
  return (...args: unknown[]) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err: unknown, result: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

/**
 * Resizes an image blob to the specified width, maintaining aspect ratio
 * @param image
 * @param width
 */
export async function resizeImage(image: Blob, width: number) {
  if (!window) return null;
  const img = new Image();
  const imgLoadPromise = new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  img.src = URL.createObjectURL(image);
  await imgLoadPromise;
  const offscreenCanvas = new OffscreenCanvas(
    width,
    (width / img.width) * img.height
  );
  const ctx = offscreenCanvas.getContext("2d");
  ctx?.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
  return offscreenCanvas.convertToBlob({ type: image.type });
}
