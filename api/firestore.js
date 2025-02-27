import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// Get all teams
export const getTeams = async () => {
  const teamsSnapshot = await getDocs(collection(db, "teams"));
  return teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all designs
export const getDesigns = async () => {
  const designsSnapshot = await getDocs(collection(db, "designs"));
  return designsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new design
export const addDesign = async (designData) => {
  try {
    await addDoc(collection(db, "designs"), designData);
  } catch (error) {
    console.error("Error adding design:", error);
  }
};

// Delete a design
export const deleteDesign = async (designId) => {
  try {
    await deleteDoc(doc(db, "designs", designId));
  } catch (error) {
    console.error("Error deleting design:", error);
  }
};
