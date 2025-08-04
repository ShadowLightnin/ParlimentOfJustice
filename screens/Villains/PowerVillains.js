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

const PowerVillains = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const unsubscribeRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
  const RESTRICT_ACCESS = false;

  // Fetch and sync villain members from Firebase
  useEffect(() => {
    const checkAuthAndFetch = () => {
      const user = auth.currentUser;
      const canModify = RESTRICT_ACCESS ? (user && ALLOWED_EMAILS.includes(user.email)) : true;
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (user) {
        unsubscribeRef.current = onSnapshot(collection(db, 'powerVillainsMembers'), (snapshot) => {
          const fetchedMembers = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || 'Unnamed Villain',
            description: doc.data().description || '',
            screen: 'VillainCharacterDetail',
            clickable: true,
            image: doc.data().images?.[0]?.uri ? { uri: doc.data().images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
            borderColor: 'red',
            images: doc.data().images || [],
            mediaUri: doc.data().mediaUri || null,
            mediaType: doc.data().mediaType || null,
          }));
          setMembers(fetchedMembers);
          console.log('Fetched PowerVillains members:', fetchedMembers);
        }, (error) => {
          console.error('Error fetching members:', error);
          Alert.alert('Error', 'Failed to load villains from Firebase due to permissions.');
        });
      } else {
        setMembers([]);
      }
    };

    checkAuthAndFetch();
    const unsubscribeAuth = auth.onAuthStateChanged(checkAuthAndFetch);

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeAuth();
    };
  }, []);

  // Handle new/updated members from navigation params
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        const newMember = navigation.getState().routes.find(r => r.params?.member)?.params?.member;
        if (newMember && newMember.id) {
          setMembers(prevMembers => {
            const memberExists = prevMembers.some(m => m.id === newMember.id);
            if (memberExists) {
              return prevMembers.map(m =>
                m.id === newMember.id
                  ? {
                      ...m,
                      name: newMember.name,
                      description: newMember.description,
                      screen: 'VillainCharacterDetail',
                      images: newMember.images,
                      image: newMember.images?.[0]?.uri ? { uri: newMember.images[0].uri } : m.image,
                      mediaUri: newMember.mediaUri,
                      mediaType: newMember.mediaType,
                      clickable: true,
                    }
                  : m
              );
            } else {
              return [
                ...prevMembers,
                {
                  ...newMember,
                  screen: 'VillainCharacterDetail',
                  image: newMember.images?.[0]?.uri ? { uri: newMember.images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
                  borderColor: 'red',
                  clickable: true,
                },
              ];
            }
          });
          navigation.setParams({ member: undefined });
        }
      });
      return unsubscribe;
    }, [navigation])
  );

  // Navigate to character detail screen
  const handleMemberPress = (member) => {
    if (member.clickable && member.screen) {
      navigation.navigate('VillainCharacterDetail', { member, mode: 'view' });
    }
  };

  // Navigate to edit mode
  const handleEdit = (member) => {
    if (member.clickable && member.screen) {
      navigation.navigate('VillainCharacterDetail', { member, mode: 'edit' });
    }
  };

  // Delete a villain with confirmation
  const confirmDelete = async (memberId) => {
    if (!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))) {
      Alert.alert('Access Denied', 'Only authorized users can delete villains.');
      return;
    }
    try {
      const member = members.find(m => m.id === memberId);
      if (!member || !member.id) {
        Alert.alert('Error', 'This villain cannot be deleted.');
        return;
      }
      const memberRef = doc(db, 'powerVillainsMembers', memberId);
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
      Alert.alert('Success', 'Villain deleted successfully!');
    } catch (e) {
      console.error('Delete error:', e.message);
      Alert.alert('Error', `Failed to delete villain: ${e.message}. Please try again or contact support.`);
    }
  };

  const renderMemberCard = ({ item }) => (
    <View key={item.id} style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          item.clickable && item.borderColor ? styles.clickable(item.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleMemberPress(item)}
        disabled={!item.clickable}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.transparentOverlay} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.buttons}>
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
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/BackGround/VillainsHub.jpg')} style={styles.background}>
      <ScrollView style={styles.scrollContainerStyle} contentContainerStyle={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('Villains')} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Villains of Zardionine</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('VillainCharacterDetail', { mode: 'add' })} style={styles.plusButton}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.scrollWrapper}>
          <FlatList
            horizontal
            data={members}
            renderItem={renderMemberCard}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: horizontalSpacing }]}
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
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  scrollContainerStyle: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  container: { paddingTop: 40, paddingBottom: 20, alignItems: 'center' },
  headerWrapper: { 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingTop: 10 
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  backText: { fontSize: 18, color: '#ff1c1c', fontWeight: 'bold' },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#630404', 
    textAlign: 'center', 
    textShadowColor: '#ff1c1c', 
    textShadowRadius: 15, 
    flex: 1 
  },
  plusButton: { padding: 10 },
  plusText: { fontSize: 24, fontWeight: 'bold', color: '#ff1c1c' },
  scrollWrapper: { width: SCREEN_WIDTH, marginTop: 20 },
  scrollContainer: { 
    flexDirection: 'row', 
    flexGrow: 1, 
    width: 'auto', 
    paddingVertical: verticalSpacing, 
    alignItems: 'center' 
  },
  cardContainer: { marginHorizontal: 10, alignItems: 'center' },
  card: { 
    borderRadius: 10, 
    overflow: 'hidden', 
    elevation: 5, 
    backgroundColor: 'rgba(0, 0, 0, 0.7)' 
  },
  clickable: (borderColor) => ({ 
    borderColor: borderColor || 'red', 
    borderWidth: 2, 
  }),
  notClickable: { opacity: 0.5 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 1 },
  name: { 
    position: 'absolute', 
    bottom: 10, 
    left: 10, 
    fontSize: 16, 
    color: 'white', 
    fontWeight: 'bold' 
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 10,
  },
  editButton: { backgroundColor: '#FFC107', padding: 5, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#F44336', padding: 5, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  disabled: { backgroundColor: '#ccc', opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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

export default PowerVillains;