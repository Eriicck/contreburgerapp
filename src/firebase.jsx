import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getFunctions, httpsCallable } from "firebase/functions";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKSw-8lQFDrSUfSgE3uE6gPXH4KjwqRAs",
  authDomain: "contreburger-web.firebaseapp.com",
  projectId: "contreburger-web",
  storageBucket: "contreburger-web.firebasestorage.app",
  messagingSenderId: "108203474204",
  appId: "1:108203474204:web:b55475b2e2bf5cd46a4ed9",
  measurementId: "G-3K8VBR0CGS"
};

// Si ya existe una app inicializada la reutiliza, si no crea una nueva
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);