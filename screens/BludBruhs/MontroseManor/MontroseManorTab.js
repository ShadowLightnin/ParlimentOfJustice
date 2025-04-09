import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, TextInput, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const ALLOWED_EMAILS = ["samuelp.woodwell@gmail.com", "cummingsnialla@gmail.com", "will@test.com", "c1wcummings@gmail.com", "aileen@test.com"];
const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");
const HARDCODED_BOOKS = [{ id: "hardcoded-1", title: "Hardcode test", hardcoded: true }, { id: "hardcoded-2", title: "Hardcode test 2", hardcoded: true }];

const MontroseManorTab = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [canUpload, setCanUpload] = useState(false);

  useEffect(() => {
    const checkAuth = () => setCanUpload(auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email));
    const unsubscribe = onSnapshot(collection(db, "books"), (snap) => 
      setBooks([...HARDCODED_BOOKS, ...snap.docs.map(doc => ({ id: doc.id, ...doc.data(), hardcoded: false }))]),
      (e) => Alert.alert("Error", e.message));
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    return () => { unsubscribe(); authUnsub(); };
  }, []);

  const uploadImage = async (uri) => canUpload ? new Promise((res, rej) => {
    fetch(uri).then(r => r.blob()).then(blob => {
      const refPath = `books/${Date.now()}_${Math.random().toString(36).substring(7)}`;
      uploadBytesResumable(ref(storage, refPath), blob).on("state_changed", null, rej, () => 
        getDownloadURL(ref(storage, refPath)).then(res).catch(rej));
    }).catch(rej);
  }) : Promise.reject(new Error("Unauthorized"));

  const pickImage = async () => canUpload && ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5
  }).then(r => !r.canceled && setImage(r.assets[0].uri));

  const addBook = async () => {
    if (!title || !canUpload) return Alert.alert("Error", canUpload ? "Enter title" : "Access Denied");
    try { 
      const imageUrl = image ? await uploadImage(image) : "";
      await addDoc(collection(db, "books"), { title, imageUrl });
      setTitle(""); setImage(null); Alert.alert("Success", "Book added!");
    } catch (e) { Alert.alert("Error", e.message); }
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
              const bookRef = doc(db, "books", id);
              const bookSnap = await getDoc(bookRef);
              if (!bookSnap.exists()) {
                console.log("Book not found with ID:", id);
                Alert.alert("Error", "Book not found");
                return;
              }
              const bookData = bookSnap.data();
              const imageUrl = bookData.imageUrl;
  
              const charactersRef = collection(db, "books", id, "characters");
              const charactersSnapshot = await getDocs(charactersRef);
              const deleteCharactersPromises = charactersSnapshot.docs.map((charDoc) =>
                deleteDoc(doc(db, "books", id, "characters", charDoc.id))
              );
              await Promise.all(deleteCharactersPromises);
              console.log("All characters deleted for book ID:", id);
  
              await deleteDoc(bookRef);
              console.log("Book document deleted from Firestore with ID:", id);
  
              if (imageUrl) {
                const imageRef = ref(storage, imageUrl.split('/o/')[1].split('?')[0]);
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

  const startEditing = (book) => canUpload && (setEditingBookId(book.id), setEditTitle(book.title));
  const saveEdit = async (id) => canUpload && (await updateDoc(doc(db, "books", id), { title: editTitle }),
    setEditingBookId(null), setEditTitle(""), Alert.alert("Success", "Updated!"));

  const goHome = () => navigation.navigate('BludBruhsHome');
  const renderBook = (book) => (
    <View key={book.id} style={styles.bookCont}>
      <TouchableOpacity style={[styles.bookTab, book.hardcoded && styles.hardcoded]} onPress={() => 
        navigation.navigate("BookDetails", { bookId: book.id, bookTitle: book.title, bookImageUrl: book.imageUrl || "" })}>
        {editingBookId === book.id ? <TextInput style={styles.editInput} value={editTitle} onChangeText={setEditTitle} onSubmitEditing={() => saveEdit(book.id)} autoFocus /> 
          : <Text style={styles.bookTitle}>{book.title}</Text>}
        <Image source={book.imageUrl ? { uri: book.imageUrl } : PLACEHOLDER_IMAGE} style={styles.bookImg} resizeMode="cover" defaultSource={PLACEHOLDER_IMAGE} />
      </TouchableOpacity>
      {!book.hardcoded && <View style={styles.buttons}>
        {editingBookId === book.id ? <TouchableOpacity onPress={() => saveEdit(book.id)} style={styles.save}><Text>Save</Text></TouchableOpacity> 
          : <TouchableOpacity onPress={() => startEditing(book)} style={[styles.edit, !canUpload && styles.disabled]} disabled={!canUpload}><Text>Edit</Text></TouchableOpacity>}
        <TouchableOpacity onPress={() => deleteBook(book.id, book.hardcoded)} style={[styles.delete, !canUpload && styles.disabled]} disabled={!canUpload}><Text>Delete</Text></TouchableOpacity>
      </View>}
    </View>
  );

  const { width: W } = Dimensions.get("window");
  const isDesktop = W > 600;

  return (
    <ImageBackground source={require("../../../assets/MontroseMansion.jpg")} style={styles.bg}>
      <TouchableOpacity onPress={() => navigation.navigate("EvilMontrose")} style={styles.back}><Text>Escape</Text></TouchableOpacity>
      <TouchableOpacity onPress={goHome} style={styles.home}><Text>📖</Text></TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.overlay}>
          <Text style={styles.header}>Montrose Manor</Text><Text style={styles.warning}>(No deletion confirmation)</Text>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Book Title" value={title} onChangeText={setTitle} editable={canUpload} />
            <TouchableOpacity onPress={pickImage} style={[styles.upload, !canUpload && styles.disabled]} disabled={!canUpload}><Text>{canUpload ? (image ? "Selected" : "Upload") : "Restricted"}</Text></TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.preview} />}
            <TouchableOpacity onPress={addBook} style={[styles.add, !canUpload && styles.disabled]} disabled={!canUpload}><Text>Add Book</Text></TouchableOpacity>
            {!canUpload && <Text style={styles.denied}>Only authorized users can manage.</Text>}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>{books.map(renderBook)}</ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute" },
  scroll: { paddingBottom: 20 },
  overlay: { backgroundColor: "rgba(0,0,0,0.3)", paddingTop: 80 },
  disabled: { backgroundColor: "#ccc", opacity: 0.6 },
  denied: { color: "#ff4444", textAlign: "center", marginTop: 10, fontSize: 14 },
  header: { fontSize: 28, fontWeight: "bold", color: "#FFF", textAlign: "center", marginVertical: 20 },
  warning: { fontSize: 16, fontWeight: "bold", color: "rgba(201,11,11,1)", textAlign: "center", marginBottom: 20 },
  back: { position: "absolute", top: 40, left: 20, backgroundColor: "rgba(118,11,11,0.6)", padding: 10, borderRadius: 8, zIndex: 10 },
  home: { position: "absolute", top: 40, right: 20, backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 8, zIndex: 10 },
  form: { padding: 20, alignItems: "center" },
  input: { backgroundColor: "#FFF", width: "80%", padding: 10, borderRadius: 5, marginBottom: 10 },
  upload: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, marginBottom: 10 },
  preview: { width: 100, height: 100, borderRadius: 5, marginBottom: 10, resizeMode: "cover" },
  add: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5 },
  hScroll: { paddingHorizontal: 20, paddingVertical: 10 },
  bookCont: { marginHorizontal: 10, alignItems: "center" },
  bookTab: { width: Dimensions.get("window").width > 600 ? 300 : 200, height: Dimensions.get("window").width > 600 ? 450 : 300, 
    backgroundColor: "rgba(65,62,62,0.9)", borderRadius: 15, padding: 10, alignItems: "center", overflow: "hidden", elevation: 5 },

  hardcoded: { borderColor: "#FFD700", borderWidth: 2 },
  bookTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#FFF" },
  editInput: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#FFF", backgroundColor: "rgba(255,255,255,0.2)", 
    borderRadius: 5, padding: 5, width: "100%" },

  bookImg: { width: "100%", height: Dimensions.get("window").width > 600 ? 400 : 250, borderRadius: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: Dimensions.get("window").width > 600 ? 300 : 200, marginTop: 10 },
  edit: { backgroundColor: "#FFC107", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  save: { backgroundColor: "#4CAF50", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  delete: { backgroundColor: "#F44336", padding: 5, borderRadius: 5, flex: 1, marginLeft: 5 },
});

export default MontroseManorTab;