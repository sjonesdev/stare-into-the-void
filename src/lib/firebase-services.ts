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
// app check done by auth context provider
const functions = firebase.functions();
const auth = firebase.auth();
const storage = firebase.storage();
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.debug("connecting to emulator");
  functions.useEmulator("localhost", 5001);
  auth.useEmulator("http://localhost:9099/");
  storage.useEmulator("localhost", 9199);
}

class FunctionsService {
  private static _functions = functions;
  private static apod: HttpsCallable<unknown, ImageAsset> =
    functions.httpsCallable("apod");
  private static nivl: HttpsCallable<unknown, ImageAsset[]> =
    functions.httpsCallable("nivl");
  public static downloadImageData: HttpsCallable<unknown, ImageAssetRaw> =
    functions.httpsCallable("downloadProxy");

  get functions() {
    return FunctionsService._functions;
  }

  static async getPictureOfTheDay() {
    const apod = await FunctionsService.apod();
    if (!apod.data) return null;
    apod.data.date = new Date(apod.data.date);
    if (!apod.data.urls.thumb) apod.data.urls.thumb = apod.data.urls.orig;
    return apod.data;
  }

  static async getNIVLWithQuery(query: string): Promise<ImageAsset[]> {
    let nivlUrls: ImageAsset[] = [];
    await FunctionsService.nivl({ search: query })
      .then((res) => {
        nivlUrls = res.data;
        return res.data;
      })
      .catch((reason) => {
        console.error("error: " + reason);
      });
    return nivlUrls;
  }

  static async fetchImages(query: string) {
    const newQueryImgs: ImageAsset[] = [];

    const promises = [
      FunctionsService.getPictureOfTheDay().then((val) => {
        // if there is no query, we want to still show APOD, but if there is a query, we only want to show APOD if it matches the query
        if (val) {
          if (
            !query ||
            (query && val.title.toLowerCase().includes(query.toLowerCase()))
          ) {
            newQueryImgs.push(val);
          }
        }
      }),
    ];

    if (query) {
      promises.push(
        FunctionsService.getNIVLWithQuery(query ?? "").then((val) => {
          val.forEach((img) => {
            img.date = new Date(img.date);
            newQueryImgs.push(img);
          });
        })
      );
    }

    await Promise.allSettled(promises);
    return newQueryImgs;
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

firebase.analytics.isSupported().then((isSupported) => {
  if (isSupported) /* const analytics =*/ firebase.analytics();
});

export { FunctionsService, StorageService, auth };
