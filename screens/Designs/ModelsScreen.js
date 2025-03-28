import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { preloadedImages } from "../../HardCoded/preloadedImages";

const ModelsScreen = () => {
  const navigation = useNavigation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userRole, setUserRole] = useState("viewer");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchUploadedImages();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDocs(userRef);
    if (userSnap.exists()) {
      setUserRole(userSnap.data().role);
    }
  };

  const fetchUploadedImages = async () => {
    const q = query(collection(db, "uploads"), where("type", "==", "image"));
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      contentType: doc.data().contentType || "image/jpeg",
    }));
    setUploadedImages(images);
  };

  const deleteImage = async (imageId) => {
    Alert.alert("Delete Image?", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "uploads", imageId));
          fetchUploadedImages();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Models</Text>

      <ScrollView contentContainerStyle={styles.imageGrid}>
        {/* Preloaded Images */}
        {preloadedImages.map((image, index) => (
          <TouchableOpacity key={`pre-${index}`} onPress={() => setPreviewImage(image)}>
            <View style={styles.imageWrapper}>
              <Image source={image} style={styles.image} />
              <View style={styles.overlay} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Uploaded Images */}
        {uploadedImages.map((image) => (
          <View key={image.id} style={styles.imageContainer}>
            <TouchableOpacity onPress={() => setPreviewImage({ uri: image.url })}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.overlay} />
              </View>
            </TouchableOpacity>

            {(auth.currentUser?.uid === image.userId || userRole === "admin") && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteImage(image.id)}
              >
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate("UploadDesign", { type: "image" })}
      >
        <Text style={styles.uploadText}>Upload New Image</Text>
      </TouchableOpacity>

      {/* Image Preview Modal */}
      <Modal
        visible={!!previewImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setPreviewImage(null)} // Close preview when clicking outside the image
          >
            <Image
              source={previewImage}
              style={styles.previewImage}
              resizeMode="contain"
            />
            {/* Close button inside the preview */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPreviewImage(null)}
            >
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            {/* Transparent overlay to prevent saving */}
            <View style={styles.transparentOverlay} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", paddingTop: 50, alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
  },
  backText: { fontSize: 18, color: "#00b3ff", fontWeight: "bold" },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingVertical: 20 },

  // Image and Overlay Styles
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Transparent cover
    borderRadius: 10,
  },

  imageContainer: { position: "relative" },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: { color: "white", fontSize: 16, fontWeight: "bold" },
  uploadButton: { marginTop: 20, backgroundColor: "#00b3ff", padding: 15, borderRadius: 8 },
  uploadText: { fontSize: 18, color: "#fff", fontWeight: "bold" },

  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent overlay to prevent saving
    zIndex: 1, // Ensures overlay blocks long-press without affecting button clicks
  },
});

export default ModelsScreen;
