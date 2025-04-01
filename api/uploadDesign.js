import { auth, db, storage } from "../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ALLOWED_EMAILS = [
  "samuelp.woodwell@gmail.com",
  "cummingsnialla@gmail.com",
  "will@test.com",
  "c1wcummings@gmail.com",
  "aileen@test.com",
];

export const uploadDesign = async (designData, file) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("❌ User not logged in");

    if (!ALLOWED_EMAILS.includes(user.email)) {
      throw new Error("❌ Permission Denied: You are not authorized to upload.");
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