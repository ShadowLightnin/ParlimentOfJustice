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
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase"; // Ensure auth is imported
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

// Define allowed emails for image uploads and other actions (replace with actual emails)
const ALLOWED_EMAILS = [
  "samuelp.woodwell@gmail.com", // Replace with actual emails
  "cummingsnialla@gmail.com",
  "will@test.com",
  "c1wcummings@gmail.com",
  "aileen@test.com",
];

const BookDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId, bookTitle, bookImageUrl } = route.params;

  const [characters, setCharacters] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [useImage, setUseImage] = useState(null);
  const [editingCharId, setEditingCharId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [canModify, setCanModify] = useState(false); // Track modification permission

  const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");
  const PLACEHOLDER_URL = "placeholder";

  useEffect(() => {
    const checkUserAuthorization = () => {
      const user = auth.currentUser;
      if (user && ALLOWED_EMAILS.includes(user.email)) {
        setCanModify(true);
      } else {
        setCanModify(false);
      }
    };

    const fetchCharacters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books", bookId, "characters"));
        const characterList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCharacters(characterList);
      } catch (error) {
        console.error("Error fetching characters:", error);
        Alert.alert("Error", "Failed to load characters: " + error.message);
      }
    };

    checkUserAuthorization();
    fetchCharacters();

    // Set up auth state listener
    const unsubscribeAuth = auth.onAuthStateChanged(checkUserAuthorization);

    return () => unsubscribeAuth(); // Clean up auth listener
  }, [bookId]);

  const uploadImage = async (uri) => {
    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to upload images.");
      return Promise.reject(new Error("Unauthorized"));
    }

    try {
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
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUseImage(true);
    }
  };

  const skipImage = () => {
    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to modify characters.");
      return;
    }
    setImage(null);
    setUseImage(false);
  };

  const addCharacter = async () => {
    if (!name || !description) {
      Alert.alert("Error", "Please enter a name and description");
      return;
    }

    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to add characters.");
      return;
    }

    try {
      let imageUrl;
      if (useImage === true && image) {
        imageUrl = await uploadImage(image);
      } else if (useImage === false) {
        imageUrl = null;
      } else {
        imageUrl = PLACEHOLDER_URL;
      }

      const newCharacter = {
        name,
        description,
        imageUrl,
      };

      const docRef = await addDoc(collection(db, "books", bookId, "characters"), newCharacter);
      setCharacters([...characters, { id: docRef.id, ...newCharacter }]);
      setName("");
      setDescription("");
      setImage(null);
      setUseImage(null);
      Alert.alert("Success", "Character added successfully!");
    } catch (error) {
      console.error("Error adding character:", error);
      Alert.alert("Error", "Failed to add character: " + error.message);
    }
  };

  const deleteCharacter = async (id) => {
    console.log("DeleteCharacter called - ID:", id, "CanModify:", canModify);
    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to delete characters.");
      return;
    }
  
    console.log("Proceeding with deletion for ID:", id); // Bypass alert
    try {
      const charRef = doc(db, "books", bookId, "characters", id);
      await deleteDoc(charRef);
      console.log("Character document deleted from Firestore with ID:", id);
      setCharacters(characters.filter((char) => char.id !== id));
      setSelectedCharacter(null);
      Alert.alert("Success", "Character deleted (bypass test)!");
    } catch (error) {
      console.error("Delete Error:", error.message);
      Alert.alert("Error", "Failed to delete character: " + error.message);
    }
  
    Alert.alert(
      "Confirm",
      "Delete this character and its image?",
      [
        { text: "Cancel", style: "cancel", onPress: () => console.log("Delete canceled") },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log("Delete confirmed - Proceeding with deletion for ID:", id);
            try {
              const charRef = doc(db, "books", bookId, "characters", id);
  
              // Step 1: Get character data for image URL
              const charSnap = await getDoc(charRef);
              if (!charSnap.exists()) {
                console.log("Character not found with ID:", id);
                Alert.alert("Error", "Character not found");
                return;
              }
              const charData = charSnap.data();
              const imageUrl = charData.imageUrl;
  
              // Step 2: Delete the character document
              await deleteDoc(charRef);
              console.log("Character document deleted from Firestore with ID:", id);
  
              // Step 3: Delete the image from Storage (if it exists)
              if (imageUrl) {
                const imagePath = imageUrl.split('/o/')[1]?.split('?')[0];
                if (imagePath) {
                  const imageRef = ref(storage, imagePath);
                  await deleteObject(imageRef).catch((error) => {
                    if (error.code === "storage/object-not-found") {
                      console.log("No image found to delete at:", imagePath);
                    } else {
                      throw error;
                    }
                  });
                  console.log("Image deleted from Storage for ID:", id);
                } else {
                  console.log("Invalid image URL format:", imageUrl);
                }
              }
  
              // Update UI
              setCharacters(characters.filter((char) => char.id !== id));
              setSelectedCharacter(null);
              Alert.alert("Success", "Character and image deleted successfully!");
            } catch (error) {
              console.error("Delete Error:", error.message);
              Alert.alert("Error", "Failed to delete character: " + error.message);
            }
          },
        },
      ],
      { cancelable: true, onDismiss: () => console.log("Alert dismissed") }
    );
  };

  const startEditing = (char) => {
    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to edit characters.");
      return;
    }
    setEditingCharId(char.id);
    setEditName(char.name);
    setEditDescription(char.description);
    setSelectedCharacter(char);
  };

  const saveEdit = async (id) => {
    if (!canModify) {
      Alert.alert("Access Denied", "You are not authorized to save changes.");
      return;
    }

    if (!editName || !editDescription) {
      Alert.alert("Error", "Name and description cannot be empty");
      return;
    }
    try {
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
      setSelectedCharacter(null);
      Alert.alert("Success", "Character updated successfully!");
    } catch (error) {
      console.error("Error updating character:", error);
      Alert.alert("Error", "Failed to update character: " + error.message);
    }
  };

  const renderCharacterCard = (char) => (
    <View key={char.id} style={styles.characterContainer}>
      <TouchableOpacity
        style={styles.characterCard}
        onPress={() => setSelectedCharacter(char)}
        disabled={!canModify}
      >
        {char.imageUrl === null ? (
          <View style={styles.noImagePlaceholder} />
        ) : (
          <Image
            source={char.imageUrl && char.imageUrl !== PLACEHOLDER_URL ? { uri: char.imageUrl } : PLACEHOLDER_IMAGE}
            style={styles.characterImage}
            defaultSource={PLACEHOLDER_IMAGE}
          />
        )}
        <View style={styles.transparentOverlay} />
        <Text style={styles.characterName}>{char.name}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => startEditing(char)} 
          style={[styles.editButton, !canModify && styles.disabledButton]}
          disabled={!canModify}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            console.log("Delete character button pressed for ID:", char.id);
            deleteCharacter(char.id);
          }} 
          style={[styles.deleteButton, !canModify && styles.disabledButton]}
          disabled={!canModify}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={bookImageUrl ? { uri: bookImageUrl } : PLACEHOLDER_IMAGE}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Books</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.verticalScrollContainer}>
          <Text style={styles.title}>{bookTitle} - Characters</Text>
          <Text style={styles.headerWarning}>(Warning: there is no deletion confirmation)</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Character Name"
              value={name}
              onChangeText={setName}
              editable={canModify}
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              editable={canModify}
            />
            <View style={styles.imageOptions}>
              <TouchableOpacity 
                onPress={pickImage} 
                style={[styles.uploadButton, !canModify && styles.disabledButton]}
                disabled={!canModify}
              >
                <Text style={styles.uploadButtonText}>
                  {canModify ? (image ? "Image Selected" : "Upload Image") : "Upload Restricted"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={skipImage} 
                style={[styles.noImageButton, !canModify && styles.disabledButton]}
                disabled={!canModify}
              >
                <Text style={styles.noImageButtonText}>No Image</Text>
              </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <TouchableOpacity 
              onPress={addCharacter} 
              style={[styles.addButton, !canModify && styles.disabledButton]}
              disabled={!canModify}
            >
              <Text style={styles.addButtonText}>Add Character</Text>
            </TouchableOpacity>
            {!canModify && (
              <Text style={styles.accessDeniedText}>Only authorized users can modify characters.</Text>
            )}
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.horizontalScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {characters.map(renderCharacterCard)}
          </ScrollView>
        </ScrollView>

        <Modal
          visible={!!selectedCharacter}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setSelectedCharacter(null);
            setEditingCharId(null);
          }}
        >
          <View style={styles.modalOverlay}>
            {selectedCharacter && (
              <ScrollView style={styles.previewContainer}>
                {editingCharId === selectedCharacter.id ? (
                  <>
                    <TextInput
                      style={styles.previewEditName}
                      value={editName}
                      onChangeText={setEditName}
                      autoFocus
                      editable={canModify}
                    />
                    <TextInput
                      style={styles.previewEditDescription}
                      value={editDescription}
                      onChangeText={setEditDescription}
                      multiline
                      editable={canModify}
                    />
                    <TouchableOpacity
                      onPress={() => saveEdit(selectedCharacter.id)}
                      style={[styles.saveButton, !canModify && styles.disabledButton]}
                      disabled={!canModify}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.previewName}>{selectedCharacter.name}</Text>
                    <Text style={styles.previewDescription}>{selectedCharacter.description}</Text>
                  </>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCharacter(null);
                    setEditingCharId(null);
                  }}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
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
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "cover",
  },
  disabledButton: {
    backgroundColor: "#cccccc", // Grayed out color for disabled buttons
    opacity: 0.6,
  },
  accessDeniedText: {
    color: "#ff4444",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
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
    zIndex: 10,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  verticalScrollContainer: {
    paddingBottom: 20, // Extra padding at bottom for scroll
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#FFF",
  },
  headerWarning: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(201, 11, 11, 1)",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
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
  imageOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  uploadButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  noImageButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  noImageButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
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
  horizontalScrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  characterContainer: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  characterCard: {
    width: 350,
    height: 450,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderColor: "red",
    borderWidth: 2,
  },
  characterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1,
  },
  characterName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 350,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: "rgba(72, 63, 63, 0.95)",
    borderRadius: 15,
    padding: 20,
  },
  previewName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  previewDescription: {
    fontSize: 16,
    color: "#fff7f7",
    textAlign: "center",
    marginBottom: 20,
  },
  previewEditName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "rgba(92, 86, 86, 0.95)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  previewEditDescription: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "rgba(100, 95, 95, 0.95)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default BookDetails;