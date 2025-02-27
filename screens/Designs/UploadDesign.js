import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { addDesign } from "../../api/firestore";
import { uploadMedia } from "../../api/storage";

export default function UploadDesign({ navigation }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  async function handleUpload() {
    if (!title || !file) {
      Alert.alert("Error", "Please enter a title and select a file.");
      return;
    }

    const fileUrl = await uploadMedia(file);
    if (!fileUrl) return;

    await addDesign({ title, imageUrl: fileUrl });
    Alert.alert("Success", "Design uploaded!");
    navigation.goBack();
  }

  return (
    <View>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} />
      <Button title="Select File" onPress={() => {/* File Picker Code Here */}} />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
}
