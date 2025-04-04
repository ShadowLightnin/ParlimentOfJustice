import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDoc, getDocs } from "firebase/firestore"; // Ensure getDoc and getDocs are imported
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"; // Ensure deleteObject is imported
import * as ImagePicker from "expo-image-picker";

const ALLOWED_EMAILS = [
  "samuelp.woodwell@gmail.com",
  "cummingsnialla@gmail.com",
  "will@test.com",
  "c1wcummings@gmail.com",
  "aileen@test.com",
];

const MontroseManorTab = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [canUpload, setCanUpload] = useState(false);

  const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");

  const hardcodedBooks = [
    // {
    //   id: "hardcoded-1",
    //   title: "The Crimson Tome",
    //   imageUrl: require("../../../assets/Books/CrimsonTome.jpg"),
    //   hardcoded: true,
    // },
    // {
    //   id: "hardcoded-2",
    //   title: "Whispers of the Void",
    //   imageUrl: require("../../../assets/Books/VoidWhispers.jpg"),
    //   hardcoded: true,
    // },
  ];

  useEffect(() => {
    const checkUserAuthorization = () => {
      const user = auth.currentUser;
      if (user && ALLOWED_EMAILS.includes(user.email)) {
        setCanUpload(true);
      } else {
        setCanUpload(false);
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, "books"),
      (querySnapshot) => {
        const firestoreBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          hardcoded: false,
        }));
        setBooks([...hardcodedBooks, ...firestoreBooks]);
        console.log("Books updated in real-time:", [...hardcodedBooks, ...firestoreBooks]);
      },
      (error) => {
        console.error("Error listening to books:", error);
        Alert.alert("Error", "Failed to load books: " + error.message);
      }
    );

    checkUserAuthorization();
    const unsubscribeAuth = auth.onAuthStateChanged(checkUserAuthorization);

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const uploadImage = async (uri) => {
    if (!canUpload) {
      Alert.alert("Access Denied", "You are not authorized to upload images.");
      return Promise.reject(new Error("Unauthorized"));
    }

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `books/${Date.now()}_${Math.random().toString(36).substring(7)}`);
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
    if (!canUpload) {
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
    }
  };

  const addBook = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!canUpload) {
      Alert.alert("Access Denied", "You are not authorized to add books.");
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const newBook = { title, imageUrl: imageUrl || "" };
      const docRef = await addDoc(collection(db, "books"), newBook);
      console.log("Book added with ID:", docRef.id);
      Alert.alert("Success", "Book added successfully!");
      setTitle("");
      setImage(null);
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Failed to add book: " + error.message);
    }
  };

  const deleteBook = async (id, hardcoded) => {
    console.log("DeleteBook called - ID:", id, "Hardcoded:", hardcoded, "CanUpload:", canUpload);
    if (hardcoded) {
      Alert.alert("Error", "Cannot delete hardcoded books!");
      console.log("Blocked - Hardcoded book");
      return;
    }
  
    if (!canUpload) {
      Alert.alert("Access Denied", "You are not authorized to delete books.");
      console.log("Blocked - User not authorized");
      return;
    }
  
    // Temporarily bypass Alert for testing
    console.log("Proceeding with deletion for ID:", id);
    try {
      console.log("Attempting to delete book with ID:", id);
      const docRef = doc(db, "books", id);
      await deleteDoc(docRef);
      setTimeout(async () => {
        const checkSnap = await getDoc(docRef);
        console.log("Book still exists after delete?:", checkSnap.exists());
      }, 1000);
        console.log("Book deleted successfully with ID:", id);
      setBooks(books.filter((book) => book.id !== id));
      Alert.alert("Success", "Book deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error.message);
      Alert.alert("Error", "Failed to delete book: " + error.message);
    }
  
    Alert.alert(
      "Confirm",
      "Delete this book and all its characters/images?",
      [
        { text: "No", style: "cancel", onPress: () => console.log("Delete canceled") },
        { 
          text: "Yes", 
          style: "destructive",
          onPress: async () => {
            console.log("Delete confirmed for ID:", id);
            try {
              // Step 1: Get book data to find image URL (if any)
              const bookRef = doc(db, "books", id);
              const bookSnap = await getDoc(bookRef);
              if (!bookSnap.exists()) {
                console.log("Book not found with ID:", id);
                Alert.alert("Error", "Book not found");
                return;
              }
              const bookData = bookSnap.data();
              const imageUrl = bookData.imageUrl;
  
              // Step 2: Delete characters subcollection
              const charactersRef = collection(db, "books", id, "characters");
              const charactersSnapshot = await getDocs(charactersRef);
              const deleteCharactersPromises = charactersSnapshot.docs.map((charDoc) =>
                deleteDoc(doc(db, "books", id, "characters", charDoc.id))
              );
              await Promise.all(deleteCharactersPromises);
              console.log("All characters deleted for book ID:", id);
  
              // Step 3: Delete the book document
              await deleteDoc(bookRef);
              console.log("Book document deleted from Firestore with ID:", id);
  
              // Step 4: Delete the image from Storage (if it exists)
              if (imageUrl) {
                // Use the full imageUrl from Firestore if it’s the exact Storage path
                const imageRef = ref(storage, imageUrl.split('/o/')[1].split('?')[0]); // Extract path from URL
                await deleteObject(imageRef).catch((error) => {
                  if (error.code === "storage/object-not-found") {
                    console.log("No image found to delete for ID:", id);
                    console.log("Image URL to delete:", imageUrl);
                  } else {
                    throw error;
                  }
                });
                console.log("Image deleted from Storage for ID:", id);
              }
  
              // Update UI
              setBooks(books.filter((book) => book.id !== id));
              Alert.alert("Success", "Book, characters, and image deleted successfully!");
            } catch (error) {
              console.error("Delete Error:", error.message);
              Alert.alert("Error", "Failed to delete: " + error.message);
            }
          },
        },
      ],
      { cancelable: true, onDismiss: () => console.log("Alert dismissed") }
    );
  };
  
  const deleteBookConfirmed = async (id) => {
    try {
      console.log("Attempting to delete book with ID:", id);
      const docRef = doc(db, "books", id);
      await deleteDoc(docRef);
      console.log("Delete promise resolved for ID:", id);
      setBooks(books.filter((book) => book.id !== id));
      Alert.alert("Success", "Book deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error.message);
      Alert.alert("Error", "Failed to delete book: " + error.message);
    }
  };

  const startEditing = (book) => {
    if (!canUpload) {
      Alert.alert("Access Denied", "You are not authorized to edit books.");
      return;
    }
    setEditingBookId(book.id);
    setEditTitle(book.title);
  };

  const saveEdit = async (id) => {
    if (!canUpload) {
      Alert.alert("Access Denied", "You are not authorized to save changes.");
      return;
    }
    try {
      await updateDoc(doc(db, "books", id), { title: editTitle });
      console.log("Book updated with ID:", id);
      Alert.alert("Success", "Book updated successfully!");
      setEditingBookId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating book:", error);
      Alert.alert("Error", "Failed to update book: " + error.message);
    }
  };

  const goToHomeScreen = () => {
    navigation.navigate('BludBruhsHome');
  };

  const renderBookCard = (book) => (
    <View key={book.id} style={styles.bookContainer}>
      <TouchableOpacity
        style={[styles.bookTab, book.hardcoded && styles.hardcodedBook]}
        onPress={() =>
          navigation.navigate("BookDetails", {
            bookId: book.id,
            bookTitle: book.title,
            bookImageUrl: book.imageUrl || "",
          })
        }
      >
        {editingBookId === book.id ? (
          <TextInput
            style={styles.editInput}
            value={editTitle}
            onChangeText={setEditTitle}
            onSubmitEditing={() => saveEdit(book.id)}
            autoFocus
          />
        ) : (
          <Text style={styles.bookTitle}>{book.title}</Text>
        )}
        <Image
          source={book.imageUrl ? { uri: book.imageUrl } : PLACEHOLDER_IMAGE}
          style={styles.bookImage}
          resizeMode="cover"
          defaultSource={PLACEHOLDER_IMAGE}
        />
      </TouchableOpacity>
      {!book.hardcoded && (
        <View style={styles.buttonContainer}>
          {editingBookId === book.id ? (
            <TouchableOpacity onPress={() => saveEdit(book.id)} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => startEditing(book)} 
              style={[styles.editButton, !canUpload && styles.disabledButton]}
              disabled={!canUpload}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
            <TouchableOpacity 
              onPress={() => {
                console.log("Delete button pressed for ID:", book.id);
                deleteBook(book.id, book.hardcoded);
              }} 
              style={[styles.deleteButton, !canUpload && styles.disabledButton]}
              disabled={!canUpload}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/MontroseMansion.jpg")}
      style={styles.background}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("EvilMontrose")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Escape</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goToHomeScreen}
        style={styles.homeButton}
      >
        <Text style={styles.homeButtonText}>📖</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.verticalScrollContainer}>
        <View style={styles.overlay}>
          <Text style={styles.headerTitle}>Montrose Manor</Text>
          <Text style={styles.headerWarning}>(Warning: there is no deletion confirmation)</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Book Title"
              value={title}
              onChangeText={setTitle}
              editable={canUpload}
            />
            <TouchableOpacity 
              onPress={pickImage} 
              style={[styles.uploadButton, !canUpload && styles.disabledButton]}
              disabled={!canUpload}
            >
              <Text style={styles.uploadButtonText}>
                {canUpload ? (image ? "Image Selected" : "Upload Image") : "Upload Restricted"}
              </Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <TouchableOpacity 
              onPress={addBook} 
              style={[styles.addButton, !canUpload && styles.disabledButton]}
              disabled={!canUpload}
            >
              <Text style={styles.addButtonText}>Add Book</Text>
            </TouchableOpacity>
            {!canUpload && (
              <Text style={styles.accessDeniedText}>Only authorized users can upload images and add books.</Text>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {books.map(renderBookCard)}
          </ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isDesktop = SCREEN_WIDTH > 600;

const cardSizes = {
  desktop: { width: 300, height: 450 },
  mobile: { width: 200, height: 300 },
};

const styles = StyleSheet.create({
  background: { flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: "absolute", top: 0, left: 0 },
  verticalScrollContainer: {
    paddingBottom: 20, // Extra padding at bottom for scroll
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingTop: 80,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerWarning: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(201, 11, 11, 1)",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(118, 11, 11, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 10,
  },
  backButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  homeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  homeButtonText: {
    fontSize: 24,
    color: "#FFF",
  },
  formContainer: { padding: 20, alignItems: "center" },
  input: {
    backgroundColor: "#FFF",
    width: SCREEN_WIDTH * 0.8,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: { color: "#FFF", fontWeight: "bold" },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: "cover",
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: { color: "#FFF", fontWeight: "bold" },
  horizontalScrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bookContainer: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  bookTab: {
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
    backgroundColor: "rgba(65, 62, 62, 0.9)",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    overflow: "hidden",
    elevation: 5,
  },
  hardcodedBook: {
    borderColor: "#FFD700",
    borderWidth: 2,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFF",
  },
  editInput: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  bookImage: {
    width: "100%",
    height: isDesktop ? cardSizes.desktop.height - 50 : cardSizes.mobile.height - 50,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  editButtonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  deleteButtonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
});

export default MontroseManorTab;