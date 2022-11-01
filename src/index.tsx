import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from "firebase/functions";

import type { ImageAsset } from "../stare-into-the-void-functions/src/models/image-assets";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("connecting to emulator");
  connectFunctionsEmulator(functions, "localhost", 5001);
}
/* const analytics =*/ getAnalytics(app);

const bigben = httpsCallable(functions, "bigben", {});
bigben()
  .then((res) => {
    console.log(res);
  })
  .catch((reason) => {
    console.log("error: ", reason);
  });

const apod = httpsCallable<undefined, ImageAsset>(functions, "apod", {});
const apodUrl = apod()
  .then((res) => {
    console.log(res);
    return res.data.url;
  })
  .catch((reason) => {
    console.log("error: " + reason);
    return null;
  });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App bgUrl={apodUrl} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
