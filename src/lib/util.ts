"use client";

import { type ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";
import { FunctionsService } from "./firebase-services";

export function imageToQueryParams(img: ImageAsset) {
  return `?title=${img.title}&orig=${img.urls.orig}&thumb=${
    img.urls.thumb ?? img.urls.orig
  }&desc=${img.description}&date=${img.date.toISOString()}&api=${
    img.sourceAPI
  }`;
}

// note: `buffer` arg can be an ArrayBuffer or a Uint8Array
export async function bufferToBase64(buffer: Uint8Array | ArrayBuffer) {
  // use a FileReader to generate a base64 data URI:
  const base64url: string = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(new Blob([buffer]));
  });
  console.debug("base64url", base64url);
  // remove the `data:...;base64,` part from the start
  return base64url.slice(base64url.indexOf(",") + 1);
}

/**
 * Gets image to be used in src of img tag
 * @param url
 * @returns
 */
export async function getImageBase64(
  buffer: Uint8Array | ArrayBuffer,
  type: string
) {
  return `data:${type};base64,` + (await bufferToBase64(buffer));
}

/**
 * Converts a base64 data URI string to a Uint8Array
 * @param dataStringBase64
 * @returns
 */
export function getBase64DataStringUint8Array(dataStringBase64: string) {
  const BASE64_MARKER = ";base64,";
  const base64Index =
    dataStringBase64.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataStringBase64.substring(base64Index);
  const raw = self.atob(base64);
  const array = new Uint8Array(new ArrayBuffer(raw.length));

  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export async function getRawImageData(url: string) {
  const response = await FunctionsService.downloadImageData({
    url,
  }).catch((reason) => {
    console.error("Error downloading image: ", reason);
  });
  console.debug(
    `Got image buffer of size ${response?.data.buffer.length} and type ${response?.data.type}`
  );
  if (!response?.data.buffer.length) return null;
  return response.data;
}

export async function getImageBuffer(url: string) {
  const data = await getRawImageData(url);
  if (!data) return null;
  const buffer = Uint8Array.from(data.buffer);
  return { buffer, type: data.type };
}

export async function getImageBlob(url: string) {
  const imageBuffer = await getImageBuffer(url);
  if (!imageBuffer) return null;
  return new Blob([imageBuffer.buffer], { type: imageBuffer.type });
}

export function getUint8ArrayImageblob(imageBuffer: Uint8Array, type: string) {
  return new Blob([imageBuffer], { type });
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
export async function resizeImageBlob(image: Blob, width: number) {
  const img = new Image();
  img.src = URL.createObjectURL(image);
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.floor((width / img.width) * img.height);

  // const offscreenCanvas = canvas.transferControlToOffscreen();
  // hacky stuff because offscreen canvas needs unsigned long int
  const canvasSize = new Uint32Array(2);
  canvasSize[0] = width;
  canvasSize[1] = Math.floor((width / img.width) * img.height);

  const offscreenCanvas = new OffscreenCanvas(canvasSize[0], canvasSize[1]);

  const ctx = offscreenCanvas.getContext("2d");
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await offscreenCanvas.convertToBlob({ type: image.type });
  return blob;
}
