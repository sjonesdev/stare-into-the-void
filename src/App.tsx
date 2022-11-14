import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

import Home from "./routes/home/Home";
import About from "./routes/about/About";
import Edit from "./routes/edit/Edit";
import Recent from "./routes/recent/Recent";
import Browse from "./routes/browse/Browse";
import SearchContext from "./lib/search-context";

import { Pages } from "./lib/pages";

const DEFAULT_BG = "./galaxy.jpg";

function App({ bgUrl }: { bgUrl?: Promise<string | null> }) {
  const [searchStr, setSearchStr] = React.useState("");
  // const loc = useLocation();
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

  // const activeRoute = () => {
  //   switch (loc.pathname) {
  //     case "/browse":
  //       return Pages.Browse;
  //     case "/about":
  //       return Pages.About;
  //     case "/edit":
  //       return Pages.Edit;
  //     case "/recent":
  //       return Pages.Recent;
  //     case "/":
  //     default:
  //       return Pages.Home;
  //   }
  // };
  // const navbar = <Navbar active={activeRoute()} />;

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
                <Navbar active={Pages.Browse} /> <Browse />{" "}
              </>
            }
          />
          <Route
            path=":query"
            element={
              <>
                <Navbar active={Pages.Browse} /> <Browse />{" "}
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
              <Edit imgUrl={bgImg} />
            </>
          }
        />
        <Route
          path="recent"
          element={
            <>
              <Navbar active={Pages.Recent} />
              <Recent />
            </>
          }
        />
      </Route>
    )
  );

  return (
    <div className="App" style={appStyle}>
      <SearchContext.Provider value={searchStr}>
        <RouterProvider router={router} />
      </SearchContext.Provider>
    </div>
  );
}

export default App;
