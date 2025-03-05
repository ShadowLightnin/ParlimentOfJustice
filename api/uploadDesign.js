export const uploadDesign = async (designData, file) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("❌ User not logged in");

    // Fetch user role
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("❌ User data not found");

    const userData = userSnap.data();
    console.log(`✅ User Role: ${userData.role}`); // Debug Role

    if (userData.role !== "editor" && userData.role !== "admin") {
      throw new Error("❌ Permission Denied: You must be an Editor or Admin to upload.");
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

    return { success: true, message: "✅ Upload Successful!" };
  } catch (error) {
    console.error("🔥 Upload Error:", error.message);
    return { success: false, message: error.message };
  }
};
