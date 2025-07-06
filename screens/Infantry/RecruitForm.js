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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true;

const RecruitForm = ({
  collectionPath = 'infantry',
  placeholderImage,
  infantry = [],
  setInfantry,
  hardcodedInfantry = [],
  editingInfantry,
  setEditingInfantry,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    if (editingInfantry) {
      setName(editingInfantry.name || '');
      setDescription(editingInfantry.description || '');
      setImageUri(editingInfantry.imageUrl || null);
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
    }
  }, [editingInfantry]);

  const pickImage = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can upload images.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3], // Matches ShipYardScreen.js card aspect ratio
      quality: 0.5,
    });
    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      console.log('Image picked:', result.assets[0].uri);
    } else {
      console.log('Image picker canceled');
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return 'placeholder';
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imageRef = ref(storage, `infantry/${timestamp}_${random}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded:', downloadURL);
      return downloadURL;
    } catch (e) {
      console.error('Image upload error:', e.message);
      throw e;
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can submit infantry.');
      return;
    }
    if (!name.trim() && !description.trim()) {
      Alert.alert('Error', 'Please provide a name or description.');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = 'placeholder';
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }
      const infantryData = {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: '#FFFFFF', // Matches original RecruitForm.js
        hardcoded: false,
      };
      if (editingInfantry) {
        const infantryRef = doc(db, collectionPath, editingInfantry.id);
        await setDoc(infantryRef, infantryData, { merge: true });
        console.log('Infantry updated:', editingInfantry.id);
        setInfantry(infantry.map(item => (item.id === editingInfantry.id ? { ...item, ...infantryData } : item)));
        Alert.alert('Success', 'Infantry updated successfully!');
      } else {
        const infantryRef = await addDoc(collection(db, collectionPath), infantryData);
        console.log('Infantry added:', infantryRef.id);
        setInfantry([...hardcodedInfantry, ...infantry.filter(item => !item.hardcoded), { id: infantryRef.id, ...infantryData }]);
        Alert.alert('Success', 'Infantry added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingInfantry(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingInfantry ? 'update' : 'add'} infantry: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingInfantry(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingInfantry ? 'Edit Infantry' : 'Add New Infantry'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Infantry Name"
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
      {!imageUri && editingInfantry && editingInfantry.imageUrl && editingInfantry.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingInfantry.imageUrl }}
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
          <Text style={styles.buttonText}>{uploading ? 'Submitting...' : editingInfantry ? 'Update' : 'Submit'}</Text>
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

export default RecruitForm;