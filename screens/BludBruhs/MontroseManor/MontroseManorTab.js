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
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const MontroseManorTab = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg"); // Confirm this path

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "books"),
      (querySnapshot) => {
        const bookList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(bookList);
        console.log("Books updated in real-time:", bookList);
      },
      (error) => {
        console.error("Error listening to books:", error);
        Alert.alert("Error", "Failed to load books: " + error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  const uploadImage = async (uri) => {
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

  const deleteBook = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Attempting to delete book with ID:", id);
              await deleteDoc(doc(db, "books", id));
              console.log("Book deleted successfully with ID:", id);
              Alert.alert("Success", "Book deleted successfully!");
            } catch (error) {
              console.error("Error deleting book:", error);
              Alert.alert("Error", "Failed to delete book: " + error.message);
            }
          },
        },
      ]
    );
  };

  const startEditing = (book) => {
    setEditingBookId(book.id);
    setEditTitle(book.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle) {
      Alert.alert("Error", "Title cannot be empty");
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

      <View style={styles.overlay}>
        <Text style={styles.headerTitle}>Montrose Manor</Text>
        <Text style={styles.headerTitle}>Books not working properly on backend</Text>
        <Text style={styles.headerTitle}>Do not make anymore books or characters please</Text>
        <Text style={styles.headerTitle}>or at the very least adding images to them</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Book Title"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              {image ? "Image Selected" : "Upload Image"}
            </Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.previewImage} />}
          <TouchableOpacity onPress={addBook} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Book</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookTab}
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
              <View style={styles.buttonContainer}>
                {editingBookId === book.id ? (
                  <TouchableOpacity
                    onPress={() => saveEdit(book.id)}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => startEditing(book)}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteBook(book.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: { flex: 1, width, height, position: "absolute", top: 0, left: 0 },
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)", paddingTop: 80 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
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
  formContainer: { padding: 20, alignItems: "center" },
  input: {
    backgroundColor: "#FFF",
    width: width * 0.8,
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
  scrollView: { flexGrow: 0 },
  bookTab: {
    width: 150,
    marginHorizontal: 10,
    backgroundColor: "rgba(65, 62, 62, 0.9)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#FFF",
  },
  editInput: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#FFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    padding: 5,
    width: "100%",
  },
  bookImage: { width: 130, height: 130, borderRadius: 5, marginBottom: 5 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: { color: "#FFF", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: { color: "#FFF", fontWeight: "bold" },
});

export default MontroseManorTab;