// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getFunctions,
    connectFunctionsEmulator,
    HttpsCallable,
    httpsCallable,
  } from "firebase/functions";
import { APODImageAsset, ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";


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

function initFirebase() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const functions = getFunctions(app);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("connecting to emulator");
        connectFunctionsEmulator(functions, "localhost", 5001);
    }
    /* const analytics =*/ getAnalytics(app);

    const apod = httpsCallable<undefined, APODImageAsset>(functions, "apod", {});
    const nivl = httpsCallable<any, ImageAsset[]>(functions, "nivl", {});

    CloudFunctionsService.initialize(apod, nivl);
}

export default class CloudFunctionsService{
    private apod: HttpsCallable<undefined, APODImageAsset>;
    private nivl: HttpsCallable<any, ImageAsset[]>;
    static instance: CloudFunctionsService;

    static initialize = (apod: HttpsCallable<undefined, APODImageAsset>, nivl: HttpsCallable<any, ImageAsset[]>) => {
        CloudFunctionsService.instance = new CloudFunctionsService(apod, nivl);
        return CloudFunctionsService.instance;
    }

    private constructor(apod: HttpsCallable<undefined, APODImageAsset>, nivl: HttpsCallable<any, ImageAsset[]>){
        this.apod = apod;
        this.nivl = nivl;
    }

    async getPictureOfTheDay(): Promise<APODImageAsset>{
        var apodUrl! : APODImageAsset;
        await this.apod().then((res) => {
            console.log(res);
            apodUrl = res.data;
            return res.data;
        })
        .catch((reason) => {
            console.log("error: " + reason);
        });
        return apodUrl;
    }

    async getNIVLWithQuery(query: string): Promise<ImageAsset[]>{
        var nivlUrls: ImageAsset[] = [];
        await this.nivl({ search: query })
        .then((res) => {
            console.log(res);
            nivlUrls = res.data;
            return res.data;
        })
        .catch((reason) => {
            console.log("error: " + reason);
        });
        return nivlUrls;
    }
}

export { initFirebase, CloudFunctionsService as FunctionsService};