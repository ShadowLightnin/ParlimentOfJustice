import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView, TextInput, Image, Alert, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const ALLOWED_EMAILS = ["samuelp.woodwell@gmail.com", "cummingsnialla@gmail.com", "will@test.com", "c1wcummings@gmail.com", "aileen@test.com"];
const RESTRICT_ACCESS = false;
const RESTRICT_IMAGE_UPLOAD = true;
const PLACEHOLDER_IMAGE = require("../../../assets/Armor/PlaceHolder.jpg");
const PLACEHOLDER_URL = "placeholder";

const HARDCODED_CHARACTERS = {
  "hardcoded-1": [
    { id: "Lumiel", name: "Lumiel", description: "", image: require("../../../assets/Armor/LumielPhantom.jpg"), screen: "LumielScreen", hardcoded: true },
    { id: "Clayvoria", name: "Clayvoria", description: "A ghostly fortune teller", image: require("../../../assets/Montrose/Clayvoria.jpg"), hardcoded: true },
    { id: "Shivers", name: "Shivers", 
      description: "The butler that roams the halls. You might see him peaking around corners, and if we sees you he'll go on all fours and start running at you like a wild dog.", 
      image: require("../../../assets/Montrose/Shivers.jpg"), hardcoded: true },
  ],
  "hardcoded-2": [],
};

