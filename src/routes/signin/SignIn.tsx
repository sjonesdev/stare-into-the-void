import { useEffect, useState, useContext } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import { AuthContext } from "../../lib/firebase-services";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // hacky thing pt2 + redirect if already signed in
  useEffect(() => {
    const oldDelete = ui.delete;
    ui.delete = () => new Promise(() => {});
    if (!!user) navigate("/");
    return () => {
      ui.delete = oldDelete;
    };
  });
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
}
