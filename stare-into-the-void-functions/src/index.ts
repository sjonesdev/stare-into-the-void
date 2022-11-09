// The Cloud Functions for Firebase SDK to create
// Cloud Functions and set up triggers.
import * as functions from "firebase-functions";
// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/v2/params";

import { type APODResponse, type NIVLResponse, type MRPResponse } from "./models/image-responses";
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

//Astronomy Picture of the Day

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
});

//Nasa Image and Video Library

exports.nivl = functions.https.onRequest((req, res) => {
  handleCors(req, res, () => {
    const query = req.query.search;
    const reqUrl = `https://images-api.nasa.gov/search?q=${query}`;
    https.get(reqUrl, (resp) => {
      let rawData = ""  
      resp.on("data", (chunk) => {
        rawData += chunk
      })
      resp.on("end", () => {
        const resList = JSON.parse(rawData);
      
        const data: ImageAsset[] = []; 
        resList.items.array.forEach((element: NIVLResponse) => {
          data.push({
            title: element.data.title,
            url: element.href,
            description: element.data.description,
            date: element.data.date_created,
            sourceAPI: SourceAPI.ImageAndVideoLibrary
          });
        });
        res.status(200).send({
          data
        })
      })
    }).on("error", (error) => {
      functions.logger.log(`Error fetching NASA NIVL: ${error}`)
      res.status(502).send({
        data: {
          error
        }
      })
    })
  })
});

//Mars Rover Photos

exports.mrp = functions.https.onRequest((req, res) => {
  handleCors(req, res, () => {
    // const query = req.query.search;
    const reqUrl = ""; //TODO: Correct Endpoint
    https.get(reqUrl, (resp) => {
      let rawData = ""  
      resp.on("data", (chunk) => {
        rawData += chunk
      })
      resp.on("end", () => {
        const resList = JSON.parse(rawData);
      
        const data: ImageAsset[] = []; 
        resList.items.array.forEach((element: MRPResponse) => {
          data.push({
            title: element.rover + " " + element.camera + " " + element.sol,
            url: element.img_src,
            description: "",  //TODO: Construct Description
            date: new Date, //TODO: Correct Date
            sourceAPI: SourceAPI.MarsRoverPhotos
          });
        });
        res.status(200).send({
          data
        })
      })
    }).on("error", (error) => {
      functions.logger.log(`Error fetching NASA MRP: ${error}`)
      res.status(502).send({
        data: {
          error
        }
      })
    })
  })
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
