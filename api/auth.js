import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

/** ============================
 🔥 SIGN UP A NEW USER
============================ **/
export async function signUp(email, password, username, realName) {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Assign default role
    const role = "viewer";

    // Save user data in Firestore
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      username,
      email,
      realName,
      role,
      createdAt: serverTimestamp(),
    });

    return { userId, role };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

/** ============================
 🔥 LOG IN A USER
============================ **/
export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Get user role from Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found in Firestore.");
    }

    return { userId, ...userSnap.data() };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

/** ============================
 🔥 LOG OUT A USER
============================ **/
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
