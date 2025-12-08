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
import { Picker } from '@react-native-picker/picker'; // ✅ correct Picker import
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../lib/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true;

const CATEGORIES = [
  { label: 'Alumni', value: 'College' },
  { label: "Fellowship", value: "Fellowship" },
  { label: 'Young Womens', value: 'Young Womens' },
  { label: 'High School', value: 'High School' },
  { label: 'Jr. High', value: 'Jr. High' },
  { label: 'Elementary', value: 'Elementary' },
  { label: 'Acquaintances', value: 'Acquaintances' },
];

const LegionFriends = ({
  collectionPath = 'LegionairesMembers',
  placeholderImage,
  hero,
  setHero,
  hardcodedHero,
  editingHero,
  setEditingHero,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('College');
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    if (editingHero) {
      const category = editingHero.category || 'College';
      setName(editingHero.name || '');
      setCodename(editingHero.codename || '');
      setImageUri(editingHero.imageUrl || null);
      setSelectedCategory(category);
    } else {
      setName('');
      setCodename('');
      setImageUri(null);
      setSelectedCategory('College');
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
      const imageRef = storageRef(storage, `LegionairesMembers/${timestamp}_${random}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (e) {
      console.error('Image upload error:', e.message);
      throw new Error(`Image upload failed: ${e.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can submit heroes.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a name.');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = editingHero ? editingHero.imageUrl || 'placeholder' : 'placeholder';
      if (imageUri && imageUri !== (editingHero?.imageUrl || null)) {
        imageUrl = await uploadImage(imageUri);
      }
      const memberData = {
        name: name.trim(),
        codename: codename.trim(),
        category: selectedCategory,
        imageUrl,
        clickable: true,
        borderColor: '#C0C0C0',
        hardcoded: false,
      };
      const categoryIndex = hero.findIndex(cat => cat.category === selectedCategory);
      if (editingHero) {
        const memberIndex = hero[categoryIndex].members.findIndex(m => m.name === editingHero.name);
        hero[categoryIndex].members[memberIndex] = { ...hero[categoryIndex].members[memberIndex], ...memberData };
        const docRef = doc(db, collectionPath, editingHero.name);
        await setDoc(docRef, memberData, { merge: true });
        setHero([...hero]);
        Alert.alert('Success', 'Member updated successfully!');
      } else {
        hero[categoryIndex].members.push(memberData);
        const docRef = await addDoc(collection(db, collectionPath), memberData);
        setHero([...hero]);
        Alert.alert('Success', 'Member added successfully!');
      }
      setName('');
      setCodename('');
      setImageUri(null);
      setEditingHero(null);
    } catch (e) {
      console.error('Submit error:', e.message);
      Alert.alert('Error', `Failed to ${editingHero ? 'update' : 'add'} member: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setCodename('');
    setImageUri(null);
    setEditingHero(null);
    setSelectedCategory('College');
  };

  // Delegate delete to parent via onDelete callback
  const handleDeleteRequest = (member) => {
    if (onDelete) {
      onDelete(member); // Trigger parent's delete modal
    } else {
      Alert.alert('Error', 'Delete functionality not supported by parent component.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{editingHero ? `Edit Member in ${selectedCategory}` : 'Add New Member'}</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value)}
        style={styles.picker}
        enabled={canSubmit && !editingHero}
      >
        {CATEGORIES.map((cat) => (
          <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        editable={canSubmit}
      />
      <TextInput
        style={styles.input}
        placeholder="Codename"
        placeholderTextColor="#888"
        value={codename}
        onChangeText={setCodename}
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
        {editingHero && (
          <TouchableOpacity
            style={[styles.deleteButton, !canSubmit && styles.disabled]}
            onPress={() => handleDeleteRequest(editingHero)}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
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
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#46423b',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  imagePicker: {
    backgroundColor: '#00b3ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    borderColor: '#C0C0C0',
    borderWidth: 1,
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
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: '#00b3ff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
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

export default LegionFriends;