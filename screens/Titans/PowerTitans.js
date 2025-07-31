import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { db, auth, storage } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = SCREEN_WIDTH > 600 ? 40 : 20;

const initialMembers = [
  // { name: 'Spencer McNeil', codename: 'Annihilator', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/PowerSpencer.jpg'), borderColor: 'purple', tempKey: 'init1' },
  // { name: 'Azure Briggs', codename: 'Mediateir', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/Azure3.jpg'), borderColor: 'purple', tempKey: 'init2' },
  // { name: 'Jared McNeil', codename: 'Spector', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/JaredLegacy.jpg'), borderColor: 'purple', tempKey: 'init3' },
  // { name: 'Will Cummings', codename: 'Night Hawk', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/PowerWill.jpg'), borderColor: 'purple', tempKey: 'init4' },
  // { name: 'Ben Briggs', codename: 'Nuscus', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/BenLegacy.jpg'), borderColor: 'purple', tempKey: 'init5' },
  // { name: 'Jennifer McNeil', codename: 'Kintsugi', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/JenniferLegacy.jpg'), borderColor: 'purple', tempKey: 'init6' },
  // { name: 'Emma Cummings', codename: 'Kintsunera', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/EmmaLegacy.jpg'), borderColor: 'purple', tempKey: 'init7' },
];

let backgroundSound = null;

const playBackgroundMusic = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/FireAndAsh.mp4'),
        { shouldPlay: true, isLooping: true, volume: 0.7 }
      );
      backgroundSound = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
    }
  } else if (backgroundSound) {
    try {
      await backgroundSound.playAsync();
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }
};

const pauseBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.pauseAsync();
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
    } catch (error) {
      console.error('Error stopping/unloading sound:', error);
    }
  }
};

