import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import SamsArmory from './SamsArmory';

let SCREEN_WIDTH, SCREEN_HEIGHT;
try {
  const { width, height } = Dimensions.get('window');
  SCREEN_WIDTH = width;
  SCREEN_HEIGHT = height;
} catch (error) {
  console.error('Error getting dimensions:', error);
  SCREEN_WIDTH = 360;
  SCREEN_HEIGHT = 640;
}

const members = [
  // { id: 'member-1', name: 'MIA', codename: '', screen: '', clickable: true, image: require('../../assets/Armor/PlaceHolder.jpg'), hardcoded: true },
];

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const rows = Math.ceil(members.length / columns);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com", "samuelp.woodwell@gmail.com"];
const RESTRICT_ACCESS = true;

const RollingThunderScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState(members);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  useEffect(() => {
    console.log('Current user:', auth.currentUser?.email, 'Can modify:', canMod);
    const validatedMembers = members.map((member, index) => ({
      ...member,
      id: member.id || `hardcoded-${index + 1}`,
      hardcoded: true,
    }));
    console.log('Validated Members:', validatedMembers.map(m => ({ id: m.id, name: m.name, image: m.image ? 'hardcoded' : m.imageUrl })));
    setTeamMembers(validatedMembers);

    const unsub = onSnapshot(collection(db, 'members'), (snap) => {
      if (snap.empty) {
        console.log('No members found in Firestore');
        setTeamMembers(validatedMembers);
        return;
      }
      const dynamicMembers = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#00FFFF',
        hardcoded: false,
        collectionPath: 'members',
      }));
      console.log('Fetched dynamic members:', dynamicMembers.map(m => ({ id: m.id, name: m.name || m.codename, imageUrl: m.imageUrl })));

      const filteredDynamic = dynamicMembers.filter(
        (dynamic) => !validatedMembers.some(
          (member) => member.id === dynamic.id || member.name === (dynamic.name || dynamic.codename)
        )
      );
      console.log('Filtered dynamic members:', filteredDynamic.map(m => ({ id: m.id, name: m.name || m.codename, imageUrl: m.imageUrl })));

      const combinedMap = new Map();
      [...validatedMembers, ...filteredDynamic].forEach((member) => {
        combinedMap.set(member.id, member);
      });
      const combined = Array.from(combinedMap.values());
      console.log('Combined members:', combined.map(m => ({ id: m.id, name: m.name || m.codename, imageUrl: m.imageUrl })));
      setTeamMembers(combined);
    }, (e) => {
      console.error('Firestore error:', e.code, e.message);
      Alert.alert('Error', `Failed to fetch members: ${e.message}`);
    });
    return () => unsub();
  }, []);

  const goToChat = () => {
    console.log('Navigating to TeamChat:', new Date().toISOString());
    try {
      navigation.navigate('TeamChat');
    } catch (error) {
      console.error('Navigation error to TeamChat:', error);
    }
  };

  const handleMemberPress = (member) => {
    if (!member?.clickable) {
      console.log('Card not clickable:', member?.name);
      return;
    }
    console.log('Card pressed:', member.name, 'Screen:', member.screen, 'Image URL:', member.imageUrl);
    if (member.screen && member.hardcoded) {
      try {
        navigation.navigate(member.screen);
      } catch (error) {
        console.error('Navigation error to', member.screen, ':', error);
      }
    } else {
      setPreviewMember(member);
    }
  };

  const confirmDelete = async (memberId) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete members.');
      return;
    }
    try {
      const memberItem = teamMembers.find(m => m.id === memberId);
      if (memberItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded members!');
        return;
      }
      const memberRef = doc(db, 'members', memberId);
      const snap = await getDoc(memberRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Member not found');
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== 'placeholder') {
        let path = '';
        try {
          console.log('Raw imageUrl:', imageUrl); // Debug raw URL
          if (typeof imageUrl !== 'string' || !imageUrl.includes('/o/')) {
            console.warn('Invalid imageUrl format:', imageUrl);
          } else {
            const urlParts = imageUrl.split('/o/');
            path = decodeURIComponent(urlParts[1].split('?')[0]);
            console.log('Attempting to delete image:', path);
            await deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== 'storage/object-not-found') {
                throw e; // Rethrow errors except "not found"
              }
              console.warn('Image not found in storage:', path);
            });
            console.log('Image deleted or not found:', path);
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Member will still be deleted.`);
        }
      } else {
        console.log('No image to delete or imageUrl is placeholder:', imageUrl);
      }
      await deleteDoc(memberRef);
      console.log('Member deleted from Firestore:', memberId);
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      setDeleteModal({ visible: false, member: null });
      Alert.alert('Success', 'Member deleted successfully!');
    } catch (e) {
      console.error('Delete member error:', e.message);
      Alert.alert('Error', `Failed to delete member: ${e.message}`);
    }
  };

  const renderMemberCard = (member) => {
    try {
      const imageSource = member.image || 
        (member.imageUrl && member.imageUrl !== 'placeholder' 
          ? { uri: member.imageUrl } 
          : require('../../assets/Armor/PlaceHolder.jpg'));
      console.log('Rendering card for:', member.name, 'Image source:', member.image ? 'hardcoded' : member.imageUrl);
      return (
        <View key={member.id || member.name} style={styles.memberCont}>
          <TouchableOpacity
            style={[
              styles.card,
              { width: cardSize, height: cardSize * cardHeightMultiplier },
              member.clickable && member.borderColor ? styles.clickable(member.borderColor) : styles.disabledCard,
            ]}
            onPress={() => handleMemberPress(member)}
            disabled={!member.clickable}
          >
            <Image
              source={imageSource}
              style={styles.characterImage}
              resizeMode="cover"
              key={member.imageUrl || member.id}
              onError={(e) => console.error('Image load error:', member.name, e.nativeEvent.error)}
            />
            <View style={styles.transparentOverlay} />
            <Text style={styles.codename}>{member.codename || ''}</Text>
            <Text style={styles.name}>{member.name}</Text>
          </TouchableOpacity>
          {!member.hardcoded && (
            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => setPreviewMember({ ...member, isEditing: true })}
                style={[styles.edit, !canMod && styles.disabled]}
                disabled={!canMod}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteModal({ visible: true, member: { id: member.id, name: member.name || member.codename || 'Unknown' } })}
                style={[styles.delete, !canMod && styles.disabled]}
                disabled={!canMod}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    } catch (error) {
      console.error('Error rendering card:', member.name, error);
      return null;
    }
  };

  const renderPreviewCard = (member) => {
    try {
      const imageSource = member.image || 
        (member.imageUrl && member.imageUrl !== 'placeholder' 
          ? { uri: member.imageUrl } 
          : require('../../assets/Armor/PlaceHolder.jpg'));
      console.log('Rendering preview for:', member.name, 'Image source:', member.image ? 'hardcoded' : member.imageUrl);
      return (
        <TouchableOpacity
          key={member.id || member.name}
          style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(member.borderColor || '#00FFFF')]}
          onPress={() => {
            console.log('Closing preview modal');
            setPreviewMember(null);
          }}
        >
          <Image
            source={imageSource}
            style={styles.previewImage}
            resizeMode="cover"
            key={member.imageUrl || member.id}
            onError={(e) => console.error('Preview image load error:', member.name, e.nativeEvent.error)}
          />
          <View style={styles.transparentOverlay} />
          <Text style={styles.cardName}>
            © {member.codename || member.name || 'Unknown'}; Samuel Woodwell
          </Text>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering preview card:', member.name, error);
      return null;
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/RollingThunder.jpg')}
      style={styles.background}
      onError={(e) => console.error('Background image load error:', e.nativeEvent.error)}
    >
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('Back button pressed:', new Date().toISOString());
              navigation.goBack();
            }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>{"Rolling Thunder:\nThunder Born"}</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Array.from({ length: Math.ceil(teamMembers.length / columns) }).map((_, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const memberIndex = rowIndex * columns + colIndex;
                const member = teamMembers[memberIndex];

                if (!member) return (
                  <View
                    key={colIndex}
                    style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
                  />
                );

                return renderMemberCard(member);
              })}
            </View>
          ))}
          <SamsArmory
            collectionPath="members"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            friend={teamMembers}
            setFriend={setTeamMembers}
            hardcodedFriend={members}
            editingFriend={previewMember?.isEditing ? previewMember : null}
            setEditingFriend={setPreviewMember}
          />
        </ScrollView>

        {previewMember && !previewMember.isEditing && (
          <Modal
            visible={!!previewMember}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewMember(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewMember(null);
                }}
              >
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={isDesktop ? SCREEN_WIDTH * 0.15 : SCREEN_WIDTH * 0.6}
                    decelerationRate="fast"
                    centerContent={true}
                  >
                    {renderPreviewCard(previewMember)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewCodename}>{previewMember?.codename || 'No Codename'}</Text>
                  <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewMember?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewMember(null);
                    }}
                    style={styles.close}
                  >
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
          onRequestClose={() => setDeleteModal({ visible: false, member: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.member?.name || ''}" and its image?`}</Text>
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
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fffb00',
    textAlign: 'center',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 20,
    flex: 1,
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 24,
    color: '#00FFFF',
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  memberCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#fffb00',
    shadowOpacity: 1.5,
    shadowRadius: 20,
    elevation: 5,
  },
  disabledCard: {
    shadowColor: 'transparent',
    backgroundColor: '#444',
  },
  clickable: (borderColor) => ({
    borderWidth: 2,
    borderColor: borderColor || '#00FFFF',
  }),
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: cardSize,
    marginTop: 10,
  },
  edit: {
    backgroundColor: '#FFC107',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    paddingLeft: 10,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.15 : SCREEN_WIDTH * 0.6,
    height: isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.4,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    width: '100%',
  },
  previewCodename: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FFFF',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
  previewDesc: {
    fontSize: 14,
    color: '#fff7f7',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
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

export default RollingThunderScreen;