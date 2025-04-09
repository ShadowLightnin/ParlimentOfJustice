import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const OthersScreen = () => {
  const navigation = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userRole, setUserRole] = useState("viewer");

  useEffect(() => {
    fetchUploadedFiles();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    if (!auth.currentUser) return;
    const userQuery = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const userSnap = await getDocs(userQuery);
    if (userSnap.docs.length > 0) {
      setUserRole(userSnap.docs[0].data().role || "viewer");
    }
  };

  const fetchUploadedFiles = async () => {
    const q = query(
      collection(db, "uploads"),
      where("type", "in", ["image", "video"]), // Include only images and videos
      where("category", "==", "media") // Strictly filter by "media" category
    );
    const querySnapshot = await getDocs(q);
    const files = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUploadedFiles(files);
  };

  const deleteFile = async (fileId) => {
    Alert.alert("Delete Media?", "Are you sure you want to delete this media file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "uploads", fileId));
          fetchUploadedFiles();
        },
      },
    ]);
  };

  const handleFilePress = async (fileUrl) => {
    const supported = await Linking.canOpenURL(fileUrl);
    if (supported) {
      await Linking.openURL(fileUrl);
    } else {
      Alert.alert("Error", "Cannot open this media type on your device.");
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/camera2.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Media</Text>

        <ScrollView contentContainerStyle={styles.fileGrid}>
          {uploadedFiles.map((file) => (
            <View key={file.id} style={styles.fileContainer}>
              <TouchableOpacity onPress={() => handleFilePress(file.url)}>
                <View style={styles.fileCard}>
                  <Text style={styles.fileName} numberOfLines={2}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileType}>{file.type || "Media"}</Text>
                </View>
              </TouchableOpacity>
              {(auth.currentUser?.uid === file.userId || userRole === "admin") && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteFile(file.id)}
                >
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate("UploadDesign", { type: "media", category: "media", callback: fetchUploadedFiles })}
        >
          <Text style={styles.uploadText}>Upload New Media</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: "100%",
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
    zIndex: 10,
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
  fileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 20,
  },
  fileContainer: {
    position: "relative",
    margin: 5,
    width: 150,
  },
  fileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  fileName: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  fileType: {
    fontSize: 12,
    color: "#ccc",
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
});

export default OthersScreen;