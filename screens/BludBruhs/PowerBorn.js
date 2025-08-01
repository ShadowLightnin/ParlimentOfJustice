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
import { FlatList } from 'react-native';
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
const isDesktop = SCREEN_WIDTH > 600;
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

const initialMembers = [
  // { name: 'Sam', codename: 'Void Walker', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/Sam.jpg'), borderColor: '#800080', tempKey: 'init1' },
  // { name: 'Cole', codename: 'Cruiser', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/ColeR.jpg'), borderColor: '#800080', tempKey: 'init2' },
  // { name: 'Taylor', codename: 'Stellar', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/Taylor.jpg'), borderColor: '#800080', tempKey: 'init3' },
  // { name: 'James', codename: 'Shadowmind', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/JamesBb.jpg'), borderColor: '#800080', tempKey: 'init4' },
  // { name: 'Tanner', codename: 'Wolff', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/TannerBb.jpg'), borderColor: '#800080', tempKey: 'init5' },
  // { name: 'Adin', codename: 'Aotearoa', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/Adin.jpg'), borderColor: '#800080', tempKey: 'init6' },
  // { name: 'Justin Platt', codename: 'Echo Wood', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/Justin2.jpg'), borderColor: '#800080', tempKey: 'init7' },
  // { name: 'Zack Dustin', codename: 'Carved Echo', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/Zack2_cleanup.jpg'), borderColor: '#800080', tempKey: 'init8' },
  // { name: 'Joseph', codename: 'Technoman', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/JosephD.jpg'), borderColor: '#800080', tempKey: 'init9' },
];

const fixedMembers = [
  { name: '', codename: 'Ranger Squad', screen: 'RangerSquad', clickable: true, image: require('../../assets/BackGround/RangerSquad.jpg'), borderColor: '#800080', tempKey: 'fixed1' },
  { name: '', codename: 'Montrose Manor', screen: 'MontroseManorTab', clickable: true, image: require('../../assets/TheMontroseManor.jpg'), borderColor: '#800080', tempKey: 'fixed2' },
];

let backgroundSound = null;

const playBackgroundMusic = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/ThunderBorn.m4a'),
        { shouldPlay: false, isLooping: true, volume: 0.7 }
      );
      backgroundSound = sound;
      await backgroundSound.playAsync();
      console.log('Background music started: ThunderBorn.m4a');
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
    }
  } else {
    try {
      await backgroundSound.playAsync();
      console.log('Background music resumed');
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
};

const pauseBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.pauseAsync();
      console.log('Background music paused');
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
      console.log('Background music stopped and unloaded');
    } catch (error) {
      console.error('Error stopping/unloading sound:', error);
    }
  }
};

