import { firestore } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Get User Role
export const getUserRole = async (userId) => {
  const userDoc = await getDoc(doc(firestore, "users", userId));
  return userDoc.exists() ? userDoc.data().role : null;
};

// Auto-Upgrade Role
export const autoUpgradeRole = async (userId, realName) => {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return;

  const userData = userDoc.data();
  const charactersRef = doc(firestore, "characters", realName);
  const characterDoc = await getDoc(charactersRef);

  if (characterDoc.exists() && userData.role === "viewer") {
    await updateDoc(userRef, { role: "editor", characterId: characterDoc.id });
  }
};

// Admin Role Upgrade
export const upgradeToAdmin = async (userId) => {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, { role: "admin" });
};
