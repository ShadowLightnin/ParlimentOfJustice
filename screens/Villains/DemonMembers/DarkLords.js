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
import { db, storage, auth } from '../../../lib/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com", "samuelp.woodwell@gmail.com"];
const RESTRICT_ACCESS = true;

const DarkLords = ({
  collectionPath = 'demons',
  placeholderImage,
  demon,
  setDemon,
  hardcodedDemon,
  editingDemon,
  setEditingDemon,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    if (editingDemon) {
      setName(editingDemon.name || editingDemon.codename || '');
      setDescription(editingDemon.description || '');
      setImageUri(editingDemon.imageUrl || null);
      console.log('Editing demon loaded:', { id: editingDemon.id, name: editingDemon.name, codename: editingDemon.codename });
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
    }
  }, [editingDemon]);

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
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      console.log('Image picked:', result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return 'placeholder';
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imageRef = ref(storage, `demon/${timestamp}_${random}.jpg`);
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
      Alert.alert('Access Denied', 'Only authorized users can submit demons.');
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
      const demonData = {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: '#FF0000',
        hardcoded: false,
      };
      if (editingDemon) {
        const demonRef = doc(db, collectionPath, editingDemon.id);
        await setDoc(demonRef, demonData, { merge: true });
        console.log('Demon updated:', editingDemon.id);
        setDemon(demon.map(item => (item.id === editingDemon.id ? { ...item, ...demonData } : item)));
        Alert.alert('Success', 'Demon updated successfully!');
      } else {
        const demonRef = await addDoc(collection(db, collectionPath), demonData);
        console.log('Demon added:', demonRef.id);
        setDemon([...hardcodedDemon, ...demon.filter(item => !item.hardcoded), { id: demonRef.id, ...demonData }]);
        Alert.alert('Success', 'Demon added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingDemon(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingDemon ? 'update' : 'add'} demon: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingDemon(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingDemon ? 'Edit Demon' : 'Add New Demon'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Demon Name or Codename"
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
      {!imageUri && editingDemon && editingDemon.imageUrl && editingDemon.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingDemon.imageUrl }}
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
          <Text style={styles.buttonText}>{uploading ? 'Submitting...' : editingDemon ? 'Update' : 'Submit'}</Text>
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

export default DarkLords;