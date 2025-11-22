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
  Platform,
  Picker,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../lib/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true;

const CATEGORIES = [
  { label: 'Doctors', value: 'Doctors' },
  { label: 'College', value: 'College' },
  { label: 'High School', value: 'High School' },
  { label: 'Jr High', value: 'Jr. High' },
  { label: 'Elementary', value: 'Elementary' },
  { label: 'Influencers', value: 'Influencers' },
  { label: 'Acquaintances', value: 'Acquaintances' },
];

const ConstollationClass = ({
  collectionPath = 'ConstollationMembers',
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
  const [selectedCategory, setSelectedCategory] = useState('Doctors');
  const canSubmit = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    if (editingHero) {
      const category = editingHero.category || 'Doctors';
      setName(editingHero.name || '');
      setCodename(editingHero.codename || '');
      setImageUri(editingHero.imageUrl || null);
      setSelectedCategory(category);
    } else {
      setName('');
      setCodename('');
      setImageUri(null);
      setSelectedCategory('Doctors');
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
        Alert.alert('Permission Denied', 'Need camera roll permissions!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return 'placeholder';
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `Constollation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      const imageRef = storageRef(storage, `ConstollationMembers/${filename}`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (e) {
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can submit.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required.');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editingHero?.imageUrl || 'placeholder';
      if (imageUri && imageUri !== (editingHero?.imageUrl || null)) {
        imageUrl = await uploadImage(imageUri);
      }

      const memberData = {
        name: name.trim(),
        codename: codename.trim(),
        category: selectedCategory,
        imageUrl,
        clickable: true,
        hardcoded: false,
      };

      const categoryIndex = hero.findIndex(cat => cat.category === selectedCategory);

      if (editingHero) {
        const memberIndex = hero[categoryIndex].members.findIndex(m => m.name === editingHero.name);
        hero[categoryIndex].members[memberIndex] = { ...hero[categoryIndex].members[memberIndex], ...memberData };
        await setDoc(doc(db, collectionPath, editingHero.name), memberData, { merge: true });
        setHero([...hero]);
        Alert.alert('Success', 'Star updated in the Constollation!');
      } else {
        hero[categoryIndex].members.push(memberData);
        await addDoc(collection(db, collectionPath), memberData);
        setHero([...hero]);
        Alert.alert('Success', 'New star added to the Constollation!');
      }

      handleCancel();
    } catch (e) {
      Alert.alert('Error', `Failed to ${editingHero ? 'update' : 'add'} star: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setCodename('');
    setImageUri(null);
    setEditingHero(null);
    setSelectedCategory('Doctors');
  };

  const handleDeleteRequest = (member) => {
    if (onDelete) {
      onDelete(member);
    } else {
      Alert.alert('Error', 'Delete not supported.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {editingHero ? `Edit Star in ${selectedCategory}` : 'Add New Star to Constollation'}
      </Text>

      <Picker
        selectedValue={selectedCategory}
        onValueChange={setSelectedCategory}
        style={styles.picker}
        enabled={canSubmit && !editingHero}
      >
        {CATEGORIES.map(cat => (
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
        <Text style={styles.imagePickerText}>
          {imageUri ? 'Change Image' : 'Pick Image'}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, (!canSubmit || uploading) && styles.disabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Submitting...' : editingHero ? 'Update Star' : 'Add Star'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
    backgroundColor: '#111',
    padding: 25,
    borderRadius: 20,
    margin: 20,
    width: isDesktop ? SCREEN_WIDTH * 0.5 : SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#00b3ff',
    shadowColor: '#00b3ff',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00ffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
  },
  picker: {
    backgroundColor: '#222',
    color: '#00ffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00b3ff',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#00b3ff',
  },
  imagePicker: {
    backgroundColor: '#00b3ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00b3ff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#00b3ff',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ConstollationClass;