// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-G5NEf0WTNz1iNM3J080Ebf0FcpvK89w",
  authDomain: "parlimentofjustice-6354e.firebaseapp.com",
  projectId: "parlimentofjustice-6354e",
  storageBucket: "parlimentofjustice-6354e.firebasestorage.app",
  messagingSenderId: "307152016266",
  appId: "1:307152016266:web:8c8277dbdf3a5b4645ae73",
  measurementId: "G-67C8XXYKVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };