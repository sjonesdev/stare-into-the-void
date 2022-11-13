import {
    getFunctions,
    connectFunctionsEmulator,
    HttpsCallable,
    httpsCallable,
  } from "firebase/functions";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";

export class FirebaseService{
    private apod: HttpsCallable<undefined, ImageAsset>;
    private nivl: HttpsCallable<any, ImageAsset>;

    constructor(apod: HttpsCallable<undefined, ImageAsset>, nivl: HttpsCallable<any, ImageAsset>){
        this.apod = apod;
        this.nivl = nivl;
    }

    getPictureOfTheDay(){
        var apodUrl = this.apod()
        .then((res) => {
            console.log(res);
            return res.data.url;
        })
        .catch((reason) => {
            console.log("error: " + reason);
            return null;
        });
        return apodUrl;
    }

    getNIVLWithQuery(query: string){
        var nivlUrls = this.nivl({ search: query })
        .then((res) => {
            console.log(res);
            return res.data.url;
        })
        .catch((reason) => {
            console.log("error: " + reason);
            return null;
        });
        return nivlUrls;
    }
}