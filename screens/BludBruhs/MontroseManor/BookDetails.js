import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, TextInput, Image, Alert, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const ALLOWED_EMAILS = ["samuelp.woodwell@gmail.com", "cummingsnialla@gmail.com", "will@test.com", "c1wcummings@gmail.com", "aileen@test.com"];
const RESTRICT_ACCESS = false;
const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");
const PLACEHOLDER_URL = "placeholder";

const HARDCODED_CHARACTERS = {
  "hardcoded-1": [
    { id: "Lumiel", name: "Lumiel", description: "", image: require("../../../assets/Armor/LumielPhantom.jpg"), screen: "LumielScreen", hardcoded: true },
    { id: "Clayvoria", name: "Clayvoria", description: "", image: require("../../../assets/Montrose/Clayvoria.jpg"), hardcoded: true },
    { id: "Shivers", name: "Shivers", description: "", image: require("../../../assets/Montrose/Shivers.jpg"), hardcoded: true },
  ],
  "hardcoded-2": [],
};

const BookDetails = () => {
  const { bookId, bookTitle, bookImageUrl } = useRoute().params;
  const navigation = useNavigation();
  const [chars, setChars] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [useImg, setUseImg] = useState(null);
  const [editingCharId, setEditingCharId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [selChar, setSelChar] = useState(null);
  const [canMod, setCanMod] = useState(!RESTRICT_ACCESS);
  const [deleteModal, setDeleteModal] = useState({ visible: false, char: null });

  const alert = (title, msg) => Alert.alert(title, msg);

  useEffect(() => {
    const checkAuth = () => setCanMod(!RESTRICT_ACCESS || (auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email)));
    const unsub = onSnapshot(collection(db, "books", bookId, "characters"), snap => {
      const hardcoded = HARDCODED_CHARACTERS[bookId] || [];
      setChars([...hardcoded, ...snap.docs.map(d => ({ id: d.id, ...d.data(), hardcoded: false }))]);
    }, () => alert("Error", "Failed to fetch characters"));
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    return () => { unsub(); authUnsub(); };
  }, [bookId]);

  const uploadImg = async uri => {
    if (!canMod) throw new Error("Unauthorized");
    const blob = await (await fetch(uri)).blob();
    const path = `characters/${Date.now()}_${Math.random().toString(36).slice(7)}`;
    return getDownloadURL((await uploadBytesResumable(ref(storage, path), blob)).ref);
  };

  const pickImg = async () => {
    if (!canMod) return;
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5
    });
    if (!r.canceled) { setImage(r.assets[0].uri); setUseImg(true); }
  };

  const addChar = async (useImage = true) => {
    if (!title || !desc || !canMod) return alert("Error", !title || !desc ? "Enter name and description" : "Access Denied");
    try {
      const imgUrl = useImage && image ? await uploadImg(image) : useImage ? PLACEHOLDER_URL : "";
      await addDoc(collection(db, "books", bookId, "characters"), { name: title, description: desc, imageUrl: imgUrl });
      setTitle(""); setDesc(""); setImage(null); setUseImg(null);
      alert("Success", "Character added!");
    } catch (e) { alert("Error", e.message); }
  };

  const confirmDeleteChar = async id => {
    try {
      const char = chars.find(c => c.id === id);
      if (char.hardcoded) return alert("Error", "Cannot delete hardcoded characters!");
      const charRef = doc(db, "books", bookId, "characters", id);
      const snap = await getDoc(charRef);
      if (!snap.exists()) return alert("Error", "Character not found");
      const { imageUrl } = snap.data();
      await deleteDoc(charRef);
      if (imageUrl && imageUrl !== PLACEHOLDER_URL) {
        const path = imageUrl.split('/o/')[1]?.split('?')[0];
        path && await deleteObject(ref(storage, path)).catch(e => { if (e.code !== "storage/object-not-found") throw e; });
      }
      setSelChar(null); setDeleteModal({ visible: false, char: null });
      alert("Success", "Character deleted!");
    } catch (e) { alert("Error", "Failed to delete: " + e.message); }
  };

  const startEdit = char => {
    if (char.hardcoded || !canMod) return;
    setEditingCharId(char.id); setEditTitle(char.name); setEditDesc(char.description); setSelChar(char);
  };

  const saveEdit = async id => {
    if (!canMod || !editTitle || !editDesc) return alert("Error", !canMod ? "Access Denied" : "Enter name and description");
    try {
      await updateDoc(doc(db, "books", bookId, "characters", id), { name: editTitle, description: editDesc });
      setEditingCharId(null); setEditTitle(""); setEditDesc(""); setSelChar(null);
      alert("Success", "Character updated!");
    } catch (e) { alert("Error", "Failed to update: " + e.message); }
  };

  const handleCharPress = char => char.hardcoded && char.screen ? navigation.navigate(char.screen) : setSelChar(char);

  const renderChar = char => (
    <View key={char.id} style={styles.charCont}>
      <TouchableOpacity style={styles.charCard} onPress={() => handleCharPress(char)}>
        {char.imageUrl === null ? <View style={styles.noImg} /> : (
          <Image source={char.imageUrl && char.imageUrl !== PLACEHOLDER_URL ? { uri: char.imageUrl } : char.image || PLACEHOLDER_IMAGE}
            style={styles.charImg} defaultSource={PLACEHOLDER_IMAGE} />
        )}
        <View style={styles.overlay} />
        <Text style={styles.charName}>{char.name}</Text>
      </TouchableOpacity>
      {!char.hardcoded && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => startEdit(char)} style={[styles.edit, !canMod && styles.disabled]} disabled={!canMod}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => canMod && !char.hardcoded && setDeleteModal({ visible: true, char: { id: char.id, name: char.name } })}
            style={[styles.delete, !canMod && styles.disabled]} disabled={!canMod}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground source={typeof bookImageUrl === "string" ? { uri: bookImageUrl } : bookImageUrl || PLACEHOLDER_IMAGE} style={styles.bg}>
      <View style={[styles.overlay, !bookImageUrl && styles.darkerOverlay]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text>Back</Text></TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{bookTitle} - Characters</Text>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Name" value={title} onChangeText={setTitle} editable={canMod} />
            <TextInput style={[styles.input, styles.descInput]} placeholder="Description" value={desc} onChangeText={setDesc} multiline editable={canMod} />
            <View style={styles.imgOpts}>
              <TouchableOpacity onPress={pickImg} style={[styles.upload, !canMod && styles.disabled]} disabled={!canMod}>
                <Text>{canMod ? (image ? "Selected" : "Upload") : "Restricted"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addChar(false)} style={[styles.noImgBtn, !canMod && styles.disabled]} disabled={!canMod}>
                <Text>No Image</Text>
              </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={styles.preview} />}
            <TouchableOpacity onPress={() => addChar()} style={[styles.add, !canMod && styles.disabled]} disabled={!canMod}>
              <Text>Add</Text>
            </TouchableOpacity>
            {!canMod && <Text style={styles.denied}>Only authorized users can modify.</Text>}
          </View>
          <ScrollView horizontal contentContainerStyle={styles.hScroll} showsHorizontalScrollIndicator={false}>
            {chars.map(renderChar)}
          </ScrollView>
        </ScrollView>
        <Modal visible={!!selChar} transparent animationType="slide" onRequestClose={() => { setSelChar(null); setEditingCharId(null); }}>
          <View style={styles.modal}>
            <ScrollView style={styles.preview}>
              {selChar && (editingCharId === selChar.id ? (
                <>
                  <TextInput style={styles.editName} value={editTitle} onChangeText={setEditTitle} autoFocus editable={canMod && !selChar.hardcoded} />
                  <TextInput style={styles.editDesc} value={editDesc} onChangeText={setEditDesc} multiline editable={canMod && !selChar.hardcoded} />
                  <TouchableOpacity onPress={() => saveEdit(selChar.id)} style={[styles.save, !canMod && styles.disabled]} disabled={!canMod || selChar.hardcoded}>
                    <Text>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.previewName}>{selChar.name}</Text>
                  <Text style={styles.previewDesc}>{selChar.description}</Text>
                </>
              ))}
              <TouchableOpacity onPress={() => { setSelChar(null); setEditingCharId(null); }} style={styles.close}>
                <Text>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
        <Modal visible={deleteModal.visible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.char?.name || ''}" and its image?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setDeleteModal({ visible: false, char: null })}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalDelete} onPress={() => deleteModal.char && confirmDeleteChar(deleteModal.char.id)}>
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute", resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", paddingTop: 50 },
  darkerOverlay: { backgroundColor: "rgba(0,0,0,0.7)" },
  disabled: { backgroundColor: "#ccc", opacity: 0.6 },
  denied: { color: "#ff4444", textAlign: "center", marginTop: 10, fontSize: 14 },
  back: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(118,11,11,0.8)", padding: 8, borderRadius: 8, zIndex: 10 },
  scroll: { paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", textAlign: "center", marginBottom: 10 },
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
  charCard: { width: Math.min(350, Dimensions.get("window").width - 50), height: 450, borderRadius: 15, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.7)", borderColor: "red", borderWidth: 2 },
  charImg: { width: "100%", height: "100%", resizeMode: "cover" },
  noImg: { width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.9)" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "transparent", zIndex: 1 },
  charName: { position: "absolute", bottom: 10, left: 10, fontSize: 16, color: "white", fontWeight: "bold" },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: Math.min(350, Dimensions.get("window").width - 50), marginTop: 10 },
  edit: { backgroundColor: "#FFC107", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  delete: { backgroundColor: "#F44336", padding: 5, borderRadius: 5, flex: 1, marginLeft: 5 },
  modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  preview: { width: "90%", maxHeight: Dimensions.get("window").height * 0.7, backgroundColor: "rgba(72,63,63,0.95)", borderRadius: 15, padding: 20 },
  previewName: { fontSize: 22, fontWeight: "bold", color: "white", textAlign: "center", marginBottom: 10 },
  previewDesc: { fontSize: 16, color: "#fff7f7", textAlign: "center", marginBottom: 20 },
  editName: { fontSize: 22, fontWeight: "bold", color: "#ffffff", textAlign: "center", backgroundColor: "rgba(92,86,86,0.95)", padding: 10, borderRadius: 5, marginBottom: 10 },
  editDesc: { fontSize: 16, color: "#ffffff", textAlign: "center", backgroundColor: "rgba(100,95,95,0.95)", padding: 10, borderRadius: 5, marginBottom: 20, minHeight: 100, textAlignVertical: "top" },
  save: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, alignSelf: "center", marginBottom: 10 },
  close: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5, alignSelf: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "rgba(255,255,255,0.9)", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, color: "#000", marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  modalCancel: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  modalCancelText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  modalDelete: { backgroundColor: "#F44336", padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  modalDeleteText: { color: "#FFF", fontWeight: "bold", textAlign: "center" }
});

export default BookDetails;