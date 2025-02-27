import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload media
export const uploadMedia = async (file, folder = "uploads") => {
  try {
    const fileRef = ref(storage, `${folder}/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
};
