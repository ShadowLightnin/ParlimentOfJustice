import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, Modal, Dimensions } from 'react-native';
import { db, storage, auth } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = false; // Allow anyone to add/edit/delete ships
const RESTRICT_IMAGE_UPLOAD = true; // Restrict image uploads to ALLOWED_EMAILS
const PLACEHOLDER_URL = 'placeholder';

const AddShipForm = ({ collectionPath = 'ships', placeholderImage, ships = [], setShips, hardcodedShips = [], editingShip, setEditingShip }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [useImg, setUseImg] = useState(null);
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;
  const canUploadImage = !RESTRICT_IMAGE_UPLOAD || (auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email));

  const alert = (title, msg) => Alert.alert(title, msg);

  const uploadImg = async (uri) => {
    if (!canUploadImage) {
      console.log('Image upload blocked: user not authorized');
      throw new Error('Unauthorized to upload images');
    }
    try {
      const blob = await (await fetch(uri)).blob();
      const path = `${collectionPath}/${Date.now()}_${Math.random().toString(36).slice(7)}`;
      const storageRef = ref(storage, path);
      const uploadTask = await uploadBytesResumable(storageRef, blob);
      const url = await getDownloadURL(uploadTask.ref);
      console.log('Image uploaded:', url);
      return url;
    } catch (e) {
      console.error('Upload error:', e.message);
      throw e;
    }
  };

  const pickImg = async () => {
    if (!canUploadImage) {
      alert('Access Denied', 'Only authorized users can upload images.');
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
      setUseImg(true);
      console.log('Image picked:', result.assets[0].uri);
    } else {
      console.log('Image picker canceled');
    }
  };

  const addShip = async (useImage = true) => {
    if (!canMod) {
      alert('Access Denied', 'Only authorized users can add ships.');
      return;
    }
    if (!name || !description) {
      alert('Error', 'Enter name and description');
      return;
    }
    try {
      const imgUrl = useImage && image ? await uploadImg(image) : useImage ? PLACEHOLDER_URL : '';
      const shipData = { 
        name, 
        description, 
        imageUrl: imgUrl, 
        clickable: true, 
        borderColor: 'blue', 
        hardcoded: false 
      };
      const docRef = await addDoc(collection(db, collectionPath), shipData);
      console.log('Ship added to Firestore:', { id: docRef.id, ...shipData });
      if (setShips) {
        const updatedShips = [...ships, { id: docRef.id, ...shipData }];
        setShips(updatedShips);
        console.log('Updated ships state:', updatedShips);
      }
      setName('');
      setDescription('');
      setImage(null);
      setUseImg(null);
      alert('Success', 'Ship added!');
    } catch (e) {
      console.error('Add ship error:', e.message);
      alert('Error', `Failed to add ship: ${e.message}`);
    }
  };

  const saveEdit = async () => {
    if (!canMod) {
      alert('Access Denied', 'Only authorized users can edit ships.');
      return;
    }
    if (!name || !description) {
      alert('Error', 'Enter name and description');
      return;
    }
    try {
      const imgUrl = useImg && image ? await uploadImg(image) : useImg ? PLACEHOLDER_URL : '';
      const shipData = { 
        name, 
        description, 
        imageUrl: imgUrl, 
        clickable: true, 
        borderColor: 'blue', 
        hardcoded: false 
      };
      await updateDoc(doc(db, collectionPath, editingShip.id), shipData);
      console.log('Ship updated in Firestore:', { id: editingShip.id, ...shipData });
      if (setShips) {
        const updatedShips = ships.map(s => s.id === editingShip.id ? { ...s, ...shipData } : s);
        setShips(updatedShips);
        console.log('Updated ships state:', updatedShips);
      }
      setEditingShip(null);
      setName('');
      setDescription('');
      setImage(null);
      setUseImg(null);
      alert('Success', 'Ship updated!');
    } catch (e) {
      console.error('Update ship error:', e.message);
      alert('Error', `Failed to update ship: ${e.message}`);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Ship Name"
        value={name}
        onChangeText={setName}
        editable={canMod}
      />
      <TextInput
        style={[styles.input, styles.descInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        editable={canMod}
      />
      <View style={styles.imgOpts}>
        <TouchableOpacity
          onPress={pickImg}
          style={[styles.upload, !canUploadImage && styles.disabled]}
          disabled={!canUploadImage}
        >
          <Text style={styles.buttonText}>{canUploadImage ? (image ? 'Image Selected' : 'Upload Image') : 'Restricted'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => editingShip ? (setImage(null), setUseImg(false)) : addShip(false)}
          style={[styles.noImgBtn, !canMod && styles.disabled]}
          disabled={!canMod}
        >
          <Text style={styles.buttonText}>{editingShip ? 'Remove Image' : 'No Image'}</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <TouchableOpacity
        onPress={editingShip ? saveEdit : addShip}
        style={[styles.add, !canMod && styles.disabled]}
        disabled={!canMod}
      >
        <Text style={styles.buttonText}>{editingShip ? 'Save' : 'Add Ship'}</Text>
      </TouchableOpacity>
      {editingShip && (
        <TouchableOpacity
          onPress={() => {
            setEditingShip(null);
            setName('');
            setDescription('');
            setImage(null);
            setUseImg(null);
          }}
          style={styles.close}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
      {(!canMod || !canUploadImage) && (
        <Text style={styles.denied}>Only authorized users can add, edit, or upload images.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: '90%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  descInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  imgOpts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  upload: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  noImgBtn: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  add: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  close: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  denied: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AddShipForm;