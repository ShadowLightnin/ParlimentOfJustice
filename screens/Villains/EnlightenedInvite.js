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

const EnlightenedInvite = ({
  collectionPath = 'villain',
  placeholderImage,
  villain,
  setVillain,
  hardcodedVillain,
  editingVillain,
  setEditingVillain,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    console.log('Current user:', auth.currentUser?.email, 'Can submit:', canSubmit, 'Collection path:', collectionPath);
    console.log('Villain array:', villain.map(v => ({ id: v.id, name: v.name, codename: v.codename, collectionPath: v.collectionPath })));
    if (editingVillain) {
      console.log('Editing villain loaded:', {
        id: editingVillain.id,
        name: editingVillain.name,
        codename: editingVillain.codename,
        description: editingVillain.description,
        imageUrl: editingVillain.imageUrl,
      });
      setName(editingVillain.name || editingVillain.codename || '');
      setDescription(editingVillain.description || '');
      setImageUri(editingVillain.imageUrl || null);
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
      console.log('Form reset for new villain');
    }
  }, [editingVillain, canSubmit, collectionPath]);

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
        aspect: [4, 3],
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
      console.log('Starting image upload for villain with URI:', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imagePath = `villain/${timestamp}_${random}.jpg`;
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
      Alert.alert('Access Denied', 'Only authorized users can submit villains.');
      return;
    }
    if (!name.trim()) {
      console.log('Submit blocked: no name provided');
      Alert.alert('Error', 'Please provide a villain name or codename.');
      return;
    }
    if (!collectionPath) {
      console.error('Collection path is undefined');
      Alert.alert('Error', 'Invalid collection path');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingVillain ? editingVillain.imageUrl || 'placeholder' : 'placeholder';
      let oldImageUrl = editingVillain ? editingVillain.imageUrl : null;
      if (imageUri && imageUri !== oldImageUrl) {
        imageUrl = await uploadImage(imageUri);
        if (oldImageUrl && oldImageUrl !== 'placeholder') {
          await deleteOldImage(oldImageUrl);
        }
      }
      const villainData = {
        name: name.trim(),
        codename: name.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: '#FFFFFF',
        hardcoded: false,
      };
      console.log('Submitting villain data:', villainData);
      if (editingVillain) {
        const villainRef = doc(db, collectionPath, editingVillain.id);
        console.log('Updating Firestore document:', villainRef.path);
        await setDoc(villainRef, villainData, { merge: true });
        console.log('Villain updated:', { id: editingVillain.id, name: villainData.name, imageUrl: villainData.imageUrl });
        setVillain(villain.map(item => (item.id === editingVillain.id && !item.hardcoded ? { id: item.id, ...villainData } : item)));
        Alert.alert('Success', 'Villain updated successfully!');
      } else {
        console.log('Adding new Firestore document to:', collectionPath);
        const villainRef = await addDoc(collection(db, collectionPath), villainData);
        console.log('Villain added:', { id: villainRef.id, name: villainData.name, imageUrl: villainData.imageUrl });
        setVillain([...hardcodedVillain, ...villain.filter(item => !item.hardcoded), { id: villainRef.id, ...villainData }]);
        Alert.alert('Success', 'Villain added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingVillain(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingVillain ? 'update' : 'add'} villain: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingVillain(null);
    console.log('Form cancelled');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingVillain ? 'Edit Villain' : 'Add New Villain'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Villain Name or Codename"
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
      {!imageUri && editingVillain && editingVillain.imageUrl && editingVillain.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingVillain.imageUrl }}
          style={styles.previewImage}
          resizeMode="contain"
          onError={(e) => console.error('Editing preview image load error:', e.nativeEvent.error, 'URI:', editingVillain.imageUrl)}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.disabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || uploading}
        >
          <Text style={styles.buttonText}>{uploading ? 'Submitting...' : editingVillain ? 'Update' : 'Submit'}</Text>
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
    backgroundColor: '#2E1A47',
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
    backgroundColor: '#3C2F5C',
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
    backgroundColor: '#750000',
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
    backgroundColor: '#5913BC',
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

export default EnlightenedInvite;