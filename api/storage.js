import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload image
export async function uploadImage(file, folder = "uploads/images") {
  const storageRef = ref(storage, `${folder}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/** ============================
 🔥 PROFILE PICTURES
============================ **/

// ✅ Upload Profile Picture
export async function uploadProfilePicture(userId, file) {
  const storageRef = ref(storage, `profile_pictures/${userId}.jpg`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** ============================
 🔥 CHARACTER IMAGES
============================ **/

// ✅ Upload Character Image
export async function uploadCharacterImage(characterId, file) {
  const storageRef = ref(storage, `characters/${characterId}.jpg`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** ============================
 🔥 DESIGN UPLOADS (Images, Videos, Files)
============================ **/

// ✅ Upload Image
export async function uploadImage(file) {
  const storageRef = ref(storage, `uploads/images/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ✅ Upload Video
export async function uploadVideo(file) {
  const storageRef = ref(storage, `uploads/videos/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ✅ Upload Other File
export async function uploadOther(file) {
  const storageRef = ref(storage, `uploads/others/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
