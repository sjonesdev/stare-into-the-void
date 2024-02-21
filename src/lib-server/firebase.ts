import { initializeApp, App, getApp } from "firebase-admin/app";
import { credential } from "firebase-admin";

let app: App;
try {
  app = initializeApp({ credential: credential.applicationDefault() });
} catch (e) {
  console.debug("Firebase app already initialized: ", e);
  app = getApp();
}

export { app };
