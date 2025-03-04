import { auth, firestore } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register User
export const registerUser = async (email, password, name, device) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(firestore, "users", user.uid), {
    uid: user.uid,
    displayName: name,
    role: "viewer", // Default role
    device: device,
  });

  return user;
};

// Login User
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};
