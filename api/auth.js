import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Sign up user
export async function signUpUser(email, password, realName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;

  // Store user in Firestore
  await setDoc(doc(db, "users", userId), {
    realName,
    email,
    role: "viewer",
    createdAt: new Date(),
  });

  return userCredential.user;
}

// Login user
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Logout user
export async function logoutUser() {
  await signOut(auth);
}