const PowerBorn = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState(initialMembers);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const unsubscribeRef = useRef(null);
  const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
  const RESTRICT_ACCESS = false;

  useEffect(() => {
    const checkAuthAndFetch = () => {
      const user = auth.currentUser;
      const canModify = RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true;
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (user) {
        unsubscribeRef.current = onSnapshot(collection(db, 'powerBornMembers'), (snapshot) => {
          const fetchedMembers = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || 'Unnamed Character',
            description: doc.data().description || '',
            screen: 'ThunderCharacterDetail',
            clickable: true,
            image: doc.data().images?.[0]?.uri ? { uri: doc.data().images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
            borderColor: '#800080',
            images: doc.data().images || [],
            mediaUri: doc.data().mediaUri || null,
            mediaType: doc.data().mediaType || null,
          }));
          setMembers(prevMembers => [...prevMembers.filter(m => !m.id), ...fetchedMembers]);
          console.log('Fetched PowerBorn members:', fetchedMembers);
        }, (error) => {
          console.error('Error fetching members:', error);
          Alert.alert('Error', 'Failed to load characters from Firebase due to permissions.');
        });
      } else {
        setMembers([...initialMembers]);
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
        const updatedMember = navigation.getState().routes.find(r => r.params?.member)?.params?.member;
        if (updatedMember) {
          setMembers(prevMembers => {
            const memberExists = prevMembers.some(m => m.id === updatedMember.id);
            if (memberExists) {
              return prevMembers.map(m =>
                m.id === updatedMember.id
                  ? {
                      ...m,
                      name: updatedMember.name,
                      description: updatedMember.description,
                      images: updatedMember.images,
                      image: updatedMember.images?.[0]?.uri ? { uri: updatedMember.images[0].uri } : m.image,
                      mediaUri: updatedMember.mediaUri,
                      mediaType: updatedMember.mediaType,
                    }
                  : m
              );
            } else {
              return [
                ...prevMembers.filter(m => m.screen !== 'ThunderCharacterDetail' || !m.id),
                {
                  ...updatedMember,
                  screen: 'ThunderCharacterDetail',
                  image: updatedMember.images?.[0]?.uri ? { uri: updatedMember.images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
                  borderColor: '#800080',
                },
              ];
            }
          });
          navigation.setParams({ member: undefined });
        }
      });
      return () => {
        unsubscribe();
        if (navigation.getState().routes[navigation.getState().index].name === 'PowerBorn') {
          stopBackgroundMusic();
        }
      };
    }, [navigation])
  );

  const handleMemberPress = async (member) => {
    if (member.clickable && member.screen) {
      await stopBackgroundMusic();
      navigation.navigate(member.screen, { member, mode: 'view', isYourUniverse: false });
    }
  };

  const handleEdit = (member) => {
    if (member.clickable && member.screen) {
      navigation.navigate(member.screen, { member, mode: 'edit', isYourUniverse: false });
    }
  };

  const confirmDelete = async (memberId) => {
    if (!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))) {
      Alert.alert('Access Denied', 'Only authorized users can delete characters.');
      return;
    }
    try {
      const member = members.find(m => m.id === memberId);
      if (!member || !member.id) {
        Alert.alert('Error', 'This character cannot be deleted (no ID found).');
        return;
      }
      const memberRef = doc(db, 'powerBornMembers', memberId);
      const mediaDeletionPromises = [];
      member.images.forEach(img => {
        if (img.uri && img.uri.startsWith('http')) {
          const path = decodeURIComponent(img.uri.split('/o/')[1].split('?')[0]);
          mediaDeletionPromises.push(deleteObject(storageRef(storage, path)).catch(e => {
            if (e.code !== 'storage/object-not-found') throw e;
          }));
        }
      });
      if (member.mediaUri && member.mediaUri.startsWith('http')) {
        const path = decodeURIComponent(member.mediaUri.split('/o/')[1].split('?')[0]);
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

  const renderMemberCard = ({ item, isFixed = false }) => (
    <View key={item.id ? `firebase-${item.id}` : `temp-${item.tempKey}`} style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          item.clickable ? styles.clickable(item.borderColor) : styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(item)}
        disabled={!item.clickable}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.transparentOverlay} />
        <Text style={styles.name}>{isFixed ? item.codename : item.name}</Text>
      </TouchableOpacity>
      {!isFixed && !item.tempKey && (
        <View style={[styles.buttons, { width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width }]}>
          <TouchableOpacity
            style={[styles.editButton, (!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))) && styles.disabled]}
            onPress={() => handleEdit(item)}
            disabled={!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, (!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))) && styles.disabled]}
            onPress={() => setDeleteModal({ visible: true, member: item })}
            disabled={!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/BackGround/Bludbruh2.jpg')} style={styles.background}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={async () => { await stopBackgroundMusic(); navigation.navigate('Home'); }} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Thunder Born</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => navigation.navigate('ThunderCharacterDetail', { mode: 'add', isYourUniverse: false })} style={styles.plusButton}>
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
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
            <Text style={styles.categoryHeader}>Characters</Text>
            <FlatList
              horizontal
              data={members.filter(m => !m.tempKey?.startsWith('fixed'))}
              renderItem={({ item }) => renderMemberCard({ item })}
              keyExtractor={(item) => item.id ? `firebase-${item.id}` : `temp-${item.tempKey}`}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.scrollContainer}
            />
            <Text style={styles.categoryHeader}>Teams</Text>
            <FlatList
              horizontal
              data={fixedMembers}
              renderItem={({ item }) => renderMemberCard({ item, isFixed: true })}
              keyExtractor={(item) => `temp-${item.tempKey}`}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.scrollContainer}
            />
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
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  scrollView: { flex: 1 },
  container: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    paddingTop: 40, 
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.564)',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: 10 },
  backText: { fontSize: 18, color: '#800080', fontWeight: 'bold' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    textShadowColor: '#800080',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 20,
    flex: 1,
    textAlign: 'center',
  },
  plusButton: { padding: 10 },
  plusText: { fontSize: 24, fontWeight: 'bold', color: '#800080' },
  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 5 },
  musicButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8, marginHorizontal: 10 },
  musicButtonText: { fontSize: 12, fontWeight: 'bold', color: '#800080' },
  scrollWrapper: { width: SCREEN_WIDTH, marginTop: 20 },
  scrollContainer: { 
    flexDirection: 'row', 
    flexGrow: 1, 
    width: 'auto', 
    paddingVertical: verticalSpacing, 
    alignItems: 'center',
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'left',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
    paddingHorizontal: 10,
  },
  cardContainer: { marginHorizontal: 10, alignItems: 'center' },
  card: { borderRadius: 10, overflow: 'hidden', elevation: 5, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  clickable: (borderColor) => ({ 
    borderWidth: 2, 
    borderColor: borderColor || '#800080', 
  }),
  disabledCard: { opacity: 0.8, backgroundColor: '#555' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 1 },
  name: { position: 'absolute', bottom: 10, left: 10, fontSize: 16, color: 'white', fontWeight: 'bold' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { backgroundColor: '#FFC107', padding: 5, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#F44336', padding: 5, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  disabled: { backgroundColor: '#ccc', opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%' },
  modalText: { fontSize: 18, color: '#000', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  modalCancel: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  modalCancelText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  modalDelete: { backgroundColor: '#F44336', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  modalDeleteText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
});

export default PowerBorn;