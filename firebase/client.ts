import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyzLnp8ijDD0t-teF5qWEqUChQqfzMyNs",
  authDomain: "prepwise-2c592.firebaseapp.com",
  projectId: "prepwise-2c592",
  storageBucket: "prepwise-2c592.firebasestorage.app",
  messagingSenderId: "613364727912",
  appId: "1:613364727912:web:7de0d2ba7e1619c0b83bdd",
  measurementId: "G-HPLDZE21K5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);