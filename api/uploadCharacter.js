import { db, storage, auth } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

// Upload Character Function
export const uploadCharacter = async (characterData, imageFile) => {
  try {
    // Check user authentication
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // Get user role from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User data not found");

    const userData = userSnap.data();
    if (userData.role !== "editor" && userData.role !== "admin") {
      throw new Error("You do not have permission to upload characters");
    }

    // Upload Image to Firebase Storage
    const imageRef = ref(storage, `characters/${characterData.codename}.jpg`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Save Character Data in Firestore
    const newCharacter = {
      codename: characterData.codename,
      realName: characterData.realName,
      colorScheme: characterData.colorScheme,
      teamId: characterData.teamId,
      profileImage: imageUrl,
      createdBy: user.uid,
    };

    await addDoc(collection(db, "characters"), newCharacter);

    return { success: true, message: "Character uploaded successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
