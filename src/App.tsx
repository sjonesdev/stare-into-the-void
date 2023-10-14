import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import { type UserType, AuthContext, auth } from "./lib/firebase-services";

import Home from "./routes/home/Home";
import About from "./routes/about/About";
import Edit from "./routes/edit/Edit";
import Recent from "./routes/recent/Recent";
import Saved from "./routes/saved/Saved";
import Browse from "./routes/browse/Browse";
import TermsOfService from "./routes/about/TermsOfService";
import PrivacyPolicy from "./routes/about/PrivacyPolicy";
import SignIn from "./routes/signin/SignIn";
import Profile from "./routes/profile/Profile";
import NotFound from "./routes/notfound/NotFound";

import { Pages } from "./lib/pages";

// createContext<Pages>(Pages.Home);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>();
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

function App() {
  document.title = "Stare Into the Void";

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
                <Navbar active={Pages.Browse} /> <Browse />
              </>
            }
          />
          <Route
            path=":query"
            element={
              <>
                <Navbar active={Pages.Browse} /> <Browse />
              </>
            }
          />
        </Route>
        <Route path="about">
          <Route
            index
            element={
              <>
                <Navbar active={Pages.About} />
                <About />
              </>
            }
          />
          <Route
            path="tos"
            element={
              <>
                <Navbar active={Pages.About} />
                <TermsOfService />
              </>
            }
          />
          <Route
            path="privacy"
            element={
              <>
                <Navbar active={Pages.About} />
                <PrivacyPolicy />
              </>
            }
          />
        </Route>
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
        <Route
          path="saved"
          element={
            <>
              <Navbar active={Pages.Saved} />
              <Saved />
            </>
          }
        />
        <Route
          path="signin"
          element={
            <>
              <Navbar active={Pages.SignIn} />
              <SignIn />
            </>
          }
        />
        <Route
          path="profile"
          element={
            <>
              <Navbar active={Pages.Profile} />
              <Profile />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Navbar active={Pages.Profile} />
              <NotFound />
            </>
          }
        />
      </Route>
    )
  );

  return (
    <div className="App">
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;
