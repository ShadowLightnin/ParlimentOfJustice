import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const BookDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId, bookTitle } = route.params;

  const [characters, setCharacters] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Fetch characters for this book
  useEffect(() => {
    const fetchCharacters = async () => {
      const querySnapshot = await getDocs(collection(db, "books", bookId, "characters"));
      const characterList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCharacters(characterList);
    };
    fetchCharacters();
  }, [bookId]);

  // Upload image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `characters/${Date.now()}_${Math.random().toString(36).substring(7)}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  // Pick image for character
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Add a new character
  const addCharacter = async () => {
    if (!name || !description) {
      Alert.alert("Error", "Please enter a name and description");
      return;
    }

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImage(image);
    }

    const newCharacter = {
      name,
      description,
      imageUrl: imageUrl || "https://via.placeholder.com/150",
    };

    const docRef = await addDoc(collection(db, "books", bookId, "characters"), newCharacter);
    setCharacters([...characters, { id: docRef.id, ...newCharacter }]);
    setName("");
    setDescription("");
    setImage(null);
  };

  // Delete a character with confirmation
  const deleteCharacter = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this character?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "books", bookId, "characters", id));
            setCharacters(characters.filter((char) => char.id !== id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Books</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{bookTitle} - Characters</Text>

      {/* Character Creation Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Character Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>
            {image ? "Image Selected" : "Upload Image"}
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <TouchableOpacity onPress={addCharacter} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Character</Text>
        </TouchableOpacity>
      </View>

      {/* Character List */}
      <ScrollView style={styles.characterList}>
        {characters.map((char) => (
          <View key={char.id} style={styles.characterCard}>
            <Image source={{ uri: char.imageUrl }} style={styles.characterImage} />
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{char.name}</Text>
              <Text style={styles.characterDescription}>{char.description}</Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteCharacter(char.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(118, 11, 11, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#FFF",
    width: "90%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  characterList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  characterCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  characterDescription: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default BookDetails;