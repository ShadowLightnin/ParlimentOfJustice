import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import { uploadDesign } from "../api/uploadDesign";
import { useNavigation, useRoute } from "@react-navigation/native";

const UploadDesign = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, callback } = route.params || { type: "file" }; // "image", "video", or "file"

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    if (type === "image" || type === "video") {
      const options = {
        mediaTypes:
          type === "video"
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      };
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        setFile({
          uri: result.assets[0].uri,
          name: `${type}_${Date.now()}.${type === "video" ? "mp4" : "jpg"}`,
        });
      }
    } else {
      // Generic file picker for "file" type
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type !== "cancel") {
        setFile(result);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert(`Please select a ${type} to upload.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const result = await uploadDesign({ name: file.name, type, category: "design" }, blob);
      alert(result.message);

      if (result.success) {
        setFile(null);
        if (callback) callback();
        navigation.goBack();
      }
    } catch (error) {
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Upload {type.charAt(0).toUpperCase() + type.slice(1)}</Text>

      <Button title={`Pick a ${type}`} onPress={pickFile} />
      {file && (
        <View style={styles.preview}>
          <Text style={styles.fileName}>{file.name}</Text>
          {type === "image" && <Image source={{ uri: file.uri }} style={styles.previewMedia} />}
          {type === "video" && (
            <Video
              source={{ uri: file.uri }}
              style={styles.previewMedia}
              useNativeControls={false}
              resizeMode="cover"
              isLooping
              shouldPlay={false}
            />
          )}
          {type === "file" && (
            <Text style={styles.fileType}>File ready to upload</Text>
          )}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: "#00b3ff",
    fontWeight: "bold",
  },
  preview: {
    marginTop: 10,
    alignItems: "center",
  },
  fileName: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  previewMedia: {
    width: 150,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  fileType: {
    color: "#ccc",
    fontSize: 14,
  },
});

export default UploadDesign;