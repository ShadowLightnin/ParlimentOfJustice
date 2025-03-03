import { db } from "./firebaseConfig";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

/** ============================
 🔥 USERS COLLECTION (Authentication)
============================ **/

// ✅ Create a new user when they sign up
export async function createUser(userId, email, username, realName, role = "viewer") {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    email,
    username,
    realName, // Only visible to admins
    role, // "viewer" | "editor" | "admin"
    createdAt: serverTimestamp(),
  });
}

// ✅ Fetch a user's data
export async function getUser(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

// ✅ Upgrade a user's role
export async function updateUserRole(userId, newRole) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role: newRole });
}

/** ============================
 🔥 TEAMS COLLECTION
============================ **/

// ✅ Create a new team
export async function createTeam(teamId, name, members = []) {
  const teamRef = doc(db, "teams", teamId);
  await setDoc(teamRef, {
    name,
    members, // Array of userIds
    chatEnabled: true, // Default true
  });
}

// ✅ Fetch all teams
export async function fetchTeams() {
  const querySnapshot = await getDocs(collection(db, "teams"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ✅ Toggle team chat
export async function toggleTeamChat(teamId, enabled) {
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, { chatEnabled: enabled });
}

/** ============================
 🔥 CHARACTERS COLLECTION
============================ **/

// ✅ Create a character
export async function addCharacter(characterId, codename, realName, colorScheme, about, profileImage) {
  const charRef = doc(db, "characters", characterId);
  await setDoc(charRef, {
    codename,
    realName, // Only visible to admins
    colorScheme,
    about,
    profileImage, // URL from Firebase Storage
  });
}

// ✅ Fetch all characters
export async function fetchCharacters() {
  const querySnapshot = await getDocs(collection(db, "characters"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/** ============================
 🔥 COMMENTS COLLECTION
============================ **/

// ✅ Add a new comment (for characters or designs)
export async function addComment(commentId, text, userId, type, linkedId) {
  const commentRef = doc(db, "comments", commentId);
  await setDoc(commentRef, {
    text,
    userId,
    type, // "character" | "design"
    linkedId, // CharacterId or DesignId
    createdAt: serverTimestamp(),
  });
}

// ✅ Fetch comments for a character/design
export async function fetchComments(linkedId) {
  const querySnapshot = await getDocs(collection(db, "comments"));
  return querySnapshot.docs
    .filter(doc => doc.data().linkedId === linkedId)
    .map(doc => ({ id: doc.id, ...doc.data() }));
}

/** ============================
 🔥 UPLOADS COLLECTION
============================ **/

// ✅ Save an upload reference
export async function addUpload(uploadId, fileType, url, uploadedBy) {
  const uploadRef = doc(db, "uploads", uploadId);
  await setDoc(uploadRef, {
    fileType, // "image" | "video" | "other"
    url, // Firebase Storage URL
    uploadedBy,
    createdAt: serverTimestamp(),
  });
}

// ✅ Fetch all uploads
export async function fetchUploads() {
  const querySnapshot = await getDocs(collection(db, "uploads"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
