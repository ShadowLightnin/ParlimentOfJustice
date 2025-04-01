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
import { auth, db, storage } from "../../lib/firebase"; // Add storage
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Add deleteObject

const ALLOWED_EMAILS = [
  "samuelp.woodwell@gmail.com",
  "cummingsnialla@gmail.com",
  "will@test.com",
  "c1wcummings@gmail.com",
  "aileen@test.com",
];

const OthersScreen = () => {
  const navigation = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
    checkUserAuthorization();
  }, []);

  const checkUserAuthorization = () => {
    const user = auth.currentUser;
    if (user && ALLOWED_EMAILS.includes(user.email)) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  };

  const fetchUploadedFiles = async () => {
    const q = query(
      collection(db, "uploads"),
      where("type", "not-in", ["image", "video"])
    );
    const querySnapshot = await getDocs(q);
    const files = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUploadedFiles(files);
  };

  const deleteFile = (fileId) => {
    console.log("deleteFile called - ID:", fileId, "CanDelete:", canDelete);
    if (!canDelete) {
      Alert.alert("Access Denied", "You are not authorized to delete files!");
      console.log("Blocked - User not authorized");
      return;
    }
  
    Alert.alert(
      "Delete File",
      "Are you sure you want to delete this file?",
      [
        { text: "No", style: "cancel", onPress: () => console.log("Delete canceled") },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            console.log("Yes pressed - Triggering deletion for ID:", fileId);
            performDeleteFile(fileId);
          },
        },
      ],
      { cancelable: true, onDismiss: () => console.log("Alert dismissed") }
    );
  };
  
  const performDeleteFile = async (fileId) => {
    try {
      console.log("Performing deletion for ID:", fileId);
      const fileRef = doc(db, "uploads", fileId);
  
      const fileSnap = await getDoc(fileRef);
      if (!fileSnap.exists()) {
        console.log("File not found with ID:", fileId);
        Alert.alert("Error", "File not found");
        return;
      }
      const fileData = fileSnap.data();
      const fileUrl = fileData.url;
  
      await deleteDoc(fileRef);
      console.log("File document deleted from Firestore with ID:", fileId);
  
      if (fileUrl) {
        const filePath = fileUrl.split('/o/')[1]?.split('?')[0];
        if (filePath) {
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);
          console.log("File deleted from Storage with ID:", fileId);
        } else {
          console.log("Invalid file URL format:", fileUrl);
        }
      }
  
      fetchUploadedFiles();
      Alert.alert("Success", "File deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error.message);
      Alert.alert("Error", "Failed to delete file: " + error.message);
    }
  };
  
  const handleFilePress = async (fileUrl) => {
    const supported = await Linking.canOpenURL(fileUrl);
    if (supported) {
      await Linking.openURL(fileUrl);
    } else {
      Alert.alert("Error", "Cannot open this file type on your device.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://via.placeholder.com/150" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Others</Text>

        <ScrollView contentContainerStyle={styles.fileGrid}>
          {uploadedFiles.map((file) => (
            <View key={file.id} style={styles.fileContainer}>
              <TouchableOpacity onPress={() => handleFilePress(file.url)}>
                <View style={styles.fileCard}>
                  <Text style={styles.fileName} numberOfLines={2}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileType}>{file.type || "File"}</Text>
                </View>
              </TouchableOpacity>
              {canDelete && (
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
          onPress={() => navigation.navigate("UploadDesign", { type: "file", callback: fetchUploadedFiles })}
        >
          <Text style={styles.uploadText}>Upload New File</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// ... (styles remain unchanged)

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