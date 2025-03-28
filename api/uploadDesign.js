import { auth, db, storage } from "../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadDesign = async (designData, file) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("❌ User not logged in");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("❌ User data not found");

    const userData = userSnap.data();
    console.log(`✅ User Role: ${userData.role}`);

    if (userData.role !== "editor" && userData.role !== "admin") {
      throw new Error("❌ Permission Denied: You must be an Editor or Admin to upload.");
    }

    const fileRef = ref(storage, `uploads/${designData.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    const newDesign = {
      name: designData.name,
      category: designData.category,
      type: designData.type,
      userId: user.uid,
      url: fileUrl,
      timestamp: Date.now(),
    };

    await addDoc(collection(db, "uploads"), newDesign);

    return { success: true, message: "✅ Upload Successful!" };
  } catch (error) {
    console.error("🔥 Upload Error:", error.message);
    return { success: false, message: error.message };
  }
};