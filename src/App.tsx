import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

import Home from "./routes/home/Home";
import About from "./routes/about/About";
import Edit from "./routes/edit/Edit";
import Recent from "./routes/recent/Recent";
import Browse from "./routes/browse/Browse";

import { Pages } from "./lib/pages";
import { ImageAsset } from "../stare-into-the-void-functions/src/models/image-assets";

const DEFAULT_BG = "./galaxy.jpg";

function App({ bgUrl }: { bgUrl?: Promise<string | null> }) {
  const [recentImgs, setRecentImgs] = React.useState<ImageAsset[]>();
  const [bgImg, setBgImg] = React.useState(DEFAULT_BG);
  if (bgUrl) {
    bgUrl.then((val) => {
      console.log("bgurl resolved to " + val);
      if (val) setBgImg(val); // need to also validate that is image as apparently there can be youtube videos returned from the APOD API
    });
  }
  const appStyle: React.CSSProperties = {
    backgroundImage: `url(${bgImg})`,
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          index
          element={
            <>
              <Navbar active={Pages.Home} />
              <Home />
            </>
          }
        />
        <Route path="browse">
          <Route
            index
            element={
              <>
                <Navbar active={Pages.Browse} /> <Browse recentImgs={recentImgs!} setRecentImgs={setRecentImgs}/>
              </>
            }
          />
          <Route
            path=":query"
            element={
              <>
                <Navbar active={Pages.Browse} /> <Browse recentImgs={recentImgs!} setRecentImgs={setRecentImgs}/>
              </>
            }
          />
        </Route>
        <Route
          path="about"
          element={
            <>
              <Navbar active={Pages.About} />
              <About />
            </>
          }
        />
        <Route
          path="edit"
          element={
            <>
              <Navbar active={Pages.Edit} />
              <Edit />
            </>
          }
        />
        <Route
          path="recent"
          element={
            <>
              <Navbar active={Pages.Recent} />
              <Recent recentImgs={recentImgs!}/>
            </>
          }
        />
      </Route>
    )
  );

  return (
    <div className="App" style={appStyle}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
