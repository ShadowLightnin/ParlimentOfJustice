import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, TextInput, Image, Alert, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const ALLOWED_EMAILS = ["samuelp.woodwell@gmail.com", "cummingsnialla@gmail.com", "will@test.com", "c1wcummings@gmail.com", "aileen@test.com"];
const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");
const PLACEHOLDER_URL = "placeholder";

const BookDetails = () => {
  const navigation = useNavigation();
  const { bookId, bookTitle, bookImageUrl } = useRoute().params;
  const [chars, setChars] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [useImg, setUseImg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [selChar, setSelChar] = useState(null);
  const [canMod, setCanMod] = useState(false);

  useEffect(() => {
    const checkAuth = () => setCanMod(auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email));
    const fetchChars = async () => getDocs(collection(db, "books", bookId, "characters")).then(snap => 
      setChars(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))), e => Alert.alert("Error", e.message));
    checkAuth(); fetchChars(); const authUnsub = auth.onAuthStateChanged(checkAuth); return () => authUnsub();
  }, [bookId]);

  const uploadImg = async (uri) => canMod ? new Promise((res, rej) => {
    fetch(uri).then(r => r.blob()).then(blob => {
      const refPath = `characters/${Date.now()}_${Math.random().toString(36).substring(7)}`;
      uploadBytesResumable(ref(storage, refPath), blob).on("state_changed", null, rej, () => 
        getDownloadURL(ref(storage, refPath)).then(res).catch(rej));
    }).catch(rej);
  }) : Promise.reject(new Error("Unauthorized"));

  const pickImg = async () => canMod && ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5
  }).then(r => !r.canceled && (setImg(r.assets[0].uri), setUseImg(true)));

  const skipImg = () => canMod && (setImg(null), setUseImg(false));

  const addChar = async () => {
    if (!name || !desc || !canMod) return Alert.alert("Error", canMod ? "Enter name and description" : "Access Denied");
    try { 
      const imgUrl = useImg === true && img ? await uploadImg(img) : useImg === false ? null : PLACEHOLDER_URL;
      await addDoc(collection(db, "books", bookId, "characters"), { name, description: desc, imageUrl: imgUrl });
      setChars([...chars, { name, description: desc, imageUrl: imgUrl }]); setName(""); setDesc(""); setImg(null); setUseImg(null); Alert.alert("Success", "Character added!");
    } catch (e) { Alert.alert("Error", e.message); }
  };

  const deleteCharacter = async (id) => {
    console.log("DeleteCharacter called - ID:", id, "CanModify:", canMod); // Updated to use canMod
    if (!canMod) {
      Alert.alert("Access Denied", "You are not authorized to delete characters.");
      return;
    }
  
    console.log("Proceeding with deletion for ID:", id);
    try {
      const charRef = doc(db, "books", bookId, "characters", id);
      await deleteDoc(charRef);
      console.log("Character document deleted from Firestore with ID:", id);
      setChars(chars.filter((char) => char.id !== id)); // Updated to use chars
      setSelChar(null); // Updated to use setSelChar
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
  
              const charSnap = await getDoc(charRef);
              if (!charSnap.exists()) {
                console.log("Character not found with ID:", id);
                Alert.alert("Error", "Character not found");
                return;
              }
              const charData = charSnap.data();
              const imageUrl = charData.imageUrl;
  
              await deleteDoc(charRef);
              console.log("Character document deleted from Firestore with ID:", id);
  
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
  
              setChars(chars.filter((char) => char.id !== id)); // Updated to use chars
              setSelChar(null); // Updated to use setSelChar
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

  const startEdit = (char) => canMod && (setEditId(char.id), setEditName(char.name), setEditDesc(char.description), setSelChar(char));
  const saveEdit = async (id) => canMod && (editName && editDesc) && (await updateDoc(doc(db, "books", bookId, "characters", id), { name: editName, description: editDesc }),
    setChars(chars.map(c => c.id === id ? { ...c, name: editName, description: editDesc } : c)), setEditId(null), setEditName(""), setEditDesc(""), setSelChar(null), Alert.alert("Success", "Updated!"));

  const renderChar = (char) => (
    <View key={char.id} style={styles.charCont}>
      <TouchableOpacity style={styles.charCard} onPress={() => setSelChar(char)} disabled={!canMod}>
        {char.imageUrl === null ? <View style={styles.noImg} /> : <Image source={char.imageUrl && char.imageUrl !== PLACEHOLDER_URL ? { uri: char.imageUrl } : PLACEHOLDER_IMAGE} style={styles.charImg} defaultSource={PLACEHOLDER_IMAGE} />}
        <View style={styles.overlay} /><Text style={styles.charName}>{char.name}</Text>
      </TouchableOpacity>
      <View style={styles.buttons}><TouchableOpacity onPress={() => startEdit(char)} style={[styles.edit, !canMod && styles.disabled]} disabled={!canMod}><Text>Edit</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => deleteCharacter(char.id)} style={[styles.delete, !canMod && styles.disabled]} disabled={!canMod}><Text>Delete</Text></TouchableOpacity></View>
    </View>
  );

  return (
    <ImageBackground source={bookImageUrl ? { uri: bookImageUrl } : PLACEHOLDER_IMAGE} style={styles.bg}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text>Back</Text></TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{bookTitle} - Characters</Text><Text style={styles.warning}>(No deletion confirmation)</Text>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} editable={canMod} />
            <TextInput style={[styles.input, styles.descInput]} placeholder="Description" value={desc} onChangeText={setDesc} multiline editable={canMod} />
            <View style={styles.imgOpts}><TouchableOpacity onPress={pickImg} style={[styles.upload, !canMod && styles.disabled]} disabled={!canMod}><Text>{canMod ? (img ? "Selected" : "Upload") : "Restricted"}</Text></TouchableOpacity>
            <TouchableOpacity onPress={skipImg} style={[styles.noImgBtn, !canMod && styles.disabled]} disabled={!canMod}><Text>No Image</Text></TouchableOpacity></View>
            {img && <Image source={{ uri: img }} style={styles.preview} />}
            <TouchableOpacity onPress={addChar} style={[styles.add, !canMod && styles.disabled]} disabled={!canMod}><Text>Add</Text></TouchableOpacity>
            {!canMod && <Text style={styles.denied}>Only authorized users can modify.</Text>}
          </View>
          <ScrollView horizontal contentContainerStyle={styles.hScroll} showsHorizontalScrollIndicator={false}>{chars.map(renderChar)}</ScrollView>
        </ScrollView>
        <Modal visible={!!selChar} transparent animationType="slide" onRequestClose={() => (setSelChar(null), setEditId(null))}>
          <View style={styles.modal}><ScrollView style={styles.preview}>
            {selChar && (editId === selChar.id ? <>
              <TextInput style={styles.editName} value={editName} onChangeText={setEditName} autoFocus editable={canMod} />
              <TextInput style={styles.editDesc} value={editDesc} onChangeText={setEditDesc} multiline editable={canMod} />
              <TouchableOpacity onPress={() => saveEdit(selChar.id)} style={[styles.save, !canMod && styles.disabled]} disabled={!canMod}><Text>Save</Text></TouchableOpacity>
            </> : <>
              <Text style={styles.previewName}>{selChar.name}</Text><Text style={styles.previewDesc}>{selChar.description}</Text>
            </>)}
            <TouchableOpacity onPress={() => (setSelChar(null), setEditId(null))} style={styles.close}><Text>Close</Text></TouchableOpacity>
          </ScrollView></View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute", resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", paddingTop: 50 },
  disabled: { backgroundColor: "#ccc", opacity: 0.6 },
  denied: { color: "#ff4444", textAlign: "center", marginTop: 10, fontSize: 14 },
  back: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(118,11,11,0.8)", padding: 8, borderRadius: 8, zIndex: 10 },
  scroll: { paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", textAlign: "center", marginBottom: 10 },
  warning: { fontSize: 16, fontWeight: "bold", color: "rgba(201,11,11,1)", textAlign: "center", marginBottom: 20 },
  form: { padding: 20, alignItems: "center" },
  input: { backgroundColor: "rgba(255,255,255,0.9)", width: "90%", padding: 10, borderRadius: 5, marginBottom: 10 },
  descInput: { height: 80, textAlignVertical: "top" },
  imgOpts: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginBottom: 10 },
  upload: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  noImgBtn: { backgroundColor: "#F44336", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
  preview: { width: 100, height: 100, borderRadius: 5, marginBottom: 10, resizeMode: "cover" },
  add: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5 },
  hScroll: { paddingHorizontal: 20, paddingVertical: 10 },
  charCont: { marginHorizontal: 10, alignItems: "center" },
  charCard: { width: 350, height: 450, borderRadius: 15, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.7)", borderColor: "red", borderWidth: 2 },
  charImg: { width: "100%", height: "100%", resizeMode: "cover" },
  noImg: { width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.9)" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "transparent", zIndex: 1 },
  charName: { position: "absolute", bottom: 10, left: 10, fontSize: 16, color: "white", fontWeight: "bold" },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: 350, marginTop: 10 },
  edit: { backgroundColor: "#FFC107", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  delete: { backgroundColor: "#F44336", padding: 5, borderRadius: 5, flex: 1, marginLeft: 5 },
  modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  preview: { width: "90%", maxHeight: Dimensions.get("window").height * 0.7, backgroundColor: "rgba(72,63,63,0.95)", borderRadius: 15, padding: 20 },
  previewName: { fontSize: 22, fontWeight: "bold", color: "white", textAlign: "center", marginBottom: 10 },
  previewDesc: { fontSize: 16, color: "#fff7f7", textAlign: "center", marginBottom: 20 },

  editName: { fontSize: 22, fontWeight: "bold", color: "#ffffff", textAlign: "center", backgroundColor: "rgba(92,86,86,0.95)", 
    padding: 10, borderRadius: 5, marginBottom: 10 },
    
  editDesc: { fontSize: 16, color: "#ffffff", textAlign: "center", backgroundColor: "rgba(100,95,95,0.95)", padding: 10, 
    borderRadius: 5, marginBottom: 20, minHeight: 100, textAlignVertical: "top" },
    
  save: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, alignSelf: "center", marginBottom: 10 },
  close: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5, alignSelf: "center" },
});

export default BookDetails;