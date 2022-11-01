// The Cloud Functions for Firebase SDK to create
// Cloud Functions and set up triggers.
import * as functions from "firebase-functions";
// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/v2/params";

import { type APODResponse } from "./models/image-responses";
import { ImageAsset, SourceAPI } from "./models/image-assets";

import * as https from "https";

admin.initializeApp();

import * as cors from "cors";
// TODO - configure CORS to have proper domain control
// instead of allowing all origins
// check firebase console for origins
const handleCors = cors({origin: true});

// make sure to define this in a .env file in the 
// stare-into-the-void-functions root directory 
// like NASA_APIKEY=thisismykey
const NASA_API_KEY = defineString("NASA_API_KEY");

exports.apod = functions.https.onRequest((req, res) => {
  handleCors(req, res, () => {
    const reqUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY.value()}`;
    https.get(reqUrl, (resp) => {
      let rawData = ""  
      resp.on("data", (chunk) => {
        rawData += chunk
      })
      resp.on("end", () => {
        const apodData: APODResponse = JSON.parse(rawData)
        const data: ImageAsset = {
          title: apodData.title,
          url: apodData.url,
          description: apodData.explanation,
          date: apodData.date,
          sourceAPI: SourceAPI.APOD
        }
        res.status(200).send({
          data
        })
      })

    }).on("error", (error) => {
      functions.logger.log(`Error fetching NASA APOD: ${error}`)
      res.status(502).send({
        data: {
          error
        }
      })
    })

  })
})
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.bigben = functions.https.onRequest((req, res) => {
  functions.logger.log("Got bigben request LOGLOGLOG", {structuredData: true})
  handleCors(req, res, () => {
    const hours = (new Date().getHours() % 12) + 1; // London is UTC + 1hr;
    res.status(200).send({
      data: `${"BONG ".repeat(hours)}`,
    });
  });
});
