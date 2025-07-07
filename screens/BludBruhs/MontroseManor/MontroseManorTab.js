import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, TextInput, Image, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isDesktop = SCREEN_WIDTH > 600;
const ALLOWED_EMAILS = ["samuelp.woodwell@gmail.com", "cummingsnialla@gmail.com", "will@test.com", "c1wcummings@gmail.com", "aileen@test.com"];
const RESTRICT_ACCESS = false;
const RESTRICT_IMAGE_UPLOAD = true;
const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");
const HARDCODED_BOOKS = [
  { id: "hardcoded-1", title: "Montrose Manor", coverImage: require("../../../assets/MontroseManor.jpg"), hardcoded: true },
];

const MontroseManorTab = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [canUploadImage, setCanUploadImage] = useState(!RESTRICT_IMAGE_UPLOAD);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      console.log("Auth check, user:", user ? user.email : "none", "RESTRICT_ACCESS:", RESTRICT_ACCESS, "RESTRICT_IMAGE_UPLOAD:", RESTRICT_IMAGE_UPLOAD);
      setCanSubmit(RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true);
      setCanUploadImage(!RESTRICT_IMAGE_UPLOAD || (user && ALLOWED_EMAILS.includes(user.email)));
    };
    const unsubscribe = onSnapshot(
      collection(db, "books"),
      (snap) => {
        console.log("Books snapshot:", snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setBooks([...HARDCODED_BOOKS, ...snap.docs.map((doc) => ({ id: doc.id, ...doc.data(), hardcoded: false }))]);
      },
      (e) => {
        console.error("Snapshot error:", e.message);
        Alert.alert("Error", "Failed to load books: " + e.message);
      }
    );
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    return () => {
      unsubscribe();
      authUnsub();
    };
  }, []);

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title || "");
      setDescription(editingBook.description || "");
      setImageUri(editingBook.imageUrl || null);
      console.log("Editing book loaded:", {
        id: editingBook.id,
        title: editingBook.title,
        imageUrl: editingBook.imageUrl,
        description: editingBook.description,
      });
    } else {
      setTitle("");
      setDescription("");
      setImageUri(null);
      console.log("Form reset for new book");
    }
  }, [editingBook]);

  const pickImage = async () => {
    if (!canUploadImage) {
      Alert.alert("Access Denied", "Only authorized users can upload images.");
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Image picker permission status:", status);
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to make this work!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      console.log("Image picker result:", result);
      if (!result.canceled && result.assets) {
        setImageUri(result.assets[0].uri);
        console.log("Image picked:", result.assets[0].uri);
      } else {
        console.log("Image picker canceled or no assets");
      }
    } catch (e) {
      console.error("Image picker error:", e.message);
      Alert.alert("Error", `Failed to pick image: ${e.message}`);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No image URI provided, returning placeholder");
      return "placeholder";
    }
    try {
      console.log("Starting image upload for URI:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imagePath = `books/${timestamp}_${random}.jpg`;
      console.log("Uploading to path:", imagePath);
      const imageRef = storageRef(storage, imagePath);
      await uploadBytesResumable(imageRef, blob);
      console.log("Upload completed, fetching download URL");
      const downloadURL = await getDownloadURL(imageRef);
      console.log("Image uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (e) {
      console.error("Image upload error:", e.message);
      throw new Error(`Image upload failed: ${e.message}`);
    }
  };

  const deleteOldImage = async (imageUrl) => {
    if (!imageUrl || imageUrl === "placeholder") return;
    try {
      const path = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0]);
      await deleteObject(storageRef(storage, path));
      console.log("Old image deleted:", path);
    } catch (e) {
      if (e.code !== "storage/object-not-found") {
        console.error("Delete old image error:", e.message);
        Alert.alert("Warning", `Failed to delete old image: ${e.message}. Continuing with update.`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Access Denied", "Only authorized users can submit books.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Error", "Please provide a book title.");
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingBook ? editingBook.imageUrl || "placeholder" : "placeholder";
      let oldImageUrl = editingBook ? editingBook.imageUrl : null;
      if (imageUri && imageUri !== oldImageUrl) {
        imageUrl = await uploadImage(imageUri);
        if (oldImageUrl && oldImageUrl !== "placeholder") {
          await deleteOldImage(oldImageUrl);
        }
      }
      const bookData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: "#FFFFFF",
        hardcoded: false,
      };
      console.log("Submitting book data:", bookData);
      if (editingBook) {
        const bookRef = doc(db, "books", editingBook.id);
        console.log("Updating Firestore document:", bookRef.path);
        await setDoc(bookRef, bookData, { merge: true });
        console.log("Book updated:", editingBook.id);
        setBooks(books.map(item => (item.id === editingBook.id ? { id: item.id, ...bookData } : item)));
        Alert.alert("Success", "Book updated successfully!");
      } else {
        console.log("Adding new Firestore document");
        const bookRef = await addDoc(collection(db, "books"), bookData);
        console.log("Book added:", bookRef.id);
        setBooks([...HARDCODED_BOOKS, ...books.filter(item => !item.hardcoded), { id: bookRef.id, ...bookData }]);
        Alert.alert("Success", "Book added successfully!");
      }
      setTitle("");
      setDescription("");
      setImageUri(null);
      setEditingBook(null);
    } catch (e) {
      console.error("Submit error:", e.message);
      Alert.alert("Error", `Failed to ${editingBook ? "update" : "add"} book: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setImageUri(null);
    setEditingBook(null);
    console.log("Form cancelled");
  };

  const confirmDeleteBook = async (id) => {
    if (!canSubmit) {
      console.log("Delete blocked: user not authorized");
      Alert.alert("Access Denied", "Only authorized users can delete books!");
      return;
    }
    console.log("Deleting book, ID:", id);
    try {
      const bookRef = doc(db, "books", id);
      const bookSnap = await getDoc(bookRef);
      if (!bookSnap.exists()) {
        console.log("Book not found:", id);
        Alert.alert("Error", "Book not found");
        return;
      }
      const bookData = bookSnap.data();
      const { imageUrl } = bookData;
      if (imageUrl && imageUrl !== "placeholder") {
        let path = "";
        try {
          console.log("Raw imageUrl:", imageUrl);
          if (typeof imageUrl !== "string" || !imageUrl.includes("/o/")) {
            console.warn("Invalid imageUrl format:", imageUrl);
          } else {
            const urlParts = imageUrl.split("/o/");
            path = decodeURIComponent(urlParts[1].split("?")[0]);
            console.log("Attempting to delete image:", path);
            await deleteObject(storageRef(storage, path)).catch((e) => {
              if (e.code !== "storage/object-not-found") {
                throw e;
              }
              console.warn("Image not found in storage:", path);
            });
            console.log("Image deleted or not found:", path);
          }
        } catch (e) {
          console.error("Delete image error:", e.message, "Path:", path, "URL:", imageUrl);
          Alert.alert("Warning", `Failed to delete image: ${e.message}. Book will still be deleted.`);
        }
      } else {
        console.log("No image to delete or imageUrl is placeholder:", imageUrl);
      }

      const charactersRef = collection(db, "books", id, "characters");
      const charactersSnapshot = await getDocs(charactersRef);
      console.log("Deleting characters:", charactersSnapshot.docs.length);
      const deleteCharactersPromises = charactersSnapshot.docs.map((charDoc) =>
        deleteDoc(doc(db, "books", id, "characters", charDoc.id))
      );
      await Promise.all(deleteCharactersPromises).catch((e) => {
        console.error("Delete characters error:", e.message);
        Alert.alert("Warning", `Failed to delete some characters: ${e.message}. Book will still be deleted.`);
      });

      await deleteDoc(bookRef);
      console.log("Book deleted from Firestore:", id);
      setBooks(books.filter((book) => book.id !== id));
      setDeleteModalVisible(false);
      setBookToDelete(null);
      Alert.alert("Success", "Book, characters, and image deleted successfully!");
    } catch (error) {
      console.error("Delete book error:", error.message);
      Alert.alert("Error", `Failed to delete book: ${error.message}`);
    }
  };

  const handleDeletePress = (id, hardcoded, title) => {
    if (hardcoded) {
      console.log("Delete blocked: book is hardcoded");
      return Alert.alert("Error", "Cannot delete hardcoded books!");
    }
    console.log("Opening delete modal for book:", id, title);
    setBookToDelete({ id, hardcoded, title });
    setDeleteModalVisible(true);
  };

  const startEditing = (book) => {
    if (canSubmit) {
      console.log("Starting edit for book:", book.id);
      setEditingBook({ id: book.id, title: book.title, description: book.description, imageUrl: book.imageUrl });
    }
  };

  const renderBook = (book) => {
    const imageSource = book.imageUrl ? { uri: book.imageUrl } : book.coverImage || PLACEHOLDER_IMAGE;
    console.log("Rendering book:", { id: book.id, title: book.title, imageSource: JSON.stringify(imageSource) });
    return (
      <View key={book.id} style={styles.bookCont}>
        <TouchableOpacity
          style={[styles.bookTab, book.hardcoded && styles.hardcoded]}
          onPress={() => {
            console.log("Navigating to BookDetails, book:", book.id, book.title);
            navigation.navigate("BookDetails", {
              bookId: book.id,
              bookTitle: book.title,
              bookImageUrl: book.imageUrl || (book.coverImage ? book.coverImage : ""),
            });
          }}
        >
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Image
            source={imageSource}
            style={styles.bookImg}
            resizeMode="cover"
            defaultSource={PLACEHOLDER_IMAGE}
            onError={(e) => console.error("Image load error for book:", book.id, "Error:", e.nativeEvent.error, "Source:", JSON.stringify(imageSource))}
          />
        </TouchableOpacity>
        {!book.hardcoded && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => startEditing(book)}
              style={[styles.edit, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeletePress(book.id, book.hardcoded, book.title)}
              style={[styles.delete, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={require("../../../assets/MontroseMansion.jpg")} style={styles.bg}>
      <TouchableOpacity
        onPress={() => {
          console.log("Navigating to EvilMontrose");
          navigation.navigate("EvilMontrose");
        }}
        style={styles.back}
      >
        <Text>Escape</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log("Navigating to BludBruhsHome");
          navigation.navigate("BludBruhsHome");
        }}
        style={styles.home}
      >
        <Text>📖</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.overlay}>
          <Text style={styles.header}>Montrose Manor</Text>
          <View style={styles.form}>
            <Text style={styles.formHeader}>{editingBook ? "Edit Book" : "Add New Book"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Book Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
              editable={canSubmit}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              editable={canSubmit}
            />
            <TouchableOpacity
              style={[styles.imagePicker, !canUploadImage && styles.disabled]}
              onPress={pickImage}
              disabled={!canUploadImage}
            >
              <Text style={styles.imagePickerText}>{imageUri ? "Change Image" : "Pick an Image"}</Text>
            </TouchableOpacity>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            {!imageUri && editingBook && editingBook.imageUrl && editingBook.imageUrl !== "placeholder" && (
              <Image
                source={{ uri: editingBook.imageUrl }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, !canSubmit && styles.disabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || uploading}
              >
                <Text style={styles.buttonText}>{uploading ? "Submitting..." : editingBook ? "Update" : "Submit"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {(!canSubmit || !canUploadImage) && (
              <Text style={styles.denied}>Only authorized users can upload images or edit books.</Text>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {books.map(renderBook)}
          </ScrollView>
        </View>
      </ScrollView>
      <Modal visible={deleteModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{`Are you sure you want to delete "${bookToDelete?.title || ''}" and all its characters/images?`}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  console.log("Delete canceled");
                  setDeleteModalVisible(false);
                  setBookToDelete(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDelete}
                onPress={() => bookToDelete && confirmDeleteBook(bookToDelete.id)}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute" },
  scroll: { paddingBottom: 20 },
  overlay: { backgroundColor: "rgba(0,0,0,0.3)", paddingTop: 80 },
  header: { fontSize: 28, fontWeight: "bold", color: "#FFF", textAlign: "center", marginVertical: 20 },
  back: { position: "absolute", top: 40, left: 20, backgroundColor: "rgba(118,11,11,0.6)", padding: 10, borderRadius: 8, zIndex: 10 },
  home: { position: "absolute", top: 40, right: 20, backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 8, zIndex: 10 },
  form: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width: isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9,
    alignSelf: "center",
  },
  formHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  denied: { color: "#ff4444", textAlign: "center", marginTop: 10, fontSize: 14 },
  hScroll: { paddingHorizontal: 20, paddingVertical: 10 },
  bookCont: { marginHorizontal: 10, alignItems: "center" },
  bookTab: {
    width: Dimensions.get("window").width > 600 ? 300 : 200,
    height: Dimensions.get("window").width > 600 ? 450 : 300,
    backgroundColor: "rgba(65,62,62,0.9)",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    overflow: "hidden",
    elevation: 5,
  },
  hardcoded: { borderColor: "#FFD700", borderWidth: 2 },
  bookTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#FFF" },
  bookImg: {
    width: "100%",
    height: Dimensions.get("window").width > 600 ? 400 : 250,
    borderRadius: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width > 600 ? 300 : 200,
    marginTop: 10,
  },
  edit: { backgroundColor: "#FFC107", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  delete: { backgroundColor: "#F44336", padding: 5, borderRadius: 5, flex: 1, marginLeft: 5 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "rgba(255,255,255,0.9)", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, color: "#000", marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  modalCancel: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  modalCancelText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  modalDelete: { backgroundColor: "#F44336", padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  modalDeleteText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
});

export default MontroseManorTab;