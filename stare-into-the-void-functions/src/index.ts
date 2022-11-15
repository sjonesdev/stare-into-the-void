// The Cloud Functions for Firebase SDK to create
// Cloud Functions and set up triggers.
import * as functions from "firebase-functions";
// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/params";

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
          urls: {
            orig: apodData.url,
            thumb: ""
          },
          description: apodData.explanation,
          date: apodData.date,
          sourceAPI: SourceAPI.APOD
        }
        res.status(200).send({
          data
        })
      })

    }).on("error", (error) => {
      functions.logger.error(`Error fetching NASA APOD: ${error}`)
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
    functions.logger.log(`reqbody: ${JSON.stringify(req.body.data, null, 2)}`)
    const query = req.body.data.search;
    functions.logger.log(`Got NIVL query ${query}`)
    const reqUrl = `https://images-api.nasa.gov/search?q=${query}`;
    https.get(reqUrl, (resp) => {
      let rawData = ""  
      resp.on("data", (chunk) => {
        rawData += chunk
      })
      resp.on("end", () => {
        const resList = JSON.parse(rawData);
        const data: ImageAsset[] = []; 
        resList.collection.items?.forEach((element: NIVLResponse) => {
          if(element.data[0].media_type === "image"){
            data.push({
              title: element.data[0].title,
              urls: getImageURLs(element.href),
              description: element.data[0].description,
              date: element.data[0].date_created,
              sourceAPI: SourceAPI.ImageAndVideoLibrary
            });
          }
        });
        res.status(200).send({
          data
        })
      })
    }).on("error", (error) => {
      functions.logger.error(`Error fetching NASA NIVL: ${error}`)
      res.status(502).send({
        data: {
          error
        }
      })
    })
  })
});

function getImageURLs(manifestUrl: string){
  const baseUrl = "http://images-assets.nasa.gov/image/";
  const strings = manifestUrl.split("/");
  const urls = {
    orig: baseUrl + strings[4] + "/" + strings[4] + "~orig.jpg",
    thumb: baseUrl + strings[4] + "/" + strings[4] + "~thumb.jpg"
  }
  // return baseUrl + strings[4] + "/" + strings[4] + "~orig.jpg";
  return urls;
  // TODO - also probably need to handle other types of images other than jpg, as that's
  // likely where the errors are coming from client side
}

//Mars Rover Photos

exports.mrp = functions.https.onRequest((req, res) => {
  handleCors(req, res, () => {
    const rover = req.query.rover;
    const reqUrl = `https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/latest_photos`; //Using the heroku endpoint means we don't need an API key for this one
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
            title: element.id.toString(),
            urls: {
              orig: element.img_src,
              thumb: ""
            },
            description: "Photo taken by " + element.rover + "using camera" + element.camera + " on martian sol " + element.sol + ".",
            date: element.earth_date,
            sourceAPI: SourceAPI.MarsRoverPhotos
          });
        });
        res.status(200).send({
          data
        })
      })
    }).on("error", (error) => {
      functions.logger.error(`Error fetching NASA MRP: ${error}`)
      res.status(502).send({
        data: {
          error
        }
      })
    })
  })
});
