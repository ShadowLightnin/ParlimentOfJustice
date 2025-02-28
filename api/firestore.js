import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";

// Fetch all teams
export async function fetchTeams() {
  const querySnapshot = await getDocs(collection(db, "teams"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch characters in a team
export async function fetchCharacters(teamId) {
  const querySnapshot = await getDocs(collection(db, "characters"));
  return querySnapshot.docs.filter(doc => doc.data().teamId === teamId).map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add a new character
export async function addCharacter(characterData) {
  const docRef = await addDoc(collection(db, "characters"), characterData);
  return docRef.id;
}

// Delete a character
export async function deleteCharacter(characterId) {
  await deleteDoc(doc(db, "characters", characterId));
}
