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
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, storage, auth } from '../../lib/firebase';
import { collection, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
const RESTRICT_ACCESS = true;
const PLACEHOLDER_IMAGE = require('../../assets/Armor/PlaceHolder.jpg');

const VillainCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [imageName, setImageName] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('add');
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
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await user.getIdToken(true);
          console.log('Checking auth:', {
            user: `User: ${user.email}, UID: ${user.uid}`,
            isAllowed: RESTRICT_ACCESS ? user && ALLOWED_EMAILS.includes(user.email) : true,
            allowedEmails: ALLOWED_EMAILS,
          });
          const isAllowed = RESTRICT_ACCESS ? user && ALLOWED_EMAILS.includes(user.email) : true;
          setCanSubmit(isAllowed);
          if (!isAllowed) {
            console.warn(`User ${user.email} not in ALLOWED_EMAILS. Uploads restricted.`);
          }
        } catch (e) {
          console.error('Token refresh error:', e.message);
          Alert.alert('Authentication Error', 'Failed to refresh authentication token.');
        }
      } else {
        console.warn('No authenticated user found. Uploads may fail.');
        Alert.alert('Authentication Required', 'Please log in to save changes.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        setCanSubmit(false);
      }
    };

    const fetchCharacterData = async () => {
      if (member?.id) {
        try {
          const docRef = doc(db, 'powerVillainsMembers', member.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Fetched villain data from Firestore:', data);
            setName(data.name || '');
            setDescription(data.description || '');
            setImages(data.images?.map(img => ({ uri: img.uri, name: img.name || '' })) || []);
            setMediaUri(data.mediaUri || null);
            setMediaType(data.mediaType || null);
            setIsPlaying(false);
          } else {
            console.warn('Villain not found in Firestore:', member.id);
          }
        } catch (e) {
          console.error('Error fetching villain data:', e.message, e.stack);
          Alert.alert('Error', `Failed to fetch villain data: ${e.message}`);
        }
      } else if (member && mode !== 'add') {
        console.log('Loading member data:', {
          id: member.id,
          name: member.name,
          images: member.images?.length,
          mediaUri: member.mediaUri,
          mediaType: member.mediaType,
        });
        setName(member.name || '');
        setDescription(member.description || '');
        setImages(member.images?.map(img => ({ uri: img.uri, name: img.name || '' })) || []);
        setMediaUri(member.mediaUri || null);
        setMediaType(member.mediaType || null);
        setIsPlaying(false);
      }
    };

    checkAuth();
    fetchCharacterData();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    const initialMode = route.params?.mode || 'add';
    setMode(initialMode);
    return () => {
      authUnsub();
      if (videoRef.current) {
        videoRef.current.unloadAsync().catch((e) => console.error('Video unload on cleanup:', e));
      }
    };
  }, [member, route.params?.mode]);

  useEffect(() => {
    if (mode === 'view' && mediaUri && mediaType === 'video' && videoRef.current && isPlaying) {
      videoRef.current.playAsync().then(() => {
        console.log('Video started playing:', mediaUri);
      }).catch((e) => {
        console.error('Video play error:', e.message, e.stack);
        Alert.alert('Playback Error', `Failed to play video: ${e.message}`);
      });
    }
  }, [mediaUri, mediaType, mode, isPlaying]);

  const pickImage = async () => {
    if (!canSubmit || mode === 'view') {
      console.log('Pick image blocked:', { canSubmit, mode });
      Alert.alert('Access Denied', 'Cannot pick images in this mode or without authorization.');
      return;
    }
    try {
      console.log('Launching image picker with mediaTypes: images');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Image picker permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to pick images!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: Platform.OS !== 'web',
        aspect: [1, 1],
        quality: 0.5,
      });
      console.log('Image picker result:', result);
      if (!result.canceled && result.assets) {
        const newImage = { uri: result.assets[0].uri, name: '' };
        setImages([...images, newImage]);
        console.log('Image selected:', newImage.uri);
      } else {
        console.log('Image picker canceled or no assets returned');
      }
    } catch (error) {
      console.error('Image picker error:', error.message, error.stack);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const pickMedia = async () => {
    if (!canSubmit || mode === 'view') {
      console.log('Pick media blocked:', { canSubmit, mode });
      Alert.alert('Access Denied', 'Cannot pick media in this mode or without authorization.');
      return;
    }
    try {
      console.log('Launching media picker with mediaTypes: videos');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media picker permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media permissions to pick videos!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        allowsEditing: false,
      });
      console.log('Media picker result:', result);
      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        let extension;
        const validExtensions = ['mp4'];

        if (uri.startsWith('data:')) {
          const mimeTypeMatch = uri.match(/^data:([a-z]+\/[a-z0-9\-\+]+);base64,/i);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : null;
          console.log('Parsed MIME type:', mimeType, 'URI:', uri);
          if (!mimeType) {
            console.warn('Invalid data URI format');
            Alert.alert('Error', 'Invalid file format selected. Please choose a valid .mp4 file.');
            return;
          }
          if (mimeType !== 'video/mp4') {
            console.warn(`Unsupported MIME type: ${mimeType}`);
            Alert.alert('Error', 'Only .mp4 files are supported.');
            return;
          }
          extension = 'mp4';
        } else {
          extension = uri.split('.').pop().toLowerCase();
        }

        if (!validExtensions.includes(extension)) {
          console.warn(`Unsupported file extension: ${extension}`);
          Alert.alert('Error', 'Only .mp4 files are supported.');
          return;
        }

        let fileUri = uri;
        if (uri.startsWith('data:') && Platform.OS !== 'web') {
          try {
            fileUri = await FileSystem.downloadAsync(
              uri,
              FileSystem.documentDirectory + `temp.mp4`
            ).then(({ uri }) => uri);
            console.log('Converted data URI to file:', fileUri);
          } catch (e) {
            console.error('FileSystem.downloadAsync error:', e.message, e.stack);
            Alert.alert('Error', `Failed to process video file: ${e.message}`);
            return;
          }
        }

        if (videoRef.current) await videoRef.current.unloadAsync().catch((e) => console.error('Video unload error:', e));
        setMediaUri(fileUri);
        setMediaType('video');
        setIsPlaying(false);
        console.log(`Selected video: ${fileUri}`);
      } else {
        console.log('Media picker canceled or no assets returned');
      }
    } catch (error) {
      console.error('Media picker error:', error.message, error.stack);
      Alert.alert('Error', `Failed to pick video: ${error.message}`);
    }
  };

  const uploadMedia = async (uri, type) => {
    if (!auth.currentUser) {
      console.error('No authenticated user. Upload aborted.');
      throw new Error('User not authenticated');
    }
    console.log('Current user:', auth.currentUser.email || 'None');
    try {
      console.log(`Preparing to upload ${type} with URI: ${uri}`);
      let blob;
      let extension;

      if (uri.startsWith('data:')) {
        const mimeType = uri.match(/^data:([a-z]+\/[a-z0-9\-\+]+);base64,/i)?.[1];
        if (!mimeType) throw new Error('Invalid data URI format');
        const mimeToExt = { 'image/jpeg': 'jpg', 'image/png': 'png', 'video/mp4': 'mp4' };
        extension = mimeToExt[mimeType];
        if (!extension) throw new Error(`Unsupported MIME type: ${mimeType}`);
        const response = await fetch(uri);
        if (!response.ok) throw new Error(`Fetch failed for data URI: ${response.statusText}`);
        blob = await response.blob();
      } else {
        const fetchUri = uri.startsWith('file://') ? uri : encodeURI(uri);
        console.log(`Fetching URI: ${fetchUri}`);
        const response = await fetch(fetchUri);
        if (!response.ok) throw new Error(`Fetch failed for URI ${fetchUri}: ${response.statusText}`);
        blob = await response.blob();
        extension = uri.split('.').pop().toLowerCase();
      }

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const path = `villains/${timestamp}_${random}.${extension}`;
      console.log(`Uploading to Firebase Storage path: ${path}`);
      const mediaRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(mediaRef, blob);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timed out after 30 seconds')), 30000);
      });
      await Promise.race([
        new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              console.log(`Uploading ${type}: ${(snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2)}%`);
            },
            (error) => {
              console.error('Upload task error:', error.message, error.stack);
              if (error.code === 'storage/unauthorized') {
                reject(new Error('You do not have permission to upload files. Please sign in with an authorized account.'));
              } else {
                reject(error);
              }
            },
            resolve
          );
        }),
        timeoutPromise,
      ]);
      const downloadURL = await getDownloadURL(mediaRef);
      console.log(`Uploaded ${type} to: ${downloadURL}`);
      return downloadURL;
    } catch (e) {
      console.error('Upload error:', e.message, e.stack);
      throw new Error(`Upload failed: ${e.message}`);
    }
  };

  const deleteOldMedia = async (url) => {
    if (!url || url === 'placeholder') return;
    try {
      const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      await deleteObject(storageRef(storage, path));
      console.log(`Deleted media: ${url}`);
    } catch (e) {
      if (e.code !== 'storage/object-not-found') {
        console.error('Delete media error:', e.message, e.stack);
        Alert.alert('Warning', `Failed to delete media: ${e.message}. Continuing with operation.`);
      }
    }
  };

  const deleteMedia = async (type, index) => {
    try {
      if (type === 'image' && index !== null) {
        const image = images[index];
        if (image.uri.startsWith('http')) {
          await deleteOldMedia(image.uri);
        }
        setImages(images.filter((_, i) => i !== index));
        console.log(`Deleted image at index ${index}`);
      } else if (type === 'media') {
        if (mediaUri && mediaUri.startsWith('http')) {
          await deleteOldMedia(mediaUri);
        }
        if (videoRef.current) {
          await videoRef.current.unloadAsync().catch((e) => console.error('Video unload error:', e));
        }
        setMediaUri(null);
        setMediaType(null);
        setIsPlaying(false);
        console.log('Deleted video');
      }
      setDeleteModal({ visible: false, type: null, index: null });
    } catch (e) {
      console.error('Delete error:', e.message, e.stack);
      Alert.alert('Error', `Failed to delete ${type}: ${e.message}`);
    }
  };

  const hasChanges = () => {
    if (!member) {
      return name.trim() || description.trim() || images.length > 0 || mediaUri;
    }
    return (
      name.trim() !== (member.name || '') ||
      description.trim() !== (member.description || '') ||
      JSON.stringify(images) !== JSON.stringify(member.images || []) ||
      mediaUri !== (member.mediaUri || null) ||
      mediaType !== (member.mediaType || null)
    );
  };

  const saveChanges = async () => {
    if (!canSubmit || mode === 'view') {
      console.log('Save blocked:', { canSubmit, mode });
      Alert.alert('Access Denied', 'Cannot save in this mode or without authorization.');
      return false;
    }
    if (!name.trim()) {
      console.log('Save blocked: no name provided');
      Alert.alert('Error', 'Please provide a villain name.');
      return false;
    }
    if (!auth.currentUser) {
      console.log('Save blocked: no authenticated user');
      Alert.alert('Authentication Required', 'Please log in to save changes.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      return false;
    }
    setUploading(true);
    try {
      console.log('Starting save operation:', { name: name.trim(), description: description.trim(), images: images.length, mediaUri, mediaType });
      const imageUrls = await Promise.all(images.map(async (img, index) => {
        if (!img.uri.startsWith('http')) {
          console.log(`Uploading image ${index + 1}: ${img.uri}`);
          const url = await uploadMedia(img.uri, 'image');
          if (member?.images?.[index]?.uri && member.images[index].uri.startsWith('http')) {
            await deleteOldMedia(member.images[index].uri);
          }
          return { uri: url, name: img.name || '' };
        }
        return { uri: img.uri, name: img.name || '' };
      }));
      let mediaUrl = mediaUri && mediaUri.startsWith('http') ? mediaUri : member?.mediaUri || null;
      let savedMediaType = mediaType || member?.mediaType || null;
      if (mediaUri && !mediaUri.startsWith('http')) {
        console.log(`Uploading video: ${mediaUri}`);
        mediaUrl = await uploadMedia(mediaUri, 'video');
        if (member?.mediaUri) {
          await deleteOldMedia(member.mediaUri);
        }
        savedMediaType = 'video';
      } else if (!mediaUri && member?.mediaUri) {
        console.log('Clearing video URI as no new video was selected');
        await deleteOldMedia(member.mediaUri);
        mediaUrl = null;
        savedMediaType = null;
      }
      const charData = {
        name: name.trim(),
        description: description.trim(),
        images: imageUrls,
        mediaUri: mediaUrl,
        mediaType: savedMediaType,
        clickable: true,
        screen: 'VillainCharacterDetail',
      };
      console.log('Saving villain data:', charData);
      let charId = member?.id;
      if (charId) {
        console.log(`Updating villain with ID: ${charId}`);
        await setDoc(doc(db, 'powerVillainsMembers', charId), charData, { merge: true });
        console.log('Villain updated:', { id: charId, name: charData.name, images: charData.images.length, mediaUri: charData.mediaUri });
      } else {
        console.log('Adding new villain');
        const charRef = await addDoc(collection(db, 'powerVillainsMembers'), charData);
        charId = charRef.id;
        console.log('Villain added:', { id: charId, name: charData.name, images: charData.images.length, mediaUri: charData.mediaUri });
      }
      Alert.alert('Success', `Villain ${charId ? 'updated' : 'added'} successfully!`);
      setMode('view');
      setImages(imageUrls);
      setMediaUri(mediaUrl);
      setMediaType(savedMediaType);
      setIsPlaying(false);
      return { ...charData, id: charId };
    } catch (e) {
      console.error('Save error:', e.message, e.stack);
      Alert.alert('Error', `Failed to save villain: ${e.message}`);
      return false;
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
    newImages[editingImageIndex].name = imageName.trim();
    setImages(newImages);
    setEditingImageIndex(null);
    setImageName('');
    console.log('Image name saved locally:', { index: editingImageIndex, name: imageName.trim() });
  };

  const handleImagePress = (index) => {
    setPreviewImage({ ...images[index], index });
  };

  const handleBackPress = async () => {
    console.log('Back button pressed, checking for changes:', { name, description, images: images.length, mediaUri, mediaType });
    let savedData = null;
    if (hasChanges() && canSubmit && mode !== 'view') {
      console.log('Changes detected, attempting to save before navigating back');
      savedData = await saveChanges();
      if (!savedData) {
        console.warn('Save failed, navigating back with unsaved changes');
      }
    } else {
      console.log('No changes detected or save not allowed, proceeding to navigate back');
    }
    if (videoRef.current) {
      try {
        await videoRef.current.pauseAsync();
        console.log('Video paused on back press');
      } catch (e) {
        console.error('Video stop error on back press:', e.message, e.stack);
      }
    }
    setIsPlaying(false);
    navigation.navigate('PowerVillains', {
      isPlaying: false,
      member: {
        ...member,
        id: savedData ? savedData.id : member?.id,
        name: savedData ? savedData.name : name.trim(),
        description: savedData ? savedData.description : description.trim(),
        images: savedData ? savedData.images : images,
        mediaUri: savedData ? savedData.mediaUri : mediaUri,
        mediaType: savedData ? savedData.mediaType : mediaType,
        clickable: true,
        screen: 'VillainCharacterDetail',
      },
    });
  };

  const renderImageCard = (img, index) => (
    <View key={index} style={styles.armorCont}>
      <TouchableOpacity
        style={[
          styles.card,
          mode !== 'view' ? styles.clickable('#ff1c1c') : styles.notClickable,
          { width: cardWidth, height: SCREEN_HEIGHT * 0.65, backgroundColor: 'rgba(99, 4, 4, 0.1)', shadowColor: '#ff1c1c', shadowOpacity: 0.8, shadowRadius: 10 },
        ]}
        onPress={() => handleImagePress(index)}
      >
        <Image
          source={img.uri.startsWith('http') ? { uri: img.uri } : img.uri}
          style={styles.armorImage}
          onError={(e) => {
            console.error('Image load error:', e.nativeEvent.error, 'URI:', img.uri);
            setImages(images.map((image, i) => i === index ? { ...image, uri: PLACEHOLDER_IMAGE } : image));
          }}
        />
        {img.name ? (
          <View style={styles.imageNameContainer}>
            <Text style={styles.imageNameText} numberOfLines={1} ellipsizeMode="tail">
              {img.name}
            </Text>
          </View>
        ) : null}
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
      style={{
        ...styles.card,
        borderWidth: 2,
        borderColor: '#ff1c1c',
        backgroundColor: 'rgba(99, 4, 4, 0.1)',
        shadowColor: '#ff1c1c',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        width: cardWidth,
        height: SCREEN_HEIGHT * 0.65,
      }}
      onPress={() => setPreviewImage(null)}
    >
      <Image
        source={img.uri && img.uri !== PLACEHOLDER_IMAGE ? { uri: img.uri } : PLACEHOLDER_IMAGE}
        style={styles.armorImage}
        onError={(e) => {
          console.error('Preview image load error:', e.nativeEvent.error, 'URI:', img.uri);
          setPreviewImage({ ...img, uri: null });
        }}
      />
      {img.name ? (
        <View style={styles.imageNameContainer}>
          <Text style={styles.imageNameText} numberOfLines={1} ellipsizeMode="tail">
            {img.name}
          </Text>
        </View>
      ) : null}
      <View style={styles.transparentOverlay} />
    </TouchableOpacity>
  );

  const renderMediaPlayer = () => {
    if (!mediaUri) return null;
    const mediaStyle = {
      width: '100%',
      height: 200,
      borderRadius: 10,
      backgroundColor: '#333',
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
            onPlaybackStatusUpdate={(status) => {
              console.log('Video playback status:', status);
              setIsPlaying(!!status.isPlaying);
            }}
          />
        ) : (
          <View style={mediaStyle}>
            <Text style={styles.mediaText}>File: {mediaUri.split('/').pop()}</Text>
          </View>
        )}
        {mediaType === 'video' && (
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
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
        console.log(`Video ${isPlaying ? 'paused' : 'playing'}: ${mediaUri}`);
      } catch (e) {
        console.error('Video toggle error:', e.message, e.stack);
        Alert.alert('Playback Error', `Failed to toggle video: ${e.message}`);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/VillainsHub.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{name || 'Add/Edit Villain'}</Text>
          </View>
          {mode !== 'view' && (
            <>
              <TextInput style={styles.input} placeholder="Villain Name" value={name} onChangeText={setName} editable={canSubmit} />
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
              <Text style={styles.buttonText}>Add Video</Text>
            </TouchableOpacity>
          )}
          {renderMediaPlayer()}
          {mode !== 'view' && (
            <TouchableOpacity style={[styles.saveButton, !canSubmit && styles.disabled]} onPress={saveChanges} disabled={!canSubmit || uploading}>
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
                  {deleteModal.type === 'media' ? 'Delete video?' : `Delete image ${deleteModal.index + 1}?`}
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
  backButtonText: { fontSize: 24, color: '#ff1c1c', fontWeight: 'bold' },
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff1c1c', textAlign: 'center', flex: 1, textShadowColor: '#a11a1a', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 10 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 5, marginBottom: 10, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#630404', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  saveButton: { backgroundColor: '#630404', padding: 15, borderRadius: 5, alignItems: 'center' },
  disabled: { backgroundColor: '#ccc', opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  imageContainer: { width: '100%', paddingVertical: 20, backgroundColor: '#111', paddingLeft: 15 },
  imageScrollContainer: { flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' },
  armorCont: { marginRight: 20, alignItems: 'center' },
  card: { height: SCREEN_HEIGHT * 0.65, borderRadius: 15, overflow: 'hidden', elevation: 5, backgroundColor: 'rgba(99, 4, 4, 0.1)' },
  clickable: (borderColor) => ({ borderWidth: 2, borderColor: borderColor || '#ff1c1c', shadowColor: borderColor || '#ff1c1c', shadowOpacity: 0.8, shadowRadius: 10 }),
  notClickable: { opacity: 0.8 },
  armorImage: { width: '100%', height: '100%', resizeMode: 'contain', padding: 10 },
  imageNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  imageNameText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 1 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, width: '100%' },
  editButton: { backgroundColor: '#FFC107', padding: 8, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#F44336', padding: 8, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  mediaContainer: { marginBottom: 10 },
  mediaText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  playButton: { backgroundColor: '#630404', padding: 5, borderRadius: 5, alignSelf: 'center', marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center' },
  descriptionText: { color: '#fff', fontSize: 14, textAlign: 'center', marginTop: 5 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalOuterContainer: { width: '80%', height: '70%', justifyContent: 'center', alignItems: 'center' },
  previewAboutSection: { marginTop: 15, padding: 10, backgroundColor: '#222', borderRadius: 10, width: '100%' },
  previewName: { fontSize: 14, textAlign: 'center', marginTop: 5, color: '#fff' },
  closeButton: { backgroundColor: '#630404', padding: 10, borderRadius: 5, alignSelf: 'center' },
  modalText: { fontSize: 18, color: '#fff', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  modalCancel: { backgroundColor: '#630404', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  modalCancelText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  modalDelete: { backgroundColor: '#F44336', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  modalDeleteText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
});

export default VillainCharacterDetail;