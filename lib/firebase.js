// lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  // New Firebase
  // apiKey: "AIzaSyCHTboy4TjbKd-pHYvO03A4FLu0NRSsm-8",
  // authDomain: "parliament-firebase.firebaseapp.com",
  // projectId: "parliament-firebase",
  // storageBucket: "parliament-firebase.firebasestorage.app",
  // messagingSenderId: "238802441954",
  // appId: "1:238802441954:web:70cbe5217b1ce1821f30bb"

  // Old Firebase (doesn't want to work)
  // apiKey: "AIzaSyD-G5NEf0WTNz1iNM3J080Ebf0FcpvK89w",
  // authDomain: "parlimentofjustice-6354e.firebaseapp.com",
  // projectId: "parlimentofjustice-6354e",
  // storageBucket: "parlimentofjustice-6354e.firebasestorage.app",
  // messagingSenderId: "307152016266",
  // appId: "1:307152016266:web:8c8277dbdf3a5b4645ae73",

  // Chat App Firebase for the chat stuff just in case
  apiKey: "AIzaSyCzJXjghC2bH1OkOFIOCrCXoNQekPE32mo",
  authDomain: "chatapptest-2782a.firebaseapp.com",
  projectId: "chatapptest-2782a",
  storageBucket: "chatapptest-2782a.firebasestorage.app",
  messagingSenderId: "73298509507",
  appId: "1:73298509507:web:859d13ffa838f2e80fec76",
};

// ✅ Only initialize once (important for Expo / fast refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Proper Auth setup for web vs native
let auth;

if (Platform.OS === "web") {
  // Web can just use normal getAuth
  auth = getAuth(app);
} else {
  // React Native: use AsyncStorage for persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
