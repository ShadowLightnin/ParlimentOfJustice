import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { defaultRoles } from "./defaultRoles";

export const assignDefaultRoles = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  for (const defaultUser of defaultRoles) {
    const matchingUser = usersList.find(user => user.name === defaultUser.name);

    if (matchingUser && matchingUser.role !== defaultUser.role) {
      try {
        const userRef = doc(db, "users", matchingUser.id);
        await updateDoc(userRef, { role: defaultUser.role });

        console.log(`✅ Role updated for ${matchingUser.name} to ${defaultUser.role}`);
      } catch (error) {
        console.error(`🔥 Error updating ${matchingUser.name}:`, error.message);
      }
    }
  }
};
