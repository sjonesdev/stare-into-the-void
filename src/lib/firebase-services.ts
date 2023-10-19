// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { HttpsCallable } from "firebase/functions";
import {
  ImageAsset,
  ImageAssetRaw,
} from "../../stare-into-the-void-functions/src/models/image-assets";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/functions";
import "firebase/compat/analytics";
import "firebase/compat/storage";
import "firebase/compat/app-check";
import { createContext } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJZer3Ud9W6LehR-GgJhm52zyxN9XLNGo",
  authDomain: "stare-into-the-void.firebaseapp.com",
  projectId: "stare-into-the-void",
  storageBucket: "gs://stare-into-the-void.appspot.com",
  messagingSenderId: "144334433499",
  appId: "1:144334433499:web:ec88283f1e623cd02c70fe",
  measurementId: "G-2868R29G5L",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const appCheck = firebase.appCheck();
const functions = firebase.functions();
const auth = firebase.auth();
const storage = firebase.storage();
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // @ts-ignore
  // eslint-disable-next-line no-restricted-globals
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  console.log("connecting to emulator");
  functions.useEmulator("localhost", 5001);
  auth.useEmulator("http://localhost:9099/");
  storage.useEmulator("localhost", 9199);
  // use dev app check token
  // @ts-ignore
  // eslint-disable-next-line no-restricted-globals
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  appCheck.activate(process.env.REACT_APP_CHECK_DEBUG_TOKEN ?? "", true); // Note this is per browser per dev env
} else {
  // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
  // key is the counterpart to the secret key you set in the Firebase console.
  appCheck.activate(
    "6LdXI6AoAAAAAEotzSSnDpzScjEkAWPCImJAx2x_",
    // automatically refreshes App Check tokens as needed.
    true
  );
}

// note: `buffer` arg can be an ArrayBuffer or a Uint8Array
async function bufferToBase64(buffer: Uint8Array | ArrayBuffer) {
  // use a FileReader to generate a base64 data URI:
  const base64url: string = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(new Blob([buffer]));
  });
  console.log("base64url", base64url);
  // remove the `data:...;base64,` part from the start
  return base64url.slice(base64url.indexOf(",") + 1);
}

class FunctionsService {
  private static _functions = functions;
  private static apod: HttpsCallable<any, ImageAsset> =
    functions.httpsCallable("apod");
  private static nivl: HttpsCallable<any, ImageAsset[]> =
    functions.httpsCallable("nivl");
  private static downloadImageData: HttpsCallable<any, ImageAssetRaw> =
    functions.httpsCallable("downloadProxy");

  get functions() {
    return FunctionsService._functions;
  }

  static async getPictureOfTheDay() {
    const apod = await FunctionsService.apod();
    if (!apod.data) return null;
    return apod.data;
  }

  static async getNIVLWithQuery(query: string): Promise<ImageAsset[]> {
    var nivlUrls: ImageAsset[] = [];
    await FunctionsService.nivl({ search: query })
      .then((res) => {
        nivlUrls = res.data;
        return res.data;
      })
      .catch((reason) => {
        console.log("error: " + reason);
      });
    return nivlUrls;
  }

  /**
   * Gets image to be used in src of img tag
   * @param url
   * @returns
   */
  static async getImageBase64(buffer: Uint8Array | ArrayBuffer, type: string) {
    return `data:${type};base64,` + (await bufferToBase64(buffer));
  }

  /**
   * Converts a base64 data URI string to a Uint8Array
   * @param dataStringBase64
   * @returns
   */
  static getBase64DataStringUint8Array(dataStringBase64: string) {
    const BASE64_MARKER = ";base64,";
    const base64Index =
      dataStringBase64.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataStringBase64.substring(base64Index);
    const raw = window.atob(base64);
    const array = new Uint8Array(new ArrayBuffer(raw.length));

    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  private static async getRawImageData(url: string) {
    const response = await this.downloadImageData({
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

  static async getImageBuffer(url: string) {
    const data = await this.getRawImageData(url);
    if (!data) return null;
    const buffer = Uint8Array.from(data.buffer);
    return { buffer, type: data.type };
  }

  static async getImageBlob(url: string) {
    const imageBuffer = await this.getImageBuffer(url);
    if (!imageBuffer) return null;
    return new Blob([imageBuffer.buffer], { type: imageBuffer.type });
  }

  static getUint8ArrayImageblob(imageBuffer: Uint8Array, type: string) {
    return new Blob([imageBuffer], { type });
  }

  static promisify(fn: (...args: any[]) => any) {
    return (...args: any[]) => {
      return new Promise((resolve, reject) => {
        fn(...args, (err: any, result: any) => {
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
  static async resizeImageBlob(image: Blob, width: number) {
    console.log("resizing blob", image, width);
    const img = new Image();
    img.src = URL.createObjectURL(image);
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    console.log("img", img);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.floor((width / img.width) * img.height);
    // const offscreenCanvas = canvas.transferControlToOffscreen();
    // hacky stuff because offscreen canvas needs unsigned long int
    const canvasSize = new Uint32Array(2);
    canvasSize[0] = width;
    canvasSize[1] = Math.floor((width / img.width) * img.height);
    console.log("canvasSize", canvasSize);
    const offscreenCanvas = new OffscreenCanvas(canvasSize[0], canvasSize[1]);
    console.log(
      "offscreenCanvas",
      offscreenCanvas.width,
      offscreenCanvas.height
    );
    const ctx = offscreenCanvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await offscreenCanvas.convertToBlob({ type: image.type });
    console.log("blob", blob);
    return blob;
  }
}

class StorageService {
  private static _storage = storage;
  static imagesRef(userId: string) {
    return StorageService._storage.ref(`users/${userId}/saved/images`);
  }
  static thumbnailsRef(userId: string) {
    return StorageService._storage.ref(`users/${userId}/saved/thumbnails`);
  }
  static get storage() {
    return StorageService._storage;
  }
}

/* const analytics =*/ firebase.analytics();

type UserType = firebase.User | null | undefined;

const AuthContext = createContext<UserType>(null);

export { FunctionsService, StorageService, type UserType, AuthContext, auth };
