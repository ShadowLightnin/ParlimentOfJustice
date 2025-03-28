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
  ImageBackground,
  Dimensions,
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
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    fetchUploadedImages();
    fetchUserRole();
    if (preloadedImages.length > 0) {
      setBackgroundImage(preloadedImages[0]); // Set initial background
    }
  }, []);

  const fetchUserRole = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDocs(userRef); // This was incorrect; should use getDoc
    const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", auth.currentUser.uid)));
    if (userDoc.docs.length > 0) {
      setUserRole(userDoc.docs[0].data().role || "viewer");
    }
  };

  const fetchUploadedImages = async () => {
    const q = query(collection(db, "uploads"), where("type", "==", "image"));
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map((doc) => ({
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
          if (uploadedImages.find((img) => img.id === imageId)?.url === backgroundImage?.uri) {
            setBackgroundImage(preloadedImages[0] || null);
          }
        },
      },
    ]);
  };

  const handleImagePress = (image) => {
    setPreviewImage(image); // Show in preview modal
    setBackgroundImage(image); // Set as background
  };

  return (
    <ImageBackground
      source={backgroundImage || { uri: "https://via.placeholder.com/150" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Models</Text>

        <ScrollView contentContainerStyle={styles.imageGrid}>
          {preloadedImages.map((image, index) => (
            <TouchableOpacity
              key={`pre-${index}`}
              onPress={() => handleImagePress(image)}
            >
              <View style={styles.imageWrapper}>
                <Image source={image} style={styles.image} resizeMode="cover" />
                <View style={styles.imageOverlay} />
              </View>
            </TouchableOpacity>
          ))}

          {uploadedImages.map((image) => (
            <View key={image.id} style={styles.imageContainer}>
              <TouchableOpacity onPress={() => handleImagePress({ uri: image.url })}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: image.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
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
          onPress={() => navigation.navigate("UploadDesign", { type: "image", callback: fetchUploadedImages })}
        >
          <Text style={styles.uploadText}>Upload New Image</Text>
        </TouchableOpacity>

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
              onPress={() => setPreviewImage(null)}
            >
              <Image
                source={previewImage}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <View style={styles.transparentOverlay} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 50,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    zIndex: 10, // Ensure clickable
  },
  backText: {
    fontSize: 18,
    color: "#00b3ff",
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 20,
  },
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
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
  },
  imageContainer: {
    position: "relative",
  },
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
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: "#00b3ff",
    padding: 15,
    borderRadius: 8,
  },
  uploadText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
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
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1,
  },
});

export default ModelsScreen;