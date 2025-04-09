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
import { auth, db, storage } from "../../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { preloadedImages } from "../../HardCoded/preloadedImages";

const ALLOWED_EMAILS = [
  "samuelp.woodwell@gmail.com",
  "cummingsnialla@gmail.com",
  "will@test.com",
  "c1wcummings@gmail.com",
  "aileen@test.com",
];

const ModelsScreen = () => {
  const navigation = useNavigation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [canDelete, setCanDelete] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    fetchUploadedImages();
    checkUserAuthorization();
    if (preloadedImages.length > 0) {
      setBackgroundImage(preloadedImages[0]);
    }
  }, []);

  const checkUserAuthorization = () => {
    const user = auth.currentUser;
    if (user && ALLOWED_EMAILS.includes(user.email)) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
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
    console.log("deleteImage called - ID:", imageId, "CanDelete:", canDelete);
    if (!canDelete) {
      Alert.alert("Access Denied", "You are not authorized to delete images!");
      console.log("Blocked - User not authorized");
      return;
    }

    // Bypass alert for testing
    console.log("Proceeding with deletion for ID:", imageId);
    try {
      const imageRef = doc(db, "uploads", imageId);

      // Step 1: Get image data for URL
      const imageSnap = await getDoc(imageRef);
      if (!imageSnap.exists()) {
        console.log("Image not found with ID:", imageId);
        Alert.alert("Error", "Image not found");
        return;
      }
      const imageData = imageSnap.data();
      const imageUrl = imageData.url;

      // Step 2: Delete from Firestore
      await deleteDoc(imageRef);
      console.log("Image document deleted from Firestore with ID:", imageId);

      // Step 3: Delete from Storage
      if (imageUrl) {
        const imagePath = imageUrl.split('/o/')[1]?.split('?')[0];
        if (imagePath) {
          const storageRef = ref(storage, imagePath);
          await deleteObject(storageRef);
          console.log("Image file deleted from Storage with ID:", imageId);
        } else {
          console.log("Invalid image URL format:", imageUrl);
        }
      }

      // Refresh UI
      fetchUploadedImages();
      if (imageUrl === backgroundImage?.uri) {
        setBackgroundImage(preloadedImages[0] || null);
      }
      Alert.alert("Success", "Image deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error.message);
      Alert.alert("Error", "Failed to delete image: " + error.message);
    }
  };

  const handleImagePress = (image) => {
    setPreviewImage(image);
    setBackgroundImage(image);
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

        <Text style={styles.header}>3D Models</Text>

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

              {canDelete && (
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