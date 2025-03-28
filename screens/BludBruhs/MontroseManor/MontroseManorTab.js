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
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const MontroseManorTab = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const bookList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookList);
    };
    fetchBooks();
  }, []);

  const uploadImage = async (uri) => {
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
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Keep aspect ratio 1:1 for consistency
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

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImage(image);
    }

    const newBook = {
      title,
      imageUrl: imageUrl || "https://via.placeholder.com/150",
    };

    const docRef = await addDoc(collection(db, "books"), newBook);
    setBooks([...books, { id: docRef.id, ...newBook }]);
    setTitle("");
    setImage(null);
  };

  const deleteBook = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "books", id));
            setBooks(books.filter((book) => book.id !== id));
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/MontroseManorPlaceHolder.jpg")}
      style={styles.background}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("EvilMontrose")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Escape</Text>
      </TouchableOpacity>

      <View style={styles.overlay}>
        {/* Header Title */}
        <Text style={styles.headerTitle}>Montrose Manor</Text>

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
                  bookImageUrl: book.imageUrl, // Pass the image URL
                })
              }
            >
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Image source={{ uri: book.imageUrl }} style={styles.bookImage} resizeMode="cover" />
              <TouchableOpacity onPress={() => deleteBook(book.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingTop: 80, // Adjusted to accommodate header
  },
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
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
    alignItems: "center",
  },
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
  uploadButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: "cover", // Ensure preview also fits whole image
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
  scrollView: {
    flexGrow: 0,
  },
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
    color: "#FFF", // Added for better visibility on dark background
  },
  bookImage: {
    width: 130, // Increased width to fit more of the image
    height: 130, // Increased height to fit more of the image
    borderRadius: 5,
    marginBottom: 5,
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

export default MontroseManorTab;