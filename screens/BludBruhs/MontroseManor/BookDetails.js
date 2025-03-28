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
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const BookDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId, bookTitle, bookImageUrl } = route.params;

  const [characters, setCharacters] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingCharId, setEditingCharId] = useState(null); // Track editing character
  const [editName, setEditName] = useState(""); // Store edited name
  const [editDescription, setEditDescription] = useState(""); // Store edited description

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

  const startEditing = (char) => {
    setEditingCharId(char.id);
    setEditName(char.name);
    setEditDescription(char.description);
  };

  const saveEdit = async (id) => {
    if (!editName || !editDescription) {
      Alert.alert("Error", "Name and description cannot be empty");
      return;
    }
    await updateDoc(doc(db, "books", bookId, "characters", id), {
      name: editName,
      description: editDescription,
    });
    setCharacters(
      characters.map((char) =>
        char.id === id ? { ...char, name: editName, description: editDescription } : char
      )
    );
    setEditingCharId(null);
    setEditName("");
    setEditDescription("");
  };

  return (
    <ImageBackground
      source={{ uri: bookImageUrl || "https://via.placeholder.com/150" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Books</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{bookTitle} - Characters</Text>

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

        <ScrollView style={styles.characterList}>
          {characters.map((char) => (
            <View key={char.id} style={styles.characterCard}>
              <Image source={{ uri: char.imageUrl }} style={styles.characterImage} />
              <View style={styles.characterInfo}>
                {editingCharId === char.id ? (
                  <>
                    <TextInput
                      style={styles.editInput}
                      value={editName}
                      onChangeText={setEditName}
                      autoFocus
                    />
                    <TextInput
                      style={[styles.editInput, styles.editDescriptionInput]}
                      value={editDescription}
                      onChangeText={setEditDescription}
                      multiline
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.characterName}>{char.name}</Text>
                    <Text style={styles.characterDescription}>{char.description}</Text>
                  </>
                )}
              </View>
              <View style={styles.buttonContainer}>
                {editingCharId === char.id ? (
                  <TouchableOpacity
                    onPress={() => saveEdit(char.id)}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => startEditing(char)}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteCharacter(char.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
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
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(118, 11, 11, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10, // Ensure it’s clickable
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
    color: "#FFF",
  },
  formContainer: {
    padding: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
    color: "#333",
  },
  characterDescription: {
    fontSize: 14,
    color: "#666",
  },
  editInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  editDescriptionInput: {
    fontSize: 14,
    height: 60,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
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