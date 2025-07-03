import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { db, storage, auth } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = false; // Allow anyone to add/edit heroes
const RESTRICT_IMAGE_UPLOAD = true; // Restrict image uploads to ALLOWED_EMAILS
const PLACEHOLDER_URL = 'placeholder';

const LeagueMembers = ({ collectionPath = 'hero', placeholderImage, infantry = [], setInfantry, hardcodedInfantry = [], editingInfantry, setEditingInfantry }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [useImg, setUseImg] = useState(null);
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;
  const canUploadImage = !RESTRICT_IMAGE_UPLOAD || (auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email));

  useEffect(() => {
    if (editingInfantry) {
      setName(editingInfantry.name || '');
      setDescription(editingInfantry.description || '');
      setImage(editingInfantry.imageUrl && editingInfantry.imageUrl !== 'placeholder' ? editingInfantry.imageUrl : null);
      setUseImg(editingInfantry.imageUrl && editingInfantry.imageUrl !== 'placeholder' ? true : false);
    } else {
      setName('');
      setDescription('');
      setImage(null);
      setUseImg(null);
    }
  }, [editingInfantry]);

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

  const addHero = async (useImage = true) => {
    if (!canMod) {
      alert('Access Denied', 'Only authorized users can add heroes.');
      return;
    }
    if (!name || !description) {
      alert('Error', 'Enter name and description');
      return;
    }
    try {
      const imgUrl = useImage && image ? await uploadImg(image) : useImage ? PLACEHOLDER_URL : '';
      const heroData = {
        name,
        description,
        imageUrl: imgUrl,
        clickable: true,
        borderColor: '#FFFFFF', // White for dynamic heroes
        hardcoded: false,
      };
      const docRef = await addDoc(collection(db, collectionPath), heroData);
      console.log('Hero added to Firestore:', { id: docRef.id, ...heroData });
      if (setInfantry) {
        const updatedInfantry = [...hardcodedInfantry, ...infantry.filter(item => !item.hardcoded), { id: docRef.id, ...heroData }];
        setInfantry(updatedInfantry);
        console.log('Updated heroes state:', updatedInfantry);
      }
      setName('');
      setDescription('');
      setImage(null);
      setUseImg(null);
      alert('Success', 'Hero added!');
    } catch (e) {
      console.error('Add hero error:', e.message);
      alert('Error', `Failed to add hero: ${e.message}`);
    }
  };

  const saveEdit = async () => {
    if (!canMod) {
      alert('Access Denied', 'Only authorized users can edit heroes.');
      return;
    }
    if (!name || !description) {
      alert('Error', 'Enter name and description');
      return;
    }
    try {
      const imgUrl = useImg && image ? await uploadImg(image) : useImg ? PLACEHOLDER_URL : '';
      const heroData = {
        name,
        description,
        imageUrl: imgUrl,
        clickable: true,
        borderColor: '#FFFFFF', // White for dynamic heroes
        hardcoded: false,
      };
      await updateDoc(doc(db, collectionPath, editingInfantry.id), heroData);
      console.log('Hero updated in Firestore:', { id: editingInfantry.id, ...heroData });
      if (setInfantry) {
        const updatedInfantry = infantry.map(i => (i.id === editingInfantry.id ? { ...i, ...heroData } : i));
        setInfantry(updatedInfantry);
        console.log('Updated heroes state:', updatedInfantry);
      }
      setEditingInfantry(null);
      setName('');
      setDescription('');
      setImage(null);
      setUseImg(null);
      alert('Success', 'Hero updated!');
    } catch (e) {
      console.error('Update hero error:', e.message);
      alert('Error', `Failed to update hero: ${e.message}`);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Hero Name"
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
          onPress={() => editingInfantry ? (setImage(null), setUseImg(false)) : addHero(false)}
          style={[styles.noImgBtn, !canMod && styles.disabled]}
          disabled={!canMod}
        >
          <Text style={styles.buttonText}>{editingInfantry ? 'Remove Image' : 'No Image'}</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <TouchableOpacity
        onPress={editingInfantry ? saveEdit : addHero}
        style={[styles.add, !canMod && styles.disabled]}
        disabled={!canMod}
      >
        <Text style={styles.buttonText}>{editingInfantry ? 'Save' : 'Add Hero'}</Text>
      </TouchableOpacity>
      {editingInfantry && (
        <TouchableOpacity
          onPress={() => {
            setEditingInfantry(null);
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

// Styles
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

export default LeagueMembers;