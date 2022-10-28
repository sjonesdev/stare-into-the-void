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
import Search from "./routes/browse/Browse";

import { Pages } from "./lib/pages";

function App() {
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
        <Route
          path="browse"
          element={
            <>
              <Navbar active={Pages.Browse} />
              <Search />
            </>
          }
        />
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
              <Recent />
            </>
          }
        />
      </Route>
    )
  );
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
