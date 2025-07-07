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
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true;

const AddShipForm = ({
  collectionPath = 'ships',
  placeholderImage,
  ships = [],
  setShips,
  hardcodedShips = [],
  editingShip,
  setEditingShip,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    if (editingShip) {
      setName(editingShip.name || '');
      setDescription(editingShip.description || '');
      setImageUri(editingShip.imageUrl || null);
      console.log('Editing ship loaded:', editingShip);
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
    }
  }, [editingShip]);

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
        aspect: [2, 3],
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
      const imageRef = ref(storage, `ships/${timestamp}_${random}.jpg`);
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
      await deleteObject(ref(storage, path));
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
      Alert.alert('Access Denied', 'Only authorized users can submit ships.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a ship name.');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingShip ? editingShip.imageUrl || 'placeholder' : 'placeholder';
      let oldImageUrl = editingShip ? editingShip.imageUrl : null;
      if (imageUri && imageUri !== oldImageUrl) {
        imageUrl = await uploadImage(imageUri);
        if (oldImageUrl && oldImageUrl !== 'placeholder') {
          await deleteOldImage(oldImageUrl);
        }
      }
      const shipData = {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: 'yellow',
        hardcoded: false,
      };
      console.log('Submitting ship data:', shipData);
      if (editingShip) {
        const shipRef = doc(db, collectionPath, editingShip.id);
        await setDoc(shipRef, shipData, { merge: true });
        console.log('Ship updated:', editingShip.id);
        setShips(ships.map(item => (item.id === editingShip.id ? { id: item.id, ...shipData } : item)));
        Alert.alert('Success', 'Ship updated successfully!');
      } else {
        const shipRef = await addDoc(collection(db, collectionPath), shipData);
        console.log('Ship added:', shipRef.id);
        setShips([...hardcodedShips, ...ships.filter(item => !item.hardcoded), { id: shipRef.id, ...shipData }]);
        Alert.alert('Success', 'Ship added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingShip(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingShip ? 'update' : 'add'} ship: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingShip(null);
    console.log('Form canceled');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingShip ? 'Edit Ship' : 'Add New Ship'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Ship Name"
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
      {!imageUri && editingShip && editingShip.imageUrl && editingShip.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingShip.imageUrl }}
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
          <Text style={styles.buttonText}>{uploading ? 'Submitting...' : editingShip ? 'Update' : 'Submit'}</Text>
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
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width: isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
});

export default AddShipForm;