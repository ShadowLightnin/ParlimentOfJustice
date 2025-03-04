import { db, storage, auth } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

// Upload Design Function
export const uploadDesign = async (designData, file) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // Get user role
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User data not found");

    const userData = userSnap.data();
    if (userData.role !== "editor" && userData.role !== "admin") {
      throw new Error("You do not have permission to upload designs");
    }

    // Upload File to Firebase Storage
    const fileRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    // Save Design Data in Firestore
    const newDesign = {
      name: designData.name,
      category: designData.category,
      type: designData.type,
      userId: user.uid,
      url: fileUrl,
      timestamp: Date.now(),
    };

    await addDoc(collection(db, "uploads"), newDesign);

    return { success: true, message: "Design uploaded successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
