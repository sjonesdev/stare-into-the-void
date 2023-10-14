// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { HttpsCallable, httpsCallable } from "firebase/functions";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/functions";
import "firebase/compat/analytics";
import "firebase/compat/storage";
import { createContext } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJZer3Ud9W6LehR-GgJhm52zyxN9XLNGo",
  authDomain: "stare-into-the-void.firebaseapp.com",
  projectId: "stare-into-the-void",
  storageBucket: "stare-into-the-void.appspot.com",
  messagingSenderId: "144334433499",
  appId: "1:144334433499:web:ec88283f1e623cd02c70fe",
  measurementId: "G-2868R29G5L",
};

class CloudFunctionsService {
  private apod: HttpsCallable<undefined, ImageAsset>;
  private nivl: HttpsCallable<any, ImageAsset[]>;
  static instance: CloudFunctionsService;

  static initialize = (
    apod: HttpsCallable<undefined, ImageAsset>,
    nivl: HttpsCallable<any, ImageAsset[]>
  ) => {
    CloudFunctionsService.instance = new CloudFunctionsService(apod, nivl);
    return CloudFunctionsService.instance;
  };

  private constructor(
    apod: HttpsCallable<undefined, ImageAsset>,
    nivl: HttpsCallable<any, ImageAsset[]>
  ) {
    this.apod = apod;
    this.nivl = nivl;
  }

  getPictureOfTheDay() {
    var apodUrl = this.apod()
      .then((res) => {
        return res.data.urls.orig;
      })
      .catch((reason) => {
        console.log("error: " + reason);
        return null;
      });
    return apodUrl;
  }

  async getNIVLWithQuery(query: string): Promise<ImageAsset[]> {
    var nivlUrls: ImageAsset[] = [];
    await this.nivl({ search: query })
      .then((res) => {
        nivlUrls = res.data;
        return res.data;
      })
      .catch((reason) => {
        console.log("error: " + reason);
      });
    return nivlUrls;
  }
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();
const auth = firebase.auth();
const storage = firebase.storage();
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("connecting to emulator");
  functions.useEmulator("localhost", 5001);
  auth.useEmulator("http://localhost:9099/");
  storage.useEmulator("localhost", 9199);
}
/* const analytics =*/ firebase.analytics();

const apod = httpsCallable<undefined, ImageAsset>(functions, "apod", {});
const nivl = httpsCallable<any, ImageAsset[]>(functions, "nivl", {});

CloudFunctionsService.initialize(apod, nivl);

type UserType = firebase.User | null | undefined;

const AuthContext = createContext<UserType>(null);

export {
  CloudFunctionsService as FunctionsService,
  type UserType,
  AuthContext,
  auth,
};
