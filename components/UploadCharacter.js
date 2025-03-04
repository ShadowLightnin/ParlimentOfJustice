import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadCharacter } from "../api/uploadCharacter";

const UploadCharacter = ({ route }) => {
  const { teamId } = route.params || {}; // Get team ID from navigation
  const [character, setCharacter] = useState({
    codename: "",
    realName: "",
    colorScheme: "",
    teamId: teamId || "", // Default to passed team ID
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload Character
  const handleUpload = async () => {
    if (!character.codename || !character.realName || !image) {
      alert("Please fill all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      // Convert image to Blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Upload character data
      const result = await uploadCharacter(character, blob);
      alert(result.message);

      // Reset fields on success
      if (result.success) {
        setCharacter({ codename: "", realName: "", colorScheme: "", teamId: teamId || "" });
        setImage(null);
      }
    } catch (error) {
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Character</Text>

      <TextInput 
        placeholder="Codename" 
        style={styles.input} 
        onChangeText={(text) => setCharacter({ ...character, codename: text })} 
        value={character.codename}
      />
      <TextInput 
        placeholder="Real Name" 
        style={styles.input} 
        onChangeText={(text) => setCharacter({ ...character, realName: text })} 
        value={character.realName}
      />
      <TextInput 
        placeholder="Color Scheme" 
        style={styles.input} 
        onChangeText={(text) => setCharacter({ ...character, colorScheme: text })} 
        value={character.colorScheme}
      />
      <TextInput 
        placeholder="Team ID" 
        style={styles.input} 
        onChangeText={(text) => setCharacter({ ...character, teamId: text })} 
        value={character.teamId}
      />

      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#00b3ff" />
      ) : (
        <Button title="Upload Character" onPress={handleUpload} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default UploadCharacter;
