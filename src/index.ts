// The Cloud Functions for Firebase SDK to create
// Cloud Functions and set up triggers.
import * as functions from "firebase-functions";
// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// const functions = require('firebase-functions');
// const cors = require("cors")({origin: true});
import * as cors from "cors";
// TODO - configure CORS to have proper domain control
// instead of allowing all origins
const handleCors = cors({origin: true});

exports.bigben = functions.https.onRequest((req, res) => {
  handleCors(req, res, () => {
    const hours = (new Date().getHours() % 12) + 1; // London is UTC + 1hr;
    res.status(200).send({
      data: `${"BONG ".repeat(hours)}`,
    });
  });
});