const PowerTitans = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState(initialMembers);
  const unsubscribeRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
  const RESTRICT_ACCESS = false;

  useEffect(() => {
    const checkAuthAndFetch = () => {
      const user = auth.currentUser;
      const canModify = RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true;
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (user) {
        unsubscribeRef.current = onSnapshot(collection(db, 'powerTitansMembers'), (snapshot) => {
          const fetchedMembers = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || 'Unnamed Character',
            description: doc.data().description || '',
            screen: 'CharacterDetail',
            clickable: true,
            image: doc.data().images?.[0]?.uri ? { uri: doc.data().images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
            borderColor: 'purple',
            images: doc.data().images || [],
            videoUri: doc.data().videoUri || null,
          }));
          setMembers(prevMembers => [...prevMembers.filter(m => !m.id), ...fetchedMembers]);
        }, (error) => {
          console.error('Error fetching members:', error);
          Alert.alert('Error', 'Failed to load characters from Firebase due to permissions.');
        });
      } else {
        setMembers(initialMembers);
      }
    };

    checkAuthAndFetch();
    const unsubscribeAuth = auth.onAuthStateChanged(checkAuthAndFetch);

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeAuth();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        const newMember = navigation.getState().routes.find(r => r.params?.newMember)?.params?.newMember;
        if (newMember) {
          setMembers(prevMembers => [
            ...prevMembers.filter(m => m.screen !== 'CharacterDetail' || m.id !== newMember.id),
            { ...newMember, screen: 'CharacterDetail', image: newMember.images?.[0]?.uri ? { uri: newMember.images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'), borderColor: 'purple' },
          ]);
          navigation.setParams({ newMember: undefined });
        }
      });
      playBackgroundMusic();
      return () => {
        unsubscribe();
        if (navigation.getState().routes[navigation.getState().index].name === 'PowerTitans') {
          stopBackgroundMusic();
        }
      };
    }, [navigation])
  );

  const handleMemberPress = (member) => {
    if (member.clickable && member.screen) {
      navigation.navigate(member.screen, { member, mode: 'view' });
    }
  };

  const handleEdit = (member) => {
    if (member.clickable && member.screen) {
      navigation.navigate(member.screen, { member, mode: 'edit' });
    }
  };

  const confirmDelete = async (memberId) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete characters.');
      return;
    }
    try {
      const member = members.find(m => m.id === memberId);
      if (!member || !member.id) {
        Alert.alert('Error', 'This character cannot be deleted (no ID found).');
        return;
      }
      const memberRef = doc(db, 'powerTitansMembers', memberId);
      const mediaDeletionPromises = [];
      member.images.forEach(img => {
        if (img.uri && img.uri.startsWith('http')) {
          const path = decodeURIComponent(img.uri.split('/o/')[1].split('?')[0]);
          mediaDeletionPromises.push(deleteObject(storageRef(storage, path)).catch(e => {
            if (e.code !== 'storage/object-not-found') throw e;
          }));
        }
      });
      if (member.videoUri && member.videoUri.startsWith('http')) {
        const path = decodeURIComponent(member.videoUri.split('/o/')[1].split('?')[0]);
        mediaDeletionPromises.push(deleteObject(storageRef(storage, path)).catch(e => {
          if (e.code !== 'storage/object-not-found') throw e;
        }));
      }
      await Promise.all(mediaDeletionPromises);
      await deleteDoc(memberRef);
      setMembers(prevMembers => prevMembers.filter(m => m.id !== memberId));
      setDeleteModal({ visible: false, member: null });
      Alert.alert('Success', 'Character deleted successfully!');
    } catch (e) {
      console.error('Delete error:', e.message);
      Alert.alert('Error', `Failed to delete character: ${e.message}. Please try again or contact support.`);
    }
  };

  const renderMemberCard = (member) => (
    <View key={member.id ? `firebase-${member.id}` : `temp-${member.tempKey}`} style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: SCREEN_WIDTH > 600 ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: SCREEN_WIDTH > 600 ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          member.clickable && member.borderColor ? styles.clickable(member.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
      >
        <Image source={member.image} style={styles.image} />
        <View style={styles.transparentOverlay} />
        <Text style={styles.name}>{member.name}</Text>
      </TouchableOpacity>
      {!member.tempKey && ( // Only show edit/delete for Firebase members
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.editButton, (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) && styles.disabled]}
            onPress={() => handleEdit(member)}
            disabled={!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) && styles.disabled]}
            onPress={() => setDeleteModal({ visible: true, member: member })}
            disabled={!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const goToEclipse = async () => {
    if (backgroundSound) {
      try {
        await backgroundSound.stopAsync();
        await backgroundSound.unloadAsync();
        backgroundSound = null;
      } catch (error) {
        console.error('Error stopping sound for eclipse:', error);
      }
    }
    navigation.navigate('Eclipse');
  };

  return (
    <ImageBackground source={require('../../assets/BackGround/Titans.jpg')} style={styles.background}>
      <ScrollView style={styles.scrollContainerStyle} contentContainerStyle={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={async () => { await stopBackgroundMusic(); navigation.navigate('Home'); }} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Titans</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CharacterDetail', { mode: 'add' })} style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToEclipse} style={styles.eclipseButton}>
            <Image source={require('../../assets/BackGround/Eclipse.jpg')} style={styles.eclipseImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playBackgroundMusic}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseBackgroundMusic}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.scrollWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={[styles.scrollContainer, { gap: horizontalSpacing }]}>
            {members.map(renderMemberCard)}
          </ScrollView>
        </View>
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, member: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.member?.name || ''}" and its associated media?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, member: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => deleteModal.member && confirmDelete(deleteModal.member.id)}
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  scrollContainerStyle: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  container: { paddingTop: 40, paddingBottom: 20 },
  headerWrapper: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 },
  backButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', textShadowColor: '#800080', textShadowRadius: 15, flex: 1, paddingLeft: 25 },
  eclipseButton: { padding: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  eclipseImage: { width: 60, height: 60, resizeMode: 'contain' },
  plusButton: { padding: 10 },
  plusText: { fontSize: 24, fontWeight: 'bold', color: '#00b3ff' },
  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 5 },
  musicButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8, marginHorizontal: 10 },
  musicButtonText: { fontSize: 12, fontWeight: 'bold', color: '#00b3ff' },
  scrollWrapper: { width: SCREEN_WIDTH, flex: 1 },
  scrollContainer: { flexDirection: 'row', flexGrow: 1, width: 'auto', paddingVertical: 20 },
  cardContainer: { marginHorizontal: 10, alignItems: 'center' },
  card: { borderRadius: 10, overflow: 'hidden', elevation: 5, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  clickable: (borderColor) => ({ borderColor: borderColor || 'purple', borderWidth: 2 }),
  notClickable: { opacity: 0.5 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 1 },
  name: { position: 'absolute', bottom: 10, left: 10, fontSize: 16, color: 'white', fontWeight: 'bold' },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH > 600 ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 10,
  },
  editButton: { backgroundColor: '#FFC107', padding: 5, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#F44336', padding: 5, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  disabled: { backgroundColor: '#ccc', opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalCancel: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PowerTitans;