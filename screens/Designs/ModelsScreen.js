import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { preloadedImages } from "../../HardCoded/preloadedImages"; // Import preloaded images

const ModelsScreen = () => {
  const navigation = useNavigation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userRole, setUserRole] = useState("viewer");

  useEffect(() => {
    fetchUploadedImages();
    fetchUserRole();
  }, []);

  // Get user role
  const fetchUserRole = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDocs(userRef);
    if (userSnap.exists()) {
      setUserRole(userSnap.data().role);
    }
  };

  // Fetch uploaded images
  const fetchUploadedImages = async () => {
    const q = query(collection(db, "uploads"), where("type", "==", "image"));
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUploadedImages(images);
  };

  // Delete Image
  const deleteImage = async (imageId) => {
    Alert.alert("Delete Image?", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await deleteDoc(doc(db, "uploads", imageId));
          fetchUploadedImages();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Models</Text>

      {/* Image Gallery */}
      <ScrollView contentContainerStyle={styles.imageGrid}>
        {/* Preloaded Images */}
        {preloadedImages.map((image, index) => (
          <Image key={`pre-${index}`} source={image} style={styles.image} />
        ))}

        {/* Uploaded Images */}
        {uploadedImages.map((image) => (
          <View key={image.id} style={styles.imageContainer}>
            <Image source={{ uri: image.url }} style={styles.image} />
            {(auth.currentUser?.uid === image.userId || userRole === "admin") && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(image.id)}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate("UploadDesign", { type: "image" })}>
        <Text style={styles.uploadText}>Upload New Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", paddingTop: 50, alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 5 },
  backText: { fontSize: 18, color: "#00b3ff", fontWeight: "bold" },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingVertical: 20 },
  image: { width: 100, height: 100, margin: 5, borderRadius: 10 },
  imageContainer: { position: "relative" },
  deleteButton: { position: "absolute", top: 5, right: 5, backgroundColor: "red", borderRadius: 15, width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  deleteText: { color: "white", fontSize: 16, fontWeight: "bold" },
  uploadButton: { marginTop: 20, backgroundColor: "#00b3ff", padding: 15, borderRadius: 8 },
  uploadText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default ModelsScreen;
