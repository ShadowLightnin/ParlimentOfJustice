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
import { doc, setDoc, addDoc, collection, deleteObject } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com", "samuelp.woodwell@gmail.com"];
const RESTRICT_ACCESS = true;

const VillainFleetForm = ({
  collectionPath = 'villainShips',
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
    console.log('Current user:', auth.currentUser?.email, 'Can submit:', canSubmit, 'Collection path:', collectionPath);
    if (editingShip) {
      console.log('Editing ship loaded:', {
        id: editingShip.id,
        name: editingShip.name,
        description: editingShip.description,
        imageUrl: editingShip.imageUrl,
      });
      setName(editingShip.name || '');
      setDescription(editingShip.description || '');
      setImageUri(editingShip.imageUrl || null);
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
      console.log('Form reset for new villain ship');
    }
  }, [editingShip, canSubmit, collectionPath]);

  const pickImage = async () => {
    if (!canSubmit) {
      console.log('Pick image blocked: user not authorized');
      Alert.alert('Access Denied', 'Only authorized users can upload images.');
      return;
    }
    try {
      console.log('Opening image picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Image picker permission status:', status);
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
      console.log('Image picker result:', result);
      if (!result.canceled && result.assets) {
        setImageUri(result.assets[0].uri);
        console.log('Image picked:', result.assets[0].uri);
      } else {
        console.log('Image picker canceled');
      }
    } catch (e) {
      console.error('Image picker error:', e.message);
      Alert.alert('Error', `Failed to pick image: ${e.message}`);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log('No image URI provided, returning placeholder');
      return 'placeholder';
    }
    try {
      console.log('Starting image upload for villainShips with URI:', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imagePath = `villainShips/${timestamp}_${random}.jpg`;
      console.log('Uploading to path:', imagePath);
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, blob);
      console.log('Upload completed, fetching download URL');
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded successfully:', downloadURL);
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
      console.log('Submit blocked: user not authorized');
      Alert.alert('Access Denied', 'Only authorized users can submit villain ships.');
      return;
    }
    if (!name.trim()) {
      console.log('Submit blocked: no name provided');
      Alert.alert('Error', 'Please provide a villain ship name.');
      return;
    }
    if (!collectionPath) {
      console.error('Collection path is undefined');
      Alert.alert('Error', 'Invalid collection path');
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
        borderColor: 'blue',
        hardcoded: false,
      };
      console.log('Submitting ship data:', shipData);
      if (editingShip) {
        const shipRef = doc(db, collectionPath, editingShip.id);
        console.log('Updating Firestore document:', shipRef.path);
        await setDoc(shipRef, shipData, { merge: true });
        console.log('Villain ship updated:', { id: editingShip.id, name: shipData.name, imageUrl: shipData.imageUrl });
        setShips(ships.map(item => (item.id === editingShip.id && !item.hardcoded ? { id: item.id, ...shipData } : item)));
        Alert.alert('Success', 'Villain ship updated successfully!');
      } else {
        console.log('Adding new Firestore document to:', collectionPath);
        const shipRef = await addDoc(collection(db, collectionPath), shipData);
        console.log('Villain ship added:', { id: shipRef.id, name: shipData.name, imageUrl: shipData.imageUrl });
        setShips([...hardcodedShips, ...ships.filter(item => !item.hardcoded), { id: shipRef.id, ...shipData }]);
        Alert.alert('Success', 'Villain ship added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingShip(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingShip ? 'update' : 'add'} villain ship: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingShip(null);
    console.log('Form cancelled');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingShip ? 'Edit Villain Ship' : 'Add New Villain Ship'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Villain Ship Name"
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
          onError={(e) => console.error('Preview image load error:', e.nativeEvent.error, 'URI:', imageUri)}
        />
      )}
      {!imageUri && editingShip && editingShip.imageUrl && editingShip.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingShip.imageUrl }}
          style={styles.previewImage}
          resizeMode="contain"
          onError={(e) => console.error('Editing preview image load error:', e.nativeEvent.error, 'URI:', editingShip.imageUrl)}
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

export default VillainFleetForm;