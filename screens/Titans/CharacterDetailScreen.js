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
  ImageBackground,
} from 'react-native';
import { Video, Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, storage, auth } from '../../lib/firebase';
import { collection, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
const RESTRICT_ACCESS = false;
const PLACEHOLDER_IMAGE = require('../../assets/Armor/PlaceHolder.jpg');

const CharacterDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'video' or 'audio'
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [imageName, setImageName] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('add'); // 'add', 'edit', 'view'
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, type: null, index: null });
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const member = route.params?.member;
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9;

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get('window').width);
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      setCanSubmit(RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true);
    };
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    const initialMode = route.params?.mode || 'add';
    setMode(initialMode);
    if (member && initialMode !== 'add') {
      setName(member.name || '');
      setDescription(member.description || '');
      setImages(member.images?.map(img => ({ uri: img.uri, name: img.description || '' })) || []);
      setMediaUri(member.mediaUri || member.videoUri || null);
      setMediaType(member.mediaType || (member.videoUri ? 'video' : null));
    }
    return () => authUnsub();
  }, [member, route.params?.mode]);

  useEffect(() => {
    let activeRef = null;
    if (mode === 'view' && mediaUri && mediaType === 'video' && videoRef.current) {
      activeRef = videoRef.current;
    } else if (mode === 'view' && mediaUri && mediaType === 'audio' && audioRef.current) {
      activeRef = audioRef.current;
    }
    if (activeRef) {
      activeRef.playAsync().then(() => {
        setIsPlaying(true);
        console.log(`${mediaType} started playing: ${mediaUri}`);
      }).catch((e) => {
        console.error(`${mediaType} play error:`, e);
        Alert.alert('Playback Error', `Failed to play ${mediaType}: ${e.message}`);
      });
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync().catch((e) => console.error('Video pause error:', e));
        videoRef.current.unloadAsync().catch((e) => console.error('Video unload error:', e));
      }
      if (audioRef.current) {
        audioRef.current.pauseAsync().catch((e) => console.error('Audio pause error:', e));
        audioRef.current.unloadAsync().catch((e) => console.error('Audio unload error:', e));
      }
    };
  }, [mode, mediaUri, mediaType]);

  const pickImage = async () => {
    if (!canSubmit || mode === 'view') return;
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
        const newImage = { uri: result.assets[0].uri, name: '' };
        setImages([...images, newImage]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const pickMedia = async () => {
    if (!canSubmit || mode === 'view') return;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media permissions to pick files!');
        return;
      }
      const audioStatus = await Audio.requestPermissionsAsync();
      if (!audioStatus.granted) {
        Alert.alert('Audio Permission Denied', 'We need audio permissions to play compatible media!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        const extension = uri.split('.').pop().toLowerCase();
        const isAudio = ['m4a', 'mp3'].includes(extension);
        const isVideo = ['mp4'].includes(extension);
        let fileUri = uri;
        if (uri.startsWith('data:')) {
          fileUri = await FileSystem.downloadAsync(
            uri,
            FileSystem.documentDirectory + 'temp.' + extension
          ).then(({ uri }) => uri).catch(e => {
            console.error('File conversion error:', e);
            return uri;
          });
        }
        if (videoRef.current) await videoRef.current.unloadAsync();
        if (audioRef.current) await audioRef.current.unloadAsync();
        setMediaUri(fileUri);
        setMediaType(isVideo ? 'video' : isAudio ? 'audio' : null);
        setIsPlaying(false);
        console.log(`Selected ${isVideo ? 'video' : isAudio ? 'audio' : 'file'}: ${fileUri}`);
        if (!isAudio && !isVideo) {
          Alert.alert('Note', 'Only .mp4, .m4a, and .mp3 files are playable. Other file types will be stored but not played.');
        }
      }
    } catch (error) {
      console.error('Media picker error:', error);
      Alert.alert('Error', 'Failed to pick media: ' + error.message);
    }
  };

  const deleteMedia = async (type, index = null) => {
    if (!canSubmit || mode === 'view') return;
    if (type === 'media' && mediaUri && mediaUri.startsWith('http')) await deleteOldMedia(mediaUri);
    if (type === 'image' && index !== null && images[index].uri.startsWith('http')) await deleteOldMedia(images[index].uri);
    if (type === 'media') {
      setMediaUri(null);
      setMediaType(null);
      if (videoRef.current) await videoRef.current.unloadAsync();
      if (audioRef.current) await audioRef.current.unloadAsync();
    } else if (type === 'image' && index !== null) {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    }
    setDeleteModal({ visible: false, type: null, index: null });
  };

  const uploadMedia = async (uri, type) => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    try {
      let blob;
      if (uri.startsWith('data:')) {
        const response = await fetch(uri);
        blob = await response.blob();
      } else {
        const response = await fetch(uri.startsWith('file://') ? 'file://' + encodeURI(uri.replace('file://', '')) : uri);
        blob = await response.blob();
      }
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const extension = uri.split('.').pop().toLowerCase();
      const path = `${type || 'media'}/${timestamp}_${random}.${extension}`;
      const mediaRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(mediaRef, blob);
      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', null, reject, resolve);
      });
      return await getDownloadURL(mediaRef);
    } catch (e) {
      console.error('Upload error:', e);
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
    if (!canSubmit || mode === 'view') return;
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
          return { uri: url, name: img.name };
        }
        return img;
      }));
      let mediaUrl = member?.mediaUri || member?.videoUri || null;
      let savedMediaType = member?.mediaType || (member?.videoUri ? 'video' : null);
      if (mediaUri && !mediaUri.startsWith('http')) {
        mediaUrl = await uploadMedia(mediaUri, mediaType);
        if (member?.mediaUri || member?.videoUri) await deleteOldMedia(member.mediaUri || member.videoUri);
      } else if (!mediaUri && (member?.mediaUri || member?.videoUri)) {
        await deleteOldMedia(member.mediaUri || member.videoUri);
      }
      const charData = { name: name.trim(), description: description.trim(), images: imageUrls, mediaUri: mediaUrl, mediaType: mediaType, clickable: true };
      if (member?.id) {
        await setDoc(doc(db, 'powerTitansMembers', member.id), charData, { merge: true });
        Alert.alert('Success', 'Character updated successfully!');
      } else {
        const charRef = await addDoc(collection(db, 'powerTitansMembers'), charData);
        charData.id = charRef.id;
        Alert.alert('Success', 'Character added successfully!');
      }
      setMode('view');
      if (mediaUrl && mediaType === 'video' && videoRef.current) {
        videoRef.current.playAsync().then(() => setIsPlaying(true)).catch((e) => console.error('Video play error:', e));
      } else if (mediaUrl && mediaType === 'audio' && audioRef.current) {
        audioRef.current.playAsync().then(() => setIsPlaying(true)).catch((e) => console.error('Audio play error:', e));
      }
    } catch (e) {
      console.error('Save error:', e.message);
      Alert.alert('Error', `Failed to save character: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageEdit = (index) => {
    if (mode === 'view') return;
    setEditingImageIndex(index);
    setImageName(images[index]?.name || '');
  };

  const saveImageName = () => {
    if (mode === 'view') return;
    const newImages = [...images];
    newImages[editingImageIndex].name = imageName;
    setImages(newImages);
    setEditingImageIndex(null);
    setImageName('');
  };

  const handleImagePress = (index) => {
    setPreviewImage({ ...images[index], index });
  };

  const renderImageCard = (img, index) => (
    <View key={index} style={styles.armorCont}>
      <TouchableOpacity
        style={[
          styles.card,
          mode !== 'view' ? styles.clickable('#00b3ff') : styles.notClickable,
          { width: cardWidth, height: SCREEN_HEIGHT * 0.7 },
          { backgroundColor: 'rgba(0, 179, 255, 0.1)', shadowColor: '#00b3ff', shadowOpacity: 0.8, shadowRadius: 10 },
        ]}
        onPress={() => handleImagePress(index)}
      >
        <Image source={img.uri.startsWith('http') ? { uri: img.uri } : img.uri} style={styles.armorImage} />
        <View style={styles.transparentOverlay} />
      </TouchableOpacity>
      {mode !== 'view' && (
        <View style={[styles.buttons, { width: cardWidth }]}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleImageEdit(index)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModal({ visible: true, type: 'image', index })}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPreviewCard = (img) => (
    <TouchableOpacity
      key={img.index}
      style={[
        styles.card,
        styles.clickable('#00b3ff'),
        { width: cardWidth, height: SCREEN_HEIGHT * 0.7 },
        { backgroundColor: 'rgba(0, 179, 255, 0.1)', shadowColor: '#00b3ff' },
      ]}
      onPress={() => setPreviewImage(null)}
    >
      <Image source={img.uri.startsWith('http') ? { uri: img.uri } : img.uri} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
    </TouchableOpacity>
  );

  const renderMediaPlayer = () => {
    if (!mediaUri) return null;
    const mediaStyle = {
      width: '100%',
      height: mediaType === 'video' ? 20 : 5,
      borderRadius: 10,
      // backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <View style={styles.mediaContainer}>
        {mediaType === 'video' ? (
          <Video
            ref={videoRef}
            source={{ uri: mediaUri }}
            style={mediaStyle}
            resizeMode="cover"
            isLooping
            shouldPlay={mode === 'view' && isPlaying}
            onPlaybackStatusUpdate={(status) => setIsPlaying(!!status.isPlaying)}
          />
        ) : mediaType === 'audio' ? (
          <View style={mediaStyle}>
            <Audio
              ref={audioRef}
              source={{ uri: mediaUri }}
              isLooping
              shouldPlay={mode === 'view' && isPlaying}
              onPlaybackStatusUpdate={(status) => setIsPlaying(!!status.isPlaying)}
            />
            <Text style={styles.mediaText}>Audio: {mediaUri.split('/').pop()}</Text>
          </View>
        ) : (
          <View style={mediaStyle}>
            <Text style={styles.mediaText}>File: {mediaUri.split('/').pop()}</Text>
          </View>
        )}
        {(mediaType === 'video' || mediaType === 'audio') && (
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        )}
        {mode !== 'view' && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModal({ visible: true, type: 'media' })}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const togglePlayPause = async () => {
    if (mediaType === 'video' && videoRef.current) {
      if (isPlaying) await videoRef.current.pauseAsync();
      else await videoRef.current.playAsync();
      setIsPlaying(!isPlaying);
    } else if (mediaType === 'audio' && audioRef.current) {
      if (isPlaying) await audioRef.current.pauseAsync();
      else await audioRef.current.playAsync();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Titans.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{name || 'Add/Edit Character'}</Text>
          </View>
          {mode !== 'view' && (
            <>
              <TextInput style={styles.input} placeholder="Character Name" value={name} onChangeText={setName} editable={canSubmit} />
              <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} editable={canSubmit} />
              <TouchableOpacity style={styles.button} onPress={pickImage} disabled={!canSubmit}>
                <Text style={styles.buttonText}>Add Image</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={cardWidth + 20}
              decelerationRate="fast"
            >
              {images.map(renderImageCard)}
            </ScrollView>
          </View>
          {mode !== 'view' && (
            <TouchableOpacity style={styles.button} onPress={pickMedia} disabled={!canSubmit}>
              <Text style={styles.buttonText}>Add Media</Text>
            </TouchableOpacity>
          )}
          {renderMediaPlayer()}
          {mode !== 'view' && (
            <TouchableOpacity style={[styles.saveButton, !canSubmit && styles.disabled]} onPress={handleSave} disabled={!canSubmit || uploading}>
              <Text style={styles.buttonText}>{uploading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          )}
          {mode === 'view' && <Text style={styles.descriptionText}>{description}</Text>}
          {editingImageIndex !== null && (
            <Modal transparent visible={true} onRequestClose={() => setEditingImageIndex(null)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Image Name"
                    value={imageName}
                    onChangeText={setImageName}
                  />
                  <TouchableOpacity style={styles.button} onPress={saveImageName}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => setEditingImageIndex(null)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {previewImage && (
            <Modal
              visible={!!previewImage}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setPreviewImage(null)}
            >
              <View style={styles.modalBackground}>
                <TouchableOpacity
                  style={styles.modalOuterContainer}
                  activeOpacity={1}
                  onPress={() => setPreviewImage(null)}
                >
                  <View style={styles.imageContainer}>
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.imageScrollContainer}
                      showsHorizontalScrollIndicator={false}
                      snapToAlignment="center"
                      snapToInterval={cardWidth}
                      decelerationRate="fast"
                    >
                      {renderPreviewCard(previewImage)}
                    </ScrollView>
                  </View>
                  <View style={styles.previewAboutSection}>
                    <Text style={styles.previewName}>{previewImage.name || 'No name available'}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setPreviewImage(null)}>
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          <Modal
            visible={deleteModal.visible}
            transparent
            animationType="slide"
            onRequestClose={() => setDeleteModal({ visible: false, type: null, index: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {deleteModal.type === 'media' ? 'Delete media?' : `Delete image ${deleteModal.index + 1}?`}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, type: null, index: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteMedia(deleteModal.type, deleteModal.index)}
                  >
                    <Text style={styles.modalDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingTop: 50 },
  backButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 5 },
  backButtonText: { fontSize: 24, color: '#fff' },
  scrollContainer: { paddingBottom: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 5, marginBottom: 10, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#555', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  saveButton: { backgroundColor: '#00b3ff', padding: 15, borderRadius: 5, alignItems: 'center' },
  disabled: { backgroundColor: '#ccc', opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  imageContainer: { width: '100%', paddingVertical: 20, backgroundColor: '#111', paddingLeft: 15 },
  imageScrollContainer: { flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' },
  armorCont: { marginRight: 20, alignItems: 'center' },
  card: { height: SCREEN_HEIGHT * 0.7, borderRadius: 15, overflow: 'hidden', elevation: 5, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  clickable: (borderColor) => ({ borderWidth: 2, borderColor: borderColor || 'rgba(255, 255, 255, 0.1)' }),
  notClickable: { opacity: 0.8 },
  armorImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 1 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { backgroundColor: '#FFC107', padding: 8, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#F44336', padding: 8, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  mediaContainer: { marginBottom: 10 },
  mediaText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  playButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 5, borderRadius: 5, alignSelf: 'center', marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center' },
  descriptionText: { color: '#fff', fontSize: 14, textAlign: 'center', marginTop: 5 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalOuterContainer: { width: '80%', height: '70%', justifyContent: 'center', alignItems: 'center' },
  previewAboutSection: { marginTop: 15, padding: 10, backgroundColor: '#222', borderRadius: 10, width: '100%' },
  previewName: { fontSize: 14, textAlign: 'center', marginTop: 5, color: '#fff' },
  closeButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, alignSelf: 'center' },
  modalText: { fontSize: 18, color: '#fff', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  modalCancel: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  modalCancelText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  modalDelete: { backgroundColor: '#F44336', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  modalDeleteText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
});

export default CharacterDetailScreen;