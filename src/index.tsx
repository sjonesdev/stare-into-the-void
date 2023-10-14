import "./lib/firebase-services";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/**
 * We do this to ensure file-saver is included in the bundle even
 * if we don't use it elsewhere in the code, as we want
 * react-image-editor to use the file-saver functionality instead
 * of opening the image in a new window.
 *
 * React-image-editor checks for whether saveAs part of FileApi is
 * implemented before saving, so by doing this we ensure saveAs is
 * implemented for react-image-editor.
 */
import { saveAs } from "file-saver";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fileSaverInitialization = () => {
  saveAs("");
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
