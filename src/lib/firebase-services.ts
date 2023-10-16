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
  appCheck.activate("28a19d9a-7208-4c1a-baf7-3fbf9b682a41", true); // TODO hide this
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

  static getPictureOfTheDay() {
    var apodUrl = FunctionsService.apod()
      .then((res) => {
        return res.data.urls.orig;
      })
      .catch((reason) => {
        console.log("error: " + reason);
        return null;
      });
    return apodUrl;
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
    return (
      `data:${type};base64,` + (await bufferToBase64(buffer))
      // Buffer.from(image.buffer).toString("base64")
    );
  }

  static async getImageArrayBuffer(url: string) {
    const response = await FunctionsService.downloadImageData({
      url,
    }).catch((reason) => {
      console.error("Error downloading image: ", reason);
    });
    console.debug(
      `Got image buffer of size ${response?.data.buffer.length} and type ${response?.data.type}`,
      response?.data.buffer
    );
    if (!response?.data.buffer.length) return null;
    const buffer = Uint8Array.from(response.data.buffer);
    return { buffer, type: response.data.type };
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
