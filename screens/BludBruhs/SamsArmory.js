import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../lib/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com", "samuelp.woodwell@gmail.com"];
const RESTRICT_ACCESS = true;

const SamsArmory = ({
  collectionPath = 'samArmory', // Updated to use samArmory
  placeholderImage,
  friend,
  setFriend,
  hardcodedFriend,
  editingFriend,
  setEditingFriend,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    console.log('Current user:', auth.currentUser?.email, 'Can submit:', canSubmit);
    if (editingFriend) {
      setName(editingFriend.name || editingFriend.codename || '');
      setDescription(editingFriend.description || '');
      setImageUri(editingFriend.imageUrl || null);
      console.log('Editing friend loaded:', {
        id: editingFriend.id,
        name: editingFriend.name,
        codename: editingFriend.codename,
        imageUrl: editingFriend.imageUrl,
        description: editingFriend.description
      });
    } else {
      setName('');
      setDescription('');
      setImageUri(null);
      console.log('Form reset for new friend');
    }
  }, [editingFriend]);

  const pickImage = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can upload images.');
      return;
    }
    try {
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
        console.log('Image picker canceled or no assets');
      }
    } catch (e) {
      console.error('Image picker error:', e.message);
      Alert.alert('Error', 'Failed to pick image: ' + e.message);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log('No image URI provided, returning placeholder');
      return 'placeholder';
    }
    try {
      console.log('Starting image upload for URI:', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const imagePath = `samArmory/${timestamp}_${random}.jpg`;
      console.log('Uploading to path:', imagePath);
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, blob);
      console.log('Upload completed, fetching download URL');
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (e) {
      console.error('Image upload error:', e.code, e.message);
      throw e;
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can submit friends.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a name or codename.');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingFriend?.imageUrl || 'placeholder'; // Preserve existing imageUrl if no new image
      if (imageUri && imageUri !== editingFriend?.imageUrl) {
        imageUrl = await uploadImage(imageUri);
      }
      const friendData = {
        name: name.trim(),
        codename: name.trim(), // Ensure codename is consistent
        description: description.trim(),
        imageUrl,
        clickable: true,
        borderColor: '#00b3ff',
        hardcoded: false,
        copyright: 'Samuel Woodwell',
      };
      console.log('Submitting friend data:', friendData);
      if (editingFriend) {
        const friendRef = doc(db, collectionPath, editingFriend.id);
        console.log('Updating Firestore document:', friendRef.path);
        await setDoc(friendRef, friendData, { merge: true });
        console.log('Friend updated:', { id: editingFriend.id, name: friendData.name, imageUrl: friendData.imageUrl });
        setFriend(friend.map(item => (item.id === editingFriend.id ? { ...item, ...friendData } : item)));
        Alert.alert('Success', 'Friend updated successfully!');
      } else {
        console.log('Adding new Firestore document to:', collectionPath);
        const friendRef = await addDoc(collection(db, collectionPath), friendData);
        console.log('Friend added:', { id: friendRef.id, name: friendData.name, imageUrl: friendData.imageUrl });
        setFriend([...hardcodedFriend, ...friend.filter(item => !item.hardcoded), { id: friendRef.id, ...friendData }]);
        Alert.alert('Success', 'Friend added successfully!');
      }
      setName('');
      setDescription('');
      setImageUri(null);
      setEditingFriend(null);
    } catch (e) {
      console.error('Submit error:', e.code, e.message);
      Alert.alert('Error', `Failed to ${editingFriend ? 'update' : 'add'} friend: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setImageUri(null);
    setEditingFriend(null);
    console.log('Form cancelled');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingFriend ? 'Edit Friend' : 'Add New Friend'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend Name or Codename"
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
      {!imageUri && editingFriend && editingFriend.imageUrl && editingFriend.imageUrl !== 'placeholder' && (
        <Image
          source={{ uri: editingFriend.imageUrl }}
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
          <Text style={styles.buttonText}>{uploading ? 'Submitting...' : editingFriend ? 'Update' : 'Submit'}</Text>
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

export default SamsArmory;