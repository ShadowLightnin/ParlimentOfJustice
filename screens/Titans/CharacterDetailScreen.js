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
  const audioRef = useRef(null); // Will hold Audio.Sound instance
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

  // Configure Audio for background playback
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch((e) => console.error('Audio mode setup error:', e));
  }, []);

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
      console.log('Checking auth:', user ? `User: ${user.email}` : 'No authenticated user');
      const isAllowed = RESTRICT_ACCESS ? user && ALLOWED_EMAILS.includes(user.email) : true;
      setCanSubmit(isAllowed);
      if (!user) {
        console.warn('No authenticated user found. Uploads may fail.');
      } else if (!isAllowed) {
        console.warn(`User ${user.email} not in ALLOWED_EMAILS. Uploads restricted.`);
      }
    };
    checkAuth();
    const authUnsub = auth.onAuthStateChanged(checkAuth);
    const initialMode = route.params?.mode || 'add';
    setMode(initialMode);
    if (member && initialMode !== 'add') {
      console.log('Loading member data:', { id: member.id, name: member.name, images: member.images?.length, mediaUri: member.mediaUri || member.videoUri });
      setName(member.name || '');
      setDescription(member.description || '');
      setImages(member.images?.map(img => ({ uri: img.uri, name: img.description || '' })) || []);
      setMediaUri(member.mediaUri || member.videoUri || null);
      setMediaType(member.mediaType || (member.videoUri ? 'video' : null));
      // Restore playback state if provided
      setIsPlaying(route.params?.isPlaying || false);
    }
    return () => authUnsub();
  }, [member, route.params?.mode, route.params?.isPlaying]);

  useEffect(() => {
    let activeRef = null;
    const loadAudio = async () => {
      if (mediaUri && mediaType === 'audio' && !audioRef.current) {
        try {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: mediaUri });
          audioRef.current = sound;
          console.log('Audio loaded in useEffect:', mediaUri);
          // Resume playback if isPlaying is true
          if (isPlaying) {
            await sound.playAsync();
            console.log('Resumed audio playback:', mediaUri);
          }
        } catch (e) {
          console.error('Audio load error in useEffect:', e.message, e.stack);
          Alert.alert('Error', `Failed to load audio: ${e.message}`);
          return;
        }
      }
    };

    loadAudio();

    if (mode === 'view' && mediaUri && mediaType === 'video' && videoRef.current) {
      activeRef = videoRef.current;
      if (isPlaying) {
        activeRef.playAsync().then(() => {
          setIsPlaying(true);
          console.log('Video started playing:', mediaUri);
        }).catch((e) => {
          console.error('Video play error:', e.message, e.stack);
          Alert.alert('Playback Error', `Failed to play video: ${e.message}`);
        });
      }
    } else if (mode === 'view' && mediaUri && mediaType === 'audio' && audioRef.current) {
      activeRef = audioRef.current;
      audioRef.current.getStatusAsync().then((status) => {
        if (status.isLoaded && isPlaying) {
          activeRef.playAsync().then(() => {
            setIsPlaying(true);
            console.log('Audio started playing:', mediaUri);
          }).catch((e) => {
            console.error('Audio play error:', e.message, e.stack);
            Alert.alert('Playback Error', `Failed to play audio: ${e.message}`);
          });
        } else if (!status.isLoaded) {
          console.error('Audio not loaded for playback:', mediaUri);
          Alert.alert('Playback Error', 'Audio is not loaded.');
        }
      }).catch((e) => {
        console.error('Audio status error:', e.message, e.stack);
      });
    }

    return () => {
      // Do not pause or unload media to allow background playback
      console.log('Component unmounting, keeping media active:', { mediaUri, mediaType, isPlaying });
    };
  }, [mode, mediaUri, mediaType, isPlaying]);

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
      console.log('Launching media picker with mediaTypes: all');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media picker permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media permissions to pick files!');
        return;
      }
      const audioStatus = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', audioStatus.status);
      if (!audioStatus.granted) {
        Alert.alert('Audio Permission Denied', 'We need audio permissions to play compatible media!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'all',
        allowsEditing: false,
      });
      console.log('Media picker result:', result);
      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        let extension;
        const validExtensions = ['jpg', 'jpeg', 'png', 'mp4', 'm4a', 'mp3'];

        if (uri.startsWith('data:')) {
          const mimeTypeMatch = uri.match(/^data:([a-z]+\/[a-z0-9\-\+]+);base64,/i);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : null;
          console.log('Parsed MIME type:', mimeType, 'URI:', uri);
          if (!mimeType) {
            console.warn('Invalid data URI format');
            Alert.alert('Error', 'Invalid file format selected. Please choose a valid .jpg, .jpeg, .png, .mp4, .m4a, or .mp3 file.');
            return;
          }
          const mimeToExt = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'video/mp4': 'mp4',
            'audio/mpeg': 'mp3',
            'audio/mp4': 'm4a',
            'audio/m4a': 'm4a',
            'audio/x-m4a': 'm4a',
          };
          extension = mimeToExt[mimeType];
          if (!extension) {
            console.warn(`Unsupported MIME type: ${mimeType}`);
            Alert.alert('Error', `Unsupported file type: ${mimeType}. Only .jpg, .jpeg, .png, .mp4, .m4a, and .mp3 are supported.`);
            return;
          }
        } else {
          extension = uri.split('.').pop().toLowerCase();
        }

        if (!validExtensions.includes(extension)) {
          console.warn(`Unsupported file extension: ${extension}`);
          Alert.alert('Error', 'Only .jpg, .jpeg, .png, .mp4, .m4a, and .mp3 files are supported.');
          return;
        }

        const isAudio = ['m4a', 'mp3'].includes(extension);
        const isVideo = ['mp4'].includes(extension);
        let fileUri = uri;

        if (uri.startsWith('data:') && Platform.OS !== 'web') {
          try {
            fileUri = await FileSystem.downloadAsync(
              uri,
              FileSystem.documentDirectory + `temp.${extension}`
            ).then(({ uri }) => uri);
            console.log('Converted data URI to file:', fileUri);
          } catch (e) {
            console.error('FileSystem.downloadAsync error:', e.message, e.stack);
            Alert.alert('Error', `Failed to process media file: ${e.message}`);
            return;
          }
        }

        if (videoRef.current) await videoRef.current.unloadAsync().catch((e) => console.error('Video unload error:', e));
        if (audioRef.current) {
          await audioRef.current.unloadAsync().catch((e) => console.error('Audio unload error:', e));
          audioRef.current = null;
        }
        if (isAudio) {
          const sound = new Audio.Sound();
          try {
            await sound.loadAsync({ uri: fileUri });
            audioRef.current = sound;
            console.log('Audio loaded:', fileUri);
          } catch (e) {
            console.error('Audio load error:', e.message, e.stack);
            Alert.alert('Error', `Failed to load audio: ${e.message}`);
            return;
          }
        }
        setMediaUri(fileUri);
        setMediaType(isVideo ? 'video' : isAudio ? 'audio' : null);
        setIsPlaying(false);
        console.log(`Selected ${isVideo ? 'video' : isAudio ? 'audio' : 'file'}: ${fileUri}`);
        if (!isAudio && !isVideo) {
          Alert.alert('Note', 'Only .mp4, .m4a, and .mp3 files are playable. Other file types will be stored but not played.');
        }
      } else {
        console.log('Media picker canceled or no assets returned');
      }
    } catch (error) {
      console.error('Media picker error:', error.message, error.stack);
      Alert.alert('Error', `Failed to pick media: ${error.message}`);
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
        const mimeToExt = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'video/mp4': 'mp4',
          'audio/mpeg': 'mp3',
          'audio/mp4': 'm4a',
          'audio/m4a': 'm4a',
          'audio/x-m4a': 'm4a',
        };
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
      const path = `characters/${timestamp}_${random}.${extension}`;
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
              reject(error);
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
        if (audioRef.current) {
          await audioRef.current.unloadAsync().catch((e) => console.error('Audio unload error:', e));
          audioRef.current = null;
        }
        setMediaUri(null);
        setMediaType(null);
        setIsPlaying(false);
        console.log('Deleted media');
      }
      setDeleteModal({ visible: false, type: null, index: null });
    } catch (e) {
      console.error('Delete error:', e.message, e.stack);
      Alert.alert('Error', `Failed to delete ${type}: ${e.message}`);
    }
  };

  const handleSave = async () => {
    if (!canSubmit || mode === 'view') {
      console.log('Save blocked:', { canSubmit, mode });
      Alert.alert('Access Denied', 'Cannot save in this mode or without authorization.');
      return;
    }
    if (!name.trim()) {
      console.log('Save blocked: no name provided');
      Alert.alert('Error', 'Please provide a character name.');
      return;
    }
    if (!auth.currentUser) {
      console.log('Save blocked: no authenticated user');
      Alert.alert('Authentication Required', 'Please log in to save changes.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    setUploading(true);
    try {
      console.log('Starting save operation:', { name: name.trim(), images: images.length, mediaUri, mediaType });
      const imageUrls = await Promise.all(images.map(async (img, index) => {
        if (!img.uri.startsWith('http')) {
          console.log(`Uploading image ${index + 1}: ${img.uri}`);
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
        console.log(`Uploading media: ${mediaUri}`);
        mediaUrl = await uploadMedia(mediaUri, mediaType || 'media');
        if (member?.mediaUri || member?.videoUri) await deleteOldMedia(member.mediaUri || member.videoUri);
        savedMediaType = mediaType;
      } else if (!mediaUri && (member?.mediaUri || member?.videoUri)) {
        await deleteOldMedia(member.mediaUri || member.videoUri);
      }
      const charData = { name: name.trim(), description: description.trim(), images: imageUrls, mediaUri: mediaUrl, mediaType: savedMediaType, clickable: true };
      if (member?.id) {
        console.log(`Updating character with ID: ${member.id}`);
        await setDoc(doc(db, 'powerTitansMembers', member.id), charData, { merge: true });
        console.log('Character updated:', { id: member.id, name: charData.name, images: charData.images.length });
        Alert.alert('Success', 'Character updated successfully!');
      } else {
        console.log('Adding new character');
        const charRef = await addDoc(collection(db, 'powerTitansMembers'), charData);
        charData.id = charRef.id;
        console.log('Character added:', { id: charRef.id, name: charData.name, images: charData.images.length });
        Alert.alert('Success', 'Character added successfully!');
      }
      setMode('view');
      if (mediaUrl && mediaType === 'video' && videoRef.current) {
        videoRef.current.playAsync().then(() => setIsPlaying(true)).catch((e) => console.error('Video play error:', e));
      } else if (mediaUrl && mediaType === 'audio' && audioRef.current) {
        audioRef.current.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            audioRef.current.playAsync().then(() => setIsPlaying(true)).catch((e) => console.error('Audio play error:', e));
          } else {
            console.error('Audio not loaded after save:', mediaUrl);
            Alert.alert('Playback Error', 'Audio is not loaded.');
          }
        }).catch((e) => console.error('Audio status error:', e));
      }
    } catch (e) {
      console.error('Save error:', e.message, e.stack);
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
          { width: cardWidth, height: SCREEN_HEIGHT * 0.7, backgroundColor: 'rgba(0, 179, 255, 0.1)', shadowColor: '#00b3ff', shadowOpacity: 0.8, shadowRadius: 10 },
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
        borderColor: '#00b3ff',
        width: cardWidth,
        height: SCREEN_HEIGHT * 0.7,
        backgroundColor: 'rgba(0, 179, 255, 0.1)',
        shadowColor: '#00b3ff',
        shadowOpacity: 0.8,
        shadowRadius: 10,
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
      <View style={styles.transparentOverlay} />
    </TouchableOpacity>
  );

  const renderMediaPlayer = () => {
    if (!mediaUri) return null;
    const mediaStyle = {
      width: '100%',
      height: mediaType === 'video' ? 200 : 50,
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
        ) : mediaType === 'audio' ? (
          <View style={mediaStyle}>
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
    } else if (mediaType === 'audio' && audioRef.current) {
      try {
        const status = await audioRef.current.getStatusAsync();
        if (!status.isLoaded) {
          console.error('Audio not loaded for playback:', mediaUri);
          Alert.alert('Playback Error', 'Audio is not loaded.');
          return;
        }
        if (isPlaying) {
          await audioRef.current.pauseAsync();
        } else {
          await audioRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
        console.log(`Audio ${isPlaying ? 'paused' : 'playing'}: ${mediaUri}`);
      } catch (e) {
        console.error('Audio toggle error:', e.message, e.stack);
        Alert.alert('Playback Error', `Failed to toggle audio: ${e.message}`);
      }
    }
  };

  // Override back button to pass playback state
  const handleBackPress = () => {
    navigation.navigate('PowerTitans', { // Replace with actual screen name, e.g., 'CharacterList'
      isPlaying,
      mediaUri,
      mediaType,
      member,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Titans.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
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