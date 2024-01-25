"use client";

import { useEffect, useContext } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import { AuthContext } from "../../lib/auth-context";
import { redirect } from "next/navigation";

// hacky thing to prevent bug where AuthUI instance gets deleted
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Firebase UI config
const uiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Redirect URL
  signInSuccessUrl: "/",
  // Terms of service url.
  tosUrl: "/about/tos",
  // Privacy policy url.
  privacyPolicyUrl: "/about/privacy",
};

export default function SignIn() {
  const user = useContext(AuthContext);

  // hacky thing pt2 + redirect if already signed in
  useEffect(() => {
    const oldDelete = ui.delete;
    ui.delete = () => new Promise(() => {});
    if (user) redirect("/");
    return () => {
      ui.delete = oldDelete;
    };
  });
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
}
