import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadDesign } from "../api/uploadDesign";
import { useNavigation, useRoute } from "@react-navigation/native";

const UploadDesign = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fileType = route.params?.type || "file"; // Get file type from navigation params

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick a File
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type !== "cancel") {
      setFile(result);
    }
  };

  // Upload File
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const result = await uploadDesign({ name: file.name, type: fileType, category: "design" }, blob);
      alert(result.message);

      // Reset file selection on success
      if (result.success) {
        setFile(null);
      }
    } catch (error) {
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Upload {fileType.charAt(0).toUpperCase() + fileType.slice(1)}</Text>

      <Button title="Pick a File" onPress={pickFile} />
      {file && (
        <View style={styles.preview}>
          <Text style={styles.fileName}>{file.name}</Text>
          {fileType === "image" && <Image source={{ uri: file.uri }} style={styles.image} />}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#00b3ff" />
      ) : (
        <Button title="Upload" onPress={handleUpload} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1c", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 5 },
  backText: { fontSize: 18, color: "#00b3ff", fontWeight: "bold" },
  preview: { marginTop: 10, alignItems: "center" },
  fileName: { color: "#fff", fontSize: 16, marginBottom: 5 },
  image: { width: 100, height: 100, marginVertical: 10 },
});

export default UploadDesign;
