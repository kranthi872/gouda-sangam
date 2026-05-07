import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSd9iHw_t6K4kn_Z1jOFnbwb3kkZruZRc",
  authDomain: "goudschitti-758dc.firebaseapp.com",
  projectId: "goudschitti-758dc",
  storageBucket: "goudschitti-758dc.firebasestorage.app",
  messagingSenderId: "768077525245",
  appId: "1:768077525245:web:9d2254810ebfa883f1ce94",
  measurementId: "G-BV97P3XMDX",
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const app = firebaseEnabled
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db = firebaseEnabled ? getFirestore(app) : null;
export const auth = firebaseEnabled ? getAuth(app) : null;
