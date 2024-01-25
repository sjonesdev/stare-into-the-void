"use client";

import { useState, useEffect } from "react";
import { auth } from "../lib/firebase-services";
import { type UserType, AuthContext } from "../lib/auth-context";
import firebase from "firebase/compat/app";
import "firebase/compat/app-check";

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
// import { saveAs } from "file-saver";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const fileSaverInitialization = () => {
//   saveAs("");
// };

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appCheck = firebase.appCheck();
  const [user, setUser] = useState<UserType>();
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // use dev app check token
      // @ts-expect-error setting app check debug token enabled as global variable
      // eslint-disable-next-line no-restricted-globals
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      appCheck.activate(process.env.REACT_APP_CHECK_DEBUG_TOKEN ?? "", true); // Note this is per browser per dev env
    } else {
      // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
      // key is the counterpart to the secret key you set in the Firebase console.
      appCheck.activate(
        "6LdXI6AoAAAAAEotzSSnDpzScjEkAWPCImJAx2x_",
        // automatically refreshes App Check tokens as needed.
        true
      );
    }
    const unregisterAuthObserver = auth.onAuthStateChanged((newUser) => {
      console.debug("User changed: ", newUser);
      setUser(newUser);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [appCheck]);

  if (user === undefined) {
    // don't render until context is valid
    return <></>;
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
