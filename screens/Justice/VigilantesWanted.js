import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../lib/firebase';
import { doc, setDoc, addDoc, collection, deleteObject, ref } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true;

const VigilantesWanted = ({
  collectionPath = 'vigilantes',
  placeholderImage,
  hero,
  setHero,
  hardcodedHero,
  editingHero,
  setEditingHero,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    if (editingHero) {
      setName(editingHero.name || editingHero.codename || '');
      setDescription(editingHero.description || '');
      setImageUri(editingHero.imageUrl || null);
      console.log('Editing vigilante loaded:', editingHero);
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
    }
  }, [editingHero]);

  const pickImage = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can upload images.');
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      if (!result.canceled && result.assets) {
        setImageUri(result.assets[0].uri);
        console.log('Image picked:', result.assets[0].uri);
      } else {
        console.log('Image picker canceled');
      }
    } catch (e) {
      console.error('Pick image error:', e.message);
      Alert.alert('Error', `Failed to pick image: ${e.message}`);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return 'placeholder';
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imageRef = storageRef(storage, `vigilantes/${timestamp}_${random}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded:', downloadURL);
      return downloadURL;
    } catch (e) {
      console.error('Image upload error:', e.message);
      throw new Error(`Image upload failed: ${e.message}`);
    }
  };

  const deleteOldImage = async (imageUrl) => {
    if (!imageUrl || imageUrl === 'placeholder') return;
    try {
      const path = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
      await deleteObject(storageRef(storage, path));
      console.log('Old image deleted:', path);
    } catch (e) {
      if (e.code !== 'storage/object-not-found') {
        console.error('Delete old image error:', e.message);
        Alert.alert('Warning', `Failed to delete old image: ${e.message}. Continuing with update.`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can submit vigilantes.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a vigilante name.');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingHero ? editingHero.imageUrl || 'placeholder' : 'placeholder';
      let oldImageUrl = editingHero ? editingHero.imageUrl : null;
      if (imageUri && imageUri !== oldImageUrl) {
        imageUrl = await uploadImage(imageUri);
        if (oldImageUrl && oldImageUrl !== 'placeholder') {
          await deleteOldImage(oldImageUrl);
        }
      }
      const heroData = {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: '#8B0000', // Red for vigilante theme
        hardcoded: false,
      };
      console.log('Submitting vigilante data:', heroData);
      if (editingHero) {
        const heroRef = doc(db, collectionPath, editingHero.id);
        await setDoc(heroRef, heroData, { merge: true });
        console.log('Vigilante updated:', editingHero.id);
        setHero(hero.map(item => (item.id === editingHero.id ? { id: item.id, ...heroData } : item)));
        Alert.alert('Success', 'Vigilante updated successfully!');
      } else {
        const heroRef = await addDoc(collection(db, collectionPath), heroData);
        console.log('Vigilante added:', heroRef.id);
        setHero([...hardcodedHero, ...hero.filter(item => !item.hardcoded), { id: heroRef.id, ...heroData }]);
        Alert.alert('Success', 'Vigilante added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingHero(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingHero ? 'update' : 'add'} vigilante: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingHero(null);
    console.log('Form canceled');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingHero ? 'Edit Wanted Vigilante' : 'Add Wanted Vigilante'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Vigilante Name or Codename"
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
      <TouchableOpacity
        style={[styles.imagePicker, !canSubmit && styles.disabled]}
        onPress={pickImage}
        disabled={!canSubmit}
      >
        <Text style={styles.imagePickerText}>{imageUri ? 'Change Image' : 'Pick an Image'}</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
      )}
      {!imageUri && editingHero && editingHero.imageUrl && editingHero.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingHero.imageUrl }}
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
          <Text style={styles.buttonText}>{uploading ? 'Submitting...' : editingHero ? 'Update' : 'Submit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F2F2F',
    padding: 20,
    borderRadius: 10,
    margin: 20 + Math.random() * 10,
    width: isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C0C0C0',
    textAlign: 'center',
    textShadowColor: 'rgba(139, 0, 0, 0.7)',
    textShadowRadius: 15,
    marginBottom: 20 + Math.random() * 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#C0C0C0',
    padding: 10 + Math.random() * 2,
    borderRadius: 5,
    marginBottom: 15 + Math.random() * 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#555',
    padding: 10 + Math.random() * 2,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15 + Math.random() * 5,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  imagePickerText: {
    color: '#C0C0C0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15 + Math.random() * 5,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#8B0000',
    padding: 10 + Math.random() * 2,
    borderRadius: 5,
    flex: 1,
    marginRight: 10 + Math.random() * 2,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4B0082',
    padding: 10 + Math.random() * 2,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10 + Math.random() * 2,
    alignItems: 'center',
  },
  buttonText: {
    color: '#C0C0C0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
});

export default VigilantesWanted;