// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzJXjghC2bH1OkOFIOCrCXoNQekPE32mo",
  authDomain: "chatapptest-2782a.firebaseapp.com",
  projectId: "chatapptest-2782a",
  storageBucket: "chatapptest-2782a.firebasestorage.app",
  messagingSenderId: "73298509507",
  appId: "1:73298509507:web:859d13ffa838f2e80fec76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