const BookDetails = () => {
  const { bookId, bookTitle, bookImageUrl } = useRoute().params;
  const navigation = useNavigation();
  const [chars, setChars] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [editingChar, setEditingChar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [canUploadImage, setCanUploadImage] = useState(!RESTRICT_IMAGE_UPLOAD);
  const [deleteModal, setDeleteModal] = useState({ visible: false, char: null });
  const [selChar, setSelChar] = useState(null);

  const alert = (title, msg) => Alert.alert(title, msg);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      console.log("Auth check, user:", user ? user.email : "none", "RESTRICT_ACCESS:", RESTRICT_ACCESS, "RESTRICT_IMAGE_UPLOAD:", RESTRICT_IMAGE_UPLOAD);
      setCanSubmit(RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true);
      setCanUploadImage(!RESTRICT_IMAGE_UPLOAD || (user && ALLOWED_EMAILS.includes(user.email)));
    };
    const unsub = onSnapshot(
      collection(db, "books", bookId, "characters"),
      (snap) => {
        console.log("Characters snapshot for book", bookId, ":", snap.docs.map(d => ({ id: d.id, ...d.data() })));
        const hardcoded = HARDCODED_CHARACTERS[bookId] || [];
        setChars([...hardcoded, ...snap.docs.map(d => ({ id: d.id, ...d.data(), hardcoded: false }))]);
      },
      (e) => {
        console.error("Snapshot error:", e.message);
        alert("Error", "Failed to fetch characters: " + e.message);
      }
    );
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    return () => {
      unsub();
      authUnsub();
    };
  }, [bookId]);

  useEffect(() => {
    if (editingChar) {
      setName(editingChar.name || "");
      setDescription(editingChar.description || "");
      setImageUri(editingChar.imageUrl || null);
      console.log("Editing character loaded:", {
        id: editingChar.id,
        name: editingChar.name,
        imageUrl: editingChar.imageUrl,
        description: editingChar.description,
      });
    } else {
      setName("");
      setDescription("");
      setImageUri(null);
      console.log("Form reset for new character");
    }
  }, [editingChar]);

  const pickImage = async () => {
    if (!canUploadImage) {
      console.log("Pick image blocked: user not authorized");
      alert("Access Denied", "Only authorized users can upload images.");
      return;
    }
    try {
      console.log("Opening image picker");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Image picker permission status:", status);
      if (status !== "granted") {
        alert("Permission Denied", "Sorry, we need camera roll permissions to make this work!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
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
      alert("Error", `Failed to pick image: ${e.message}`);
    }
  };

  const skipImage = () => {
    console.log("Skipping image for character");
    setImageUri(null);
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No image URI provided, returning placeholder");
      return PLACEHOLDER_URL;
    }
    try {
      console.log("Starting image upload for URI:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imagePath = `characters/${timestamp}_${random}.jpg`;
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
    if (!imageUrl || imageUrl === PLACEHOLDER_URL) return;
    try {
      const path = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0]);
      await deleteObject(storageRef(storage, path));
      console.log("Old image deleted:", path);
    } catch (e) {
      if (e.code !== "storage/object-not-found") {
        console.error("Delete old image error:", e.message);
        alert("Warning", `Failed to delete old image: ${e.message}. Continuing with operation.`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      console.log("Submit blocked: user not authorized");
      alert("Access Denied", "Only authorized users can submit characters.");
      return;
    }
    if (!name.trim()) {
      console.log("Submit blocked: no name provided");
      alert("Error", "Please provide a character name.");
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingChar ? editingChar.imageUrl || PLACEHOLDER_URL : PLACEHOLDER_URL;
      let oldImageUrl = editingChar ? editingChar.imageUrl : null;
      if (imageUri && imageUri !== oldImageUrl) {
        imageUrl = await uploadImage(imageUri);
        if (oldImageUrl && oldImageUrl !== PLACEHOLDER_URL) {
          await deleteOldImage(oldImageUrl);
        }
      }
      const charData = {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: "#FFFFFF",
        hardcoded: false,
      };
      console.log("Submitting character data:", charData);
      if (editingChar) {
        const charRef = doc(db, "books", bookId, "characters", editingChar.id);
        console.log("Updating Firestore document:", charRef.path);
        await setDoc(charRef, charData, { merge: true });
        console.log("Character updated:", editingChar.id);
        setChars(chars.map(item => (item.id === editingChar.id ? { id: item.id, ...charData } : item)));
        alert("Success", "Character updated successfully!");
      } else {
        console.log("Adding new Firestore document");
        const charRef = await addDoc(collection(db, "books", bookId, "characters"), charData);
        console.log("Character added:", charRef.id);
        setChars([...(HARDCODED_CHARACTERS[bookId] || []), ...chars.filter(item => !item.hardcoded), { id: charRef.id, ...charData }]);
        alert("Success", "Character added successfully!");
      }
      setName("");
      setDescription("");
      setImageUri(null);
      setEditingChar(null);
    } catch (e) {
      console.error("Submit error:", e.message);
      alert("Error", `Failed to ${editingChar ? "update" : "add"} character: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setImageUri(null);
    setEditingChar(null);
    console.log("Form cancelled");
  };

  const confirmDeleteChar = async (id) => {
    if (!canSubmit) {
      console.log("Delete blocked: user not authorized");
      alert("Access Denied", "Only authorized users can delete characters!");
      return;
    }
    console.log("Deleting character, ID:", id);
    try {
      const char = chars.find(c => c.id === id);
      if (char.hardcoded) {
        console.log("Delete blocked: character is hardcoded");
        alert("Error", "Cannot delete hardcoded characters!");
        return;
      }
      const charRef = doc(db, "books", bookId, "characters", id);
      const snap = await getDoc(charRef);
      if (!snap.exists()) {
        console.log("Character not found:", id);
        alert("Error", "Character not found");
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== PLACEHOLDER_URL) {
        await deleteOldImage(imageUrl);
      } else {
        console.log("No image to delete or imageUrl is placeholder:", imageUrl);
      }
      await deleteDoc(charRef);
      console.log("Character deleted from Firestore:", id);
      setChars(chars.filter(c => c.id !== id));
      setSelChar(null);
      setDeleteModal({ visible: false, char: null });
      alert("Success", "Character deleted!");
    } catch (e) {
      console.error("Delete character error:", e.message);
      alert("Error", `Failed to delete character: ${e.message}`);
    }
  };

  const handleCharPress = (char) => {
    console.log("Character pressed:", char.id, char.name);
    if (char.hardcoded && char.screen) {
      console.log("Navigating to screen:", char.screen);
      navigation.navigate(char.screen);
    } else {
      setSelChar(char);
    }
  };

  const startEditing = (char) => {
    if (char.hardcoded || !canSubmit) {
      console.log("Edit blocked: character is hardcoded or user not authorized");
      return;
    }
    console.log("Starting edit for character:", char.id);
    setEditingChar({ id: char.id, name: char.name, description: char.description, imageUrl: char.imageUrl });
    setSelChar(null);
  };

  const renderChar = (char) => {
    const imageSource = char.imageUrl && char.imageUrl !== PLACEHOLDER_URL ? { uri: char.imageUrl } : char.image || PLACEHOLDER_IMAGE;
    console.log("Rendering character:", { id: char.id, name: char.name, imageSource: JSON.stringify(imageSource) });
    return (
      <View key={char.id} style={styles.charCont}>
        <TouchableOpacity style={[styles.charCard, { borderColor: char.borderColor || "red" }]} onPress={() => handleCharPress(char)}>
          {char.imageUrl === null ? (
            <View style={styles.noImg} />
          ) : (
            <Image
              source={imageSource}
              style={styles.charImg}
              defaultSource={PLACEHOLDER_IMAGE}
              resizeMode="cover"
              onError={(e) => console.error("Image load error for character:", char.id, "Error:", e.nativeEvent.error, "Source:", JSON.stringify(imageSource))}
            />
          )}
          <View style={styles.overlay} />
          <Text style={styles.charName}>{char.name}</Text>
        </TouchableOpacity>
        {!char.hardcoded && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => startEditing(char)}
              style={[styles.edit, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteModal({ visible: true, char: { id: char.id, name: char.name } })}
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
    <ImageBackground
      source={typeof bookImageUrl === "string" ? { uri: bookImageUrl } : bookImageUrl || PLACEHOLDER_IMAGE}
      style={styles.bg}
    >
      <View style={[styles.overlay, !bookImageUrl && styles.darkerOverlay]}>
        <TouchableOpacity
          onPress={() => {
            console.log("Navigating back");
            navigation.goBack();
          }}
          style={styles.back}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{bookTitle} - Characters</Text>
          <View style={styles.form}>
            <Text style={styles.formHeader}>{editingChar ? "Edit Character" : "Add New Character"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Character Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
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
            <View style={styles.imgOpts}>
              <TouchableOpacity
                style={[styles.imagePicker, !canUploadImage && styles.disabled]}
                onPress={pickImage}
                disabled={!canUploadImage}
              >
                <Text style={styles.imagePickerText}>{imageUri ? "Change Image" : "Pick an Image"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.noImgBtn]}
                onPress={skipImage}
              >
                <Text style={styles.buttonText}>No Image</Text>
              </TouchableOpacity>
            </View>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="contain"
                onError={(e) => console.error("Preview image load error:", e.nativeEvent.error, "URI:", imageUri)}
              />
            ) : editingChar && editingChar.imageUrl && editingChar.imageUrl !== PLACEHOLDER_URL ? (
              <Image
                source={{ uri: editingChar.imageUrl }}
                style={styles.previewImage}
                resizeMode="contain"
                onError={(e) => console.error("Editing preview image load error:", e.nativeEvent.error, "URI:", editingChar.imageUrl)}
              />
            ) : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, !canSubmit && styles.disabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || uploading}
              >
                <Text style={styles.buttonText}>{uploading ? "Submitting..." : editingChar ? "Update" : "Submit"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {(!canSubmit || !canUploadImage) && (
              <Text style={styles.denied}>Only authorized users can upload images or edit characters.</Text>
            )}
          </View>
          <ScrollView horizontal contentContainerStyle={styles.hScroll} showsHorizontalScrollIndicator={false}>
            {chars.map(renderChar)}
          </ScrollView>
        </ScrollView>
        <Modal
          visible={!!selChar}
          transparent
          animationType="slide"
          onRequestClose={() => {
            console.log("Closing character preview modal");
            setSelChar(null);
          }}
        >
          <View style={styles.modal}>
            <ScrollView style={styles.preview}>
              {selChar && (
                <>
                  <Image
                    source={selChar.imageUrl && selChar.imageUrl !== PLACEHOLDER_URL ? { uri: selChar.imageUrl } : selChar.image || PLACEHOLDER_IMAGE}
                    style={styles.previewCharImage}
                    resizeMode="contain"
                    defaultSource={PLACEHOLDER_IMAGE}
                    onError={(e) => console.error("Preview modal image load error:", e.nativeEvent.error, "Source:", selChar.imageUrl || JSON.stringify(selChar.image))}
                  />
                  <Text style={styles.previewName}>{selChar.name}</Text>
                  <Text style={styles.previewDesc}>{selChar.description}</Text>
                </>
              )}
              <TouchableOpacity
                onPress={() => {
                  console.log("Closing character preview modal");
                  setSelChar(null);
                }}
                style={styles.close}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
        <Modal visible={deleteModal.visible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.char?.name || ''}" and its image?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => {
                    console.log("Delete canceled");
                    setDeleteModal({ visible: false, char: null });
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => deleteModal.char && confirmDeleteChar(deleteModal.char.id)}
                >
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
  form: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width: Math.min(Dimensions.get("window").width * 0.9, 600),
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
  imgOpts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  noImgBtn: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
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
  hScroll: { paddingHorizontal: 20, paddingVertical: 10 },
  charCont: { marginHorizontal: 10, alignItems: "center" },
  charCard: { width: Math.min(350, Dimensions.get("window").width - 50), height: 450, borderRadius: 15, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.7)", borderWidth: 2 },
  charImg: { width: "100%", height: "100%", resizeMode: "cover" },
  noImg: { width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.9)" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "transparent", zIndex: 1 },
  charName: { position: "absolute", bottom: 10, left: 10, fontSize: 16, color: "white", fontWeight: "bold" },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: Math.min(350, Dimensions.get("window").width - 50), marginTop: 10 },
  edit: { backgroundColor: "#FFC107", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  delete: { backgroundColor: "#F44336", padding: 5, borderRadius: 5, flex: 1, marginLeft: 5 },
  modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  preview: { 
    width: "90%", 
    maxHeight: Dimensions.get("window").height * 0.8, 
    backgroundColor: "rgba(72,63,63,0.95)", 
    borderRadius: 15, 
    padding: 20 
  },
  previewCharImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: "contain",
  },
  previewName: { fontSize: 22, fontWeight: "bold", color: "white", textAlign: "center", marginBottom: 10 },
  previewDesc: { fontSize: 16, color: "#fff7f7", textAlign: "center", marginBottom: 20 },
  close: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5, alignSelf: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "rgba(255,255,255,0.9)", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, color: "#000", marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  modalCancel: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  modalCancelText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  modalDelete: { backgroundColor: "#F44336", padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  modalDeleteText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
});

export default BookDetails;