import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  Modal,
  Alert,
  ImageBackground, // Added missing import
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, storage, auth } from '../../lib/firebase';
import { collection, addDoc, setDoc, doc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
const RESTRICT_ACCESS = false;
const PLACEHOLDER_IMAGE = require('../../assets/Armor/PlaceHolder.jpg');

const CharacterDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [videoUri, setVideoUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [imageDescription, setImageDescription] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [uploading, setUploading] = useState(false);
  const member = route.params?.member;

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      setCanSubmit(RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true);
    };
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    if (member) {
      setName(member.name || '');
      setDescription(member.description || '');
      setImages(member.images || []);
      setVideoUri(member.videoUri || null);
    }
    return () => authUnsub();
  }, [member]);

  const pickImage = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can upload images.');
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to pick images!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled && result.assets) {
        const newImage = { uri: result.assets[0].uri, description: '' };
        setImages([...images, newImage]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const pickVideo = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can upload videos.');
      return;
    }
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media permissions to pick videos!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets) {
        setVideoUri(result.assets[0].uri);
        if (videoRef.current) {
          await videoRef.current.unloadAsync();
        }
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', 'Failed to pick video: ' + error.message);
    }
  };

  const uploadMedia = async (uri, type) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const path = `${type}/${timestamp}_${random}.${type === 'image' ? 'jpg' : 'mp4'}`;
      const mediaRef = storageRef(storage, path);
      await uploadBytesResumable(mediaRef, blob);
      return await getDownloadURL(mediaRef);
    } catch (e) {
      throw new Error(`Upload failed: ${e.message}`);
    }
  };

  const deleteOldMedia = async (url) => {
    if (!url || url === 'placeholder') return;
    try {
      const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      await deleteObject(storageRef(storage, path));
    } catch (e) {
      if (e.code !== 'storage/object-not-found') {
        console.error('Delete media error:', e.message);
        Alert.alert('Warning', `Failed to delete media: ${e.message}. Continuing with operation.`);
      }
    }
  };

  const handleSave = async () => {
    if (!canSubmit) {
      Alert.alert('Access Denied', 'Only authorized users can save characters.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a character name.');
      return;
    }
    setUploading(true);
    try {
      const imageUrls = await Promise.all(images.map(async (img, index) => {
        if (!img.uri.startsWith('http')) {
          const url = await uploadMedia(img.uri, 'image');
          if (member?.images?.[index]?.uri && !member.images[index].uri.startsWith('http')) {
            await deleteOldMedia(member.images[index].uri);
          }
          return { uri: url, description: img.description };
        }
        return img;
      }));
      let videoUrl = member?.videoUri || null;
      if (videoUri && !videoUri.startsWith('http')) {
        videoUrl = await uploadMedia(videoUri, 'video');
        if (member?.videoUri && !member.videoUri.startsWith('http')) {
          await deleteOldMedia(member.videoUri);
        }
      }

      const charData = {
        name: name.trim(),
        description: description.trim(),
        images: imageUrls,
        videoUri: videoUrl,
        clickable: true,
      };
      if (member?.id) {
        await setDoc(doc(db, 'characters', member.id), charData, { merge: true });
        Alert.alert('Success', 'Character updated successfully!');
      } else {
        const charRef = await addDoc(collection(db, 'characters'), charData);
        charData.id = charRef.id;
        Alert.alert('Success', 'Character added successfully!');
      }
      navigation.navigate('PowerTitans', { newMember: charData });
    } catch (e) {
      console.error('Save error:', e.message);
      Alert.alert('Error', `Failed to save character: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageEdit = (index) => {
    setEditingImageIndex(index);
    setImageDescription(images[index]?.description || '');
  };

  const saveImageDescription = () => {
    const newImages = [...images];
    newImages[editingImageIndex].description = imageDescription;
    setImages(newImages);
    setEditingImageIndex(null);
    setImageDescription('');
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    if (newImages[index].uri.startsWith('http')) {
      deleteOldMedia(newImages[index].uri);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <ImageBackground source={videoUri ? { uri: videoUri } : require('../../assets/BackGround/Titans.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Add/Edit Character</Text>
          <TextInput
            style={styles.input}
            placeholder="Character Name"
            value={name}
            onChangeText={setName}
            editable={canSubmit}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={canSubmit}
          />
          <TouchableOpacity style={styles.button} onPress={pickImage} disabled={!canSubmit}>
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
          <ScrollView horizontal style={styles.imageScroll}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={img.uri.startsWith('http') ? { uri: img.uri } : img.uri} style={styles.image} />
                <TouchableOpacity style={styles.editButton} onPress={() => handleImageEdit(index)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(index)}>
                  <Text style={styles.buttonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {editingImageIndex !== null && (
            <Modal transparent visible={true} onRequestClose={() => setEditingImageIndex(null)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Image Description"
                    value={imageDescription}
                    onChangeText={setImageDescription}
                  />
                  <TouchableOpacity style={styles.button} onPress={saveImageDescription}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => setEditingImageIndex(null)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          <TouchableOpacity style={styles.button} onPress={pickVideo} disabled={!canSubmit}>
            <Text style={styles.buttonText}>Add Video</Text>
          </TouchableOpacity>
          {videoUri && (
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode="cover"
                isLooping
                shouldPlay={false}
              />
              <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={[styles.saveButton, !canSubmit && styles.disabled]} onPress={handleSave} disabled={!canSubmit || uploading}>
            <Text style={styles.buttonText}>{uploading ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#00b3ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageScroll: {
    height: 150,
    marginBottom: 15,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#FFC107',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  videoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CharacterDetailScreen;