"use client";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
} from "firebase/app-check";
import { User, connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

import { createContext, useState } from "react";
import useOnMount from "../hooks/useOnMount";

const firebaseConfig = {
  apiKey: "AIzaSyBJZer3Ud9W6LehR-GgJhm52zyxN9XLNGo",
  authDomain: "stare-into-the-void.firebaseapp.com",
  projectId: "stare-into-the-void",
  storageBucket: "gs://stare-into-the-void.appspot.com",
  messagingSenderId: "144334433499",
  appId: "1:144334433499:web:ec88283f1e623cd02c70fe",
  measurementId: "G-2868R29G5L",
};

// call before using any other firebase service
function initFirebase(): FirebaseApp {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const functions = getFunctions(app);
  const storage = getStorage(app);

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
  }

  getAnalytics(app);

  return app;
}

export const AppContext = createContext<FirebaseApp | null>(null);
export const AuthContext = createContext<User | null>(null);

export default function FirebaseContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [user, setUser] = useState<User | null>();

  useOnMount(() => {
    const newApp = initFirebase();
    const auth = getAuth(newApp);
    let appCheckToken = "6LdXI6AoAAAAAEotzSSnDpzScjEkAWPCImJAx2x_";

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // use dev app check token
      // @ts-expect-error setting app check debug token enabled as global variable
      // eslint-disable-next-line no-restricted-globals
      if (`window`) window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      console.debug(
        "Using debug app check token: ",
        process.env.REACT_APP_CHECK_DEBUG_TOKEN
      );
      appCheckToken = process.env.REACT_APP_CHECK_DEBUG_TOKEN ?? ""; // Note this is per browser per dev env
    }

    const appCheckConfig = {
      provider: new ReCaptchaEnterpriseProvider(appCheckToken),
      isTokenAutoRefreshEnabled: true,
    };

    initializeAppCheck(newApp, appCheckConfig);

    // Listen to the Firebase Auth state and set the local state.
    // technically this means we don't even need the auth context since we aren't rendering until the current user is available through getAuth().currentUser
    const unregisterAuthObserver = auth.onAuthStateChanged((newUser) => {
      console.debug("User changed: ", newUser);
      setUser(newUser);
    });
    setApp(newApp);

    return unregisterAuthObserver;
  });

  if (app == null || user == null) {
    // don't render until contexts are valid
    return <></>;
  }

  return (
    <AppContext.Provider value={app}>
      <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
    </AppContext.Provider>
  );
}
