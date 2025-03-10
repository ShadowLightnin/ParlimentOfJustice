import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-G5NEf0WTNz1iNM3J080Ebf0FcpvK89w",
  authDomain: "parlimentofjustice-6354e.firebaseapp.com",
  databaseURL: "https://parlimentofjustice-6354e-default-rtdb.firebaseio.com",
  projectId: "parlimentofjustice-6354e",
  storageBucket: "parlimentofjustice-6354e.appspot.com",
  messagingSenderId: "307152016266",
  appId: "1:307152016266:web:8c8277dbdf3a5b4645ae73",
  measurementId: "G-67C8XXYKVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // ✅ Firestore (Fix)
const auth = getAuth(app);  // Authentication
const storage = getStorage(app);  // Storage
const database = getDatabase(app);  // ✅ Realtime Database

export { auth, db, storage, database };
