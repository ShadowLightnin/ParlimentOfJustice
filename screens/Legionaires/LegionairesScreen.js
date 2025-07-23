import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Ensure this path is correct
import { memberCategories } from './LegionairesMembers';
import legionImages from './LegionairesImages';
import LegionFriends from './LegionFriends';
import { Audio } from 'expo-av'; // Import expo-av for audio

// 🎯 Initialize with hardcoded members and fetch dynamic ones
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 7 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 20 : 10;

export const LegionairesScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [members, setMembers] = useState(memberCategories); // Start with hardcoded
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const [sound, setSound] = useState(null); // State to manage audio object

  useEffect(() => {
    // 🎯 Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, 'LegionairesMembers'), (snapshot) => {
      const fetchedMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const updatedMembers = memberCategories.map(category => ({
        ...category,
        members: [
          ...category.members.filter(m => legionImages[m.name]?.hardcoded || !fetchedMembers.some(fm => fm.name === m.name)),
          ...fetchedMembers.filter(m => m.category === category.category && !m.hardcoded)
        ]
      }));
      setMembers(updatedMembers);
    }, (error) => {
      console.error('Error fetching members:', error);
    });

    // Load and play background music
    async function loadSound() {
      console.log('Loading Sound at:', new Date().toISOString());
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/BlueBloodsExtend.mp4'), // Replace with your audio file path
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
      console.log('Playing Sound at:', new Date().toISOString());
      await sound.playAsync();
    }
    loadSound();

    return () => {
      unsubscribe();
      if (sound) {
        console.log('Unloading Sound at:', new Date().toISOString());
        sound.unloadAsync();
      }
    };
  }, []);

  const goToChat = () => {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
    }
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = (member) => {
    if (member.clickable) {
      if (member.screen && member.screen !== '') {
        navigation.navigate(member.screen);
      } else {
        setPreviewMember(member);
      }
    }
  };

  const renderMemberCard = (member) => (
    <View key={member.name} style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize * cardHeightMultiplier,
            marginHorizontal: horizontalSpacing / 2,
            ...(member.clickable ? styles.clickableCard : styles.disabledCard),
          },
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
      >
        {member.image && (
          <>
            <Image source={member.image} style={styles.characterImage} />
            <View style={styles.transparentOverlay} />
          </>
        )}
        <Text style={styles.codename}>{member.codename || ''}</Text>
        <Text style={styles.name}>{member.name}</Text>
      </TouchableOpacity>
      {!legionImages[member.name]?.hardcoded && !member.hardcoded && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingMember(member)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              if (member.id) {
                setDeleteModal({ visible: true, member });
              }
            }}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => {
        setPreviewMember(null);
      }}
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const confirmDelete = async (memberId) => {
    try {
      const memberToDelete = members
        .flatMap(category => category.members)
        .find(m => m.id === memberId);
      if (!memberToDelete) {
        console.error('Member not found for id:', memberId);
        Alert.alert('Error', 'Member not found for deletion.');
        setDeleteModal({ visible: false, member: null });
        return;
      }
      await deleteDoc(doc(db, 'LegionairesMembers', memberId));
      setMembers(prevMembers => prevMembers.map(category => ({
        ...category,
        members: category.members.filter(m => m.id !== memberId),
      })));
      setDeleteModal({ visible: false, member: null });
      Alert.alert('Success', 'Member deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error.message);
      Alert.alert('Error', `Failed to delete member: ${error.message}`);
    }
  };

  const onDelete = (member) => {
    if (!member || !member.id) {
      console.warn('Invalid member provided to delete');
      return;
    }
    setDeleteModal({ visible: true, member });
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/League.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            if (sound) {
              sound.stopAsync();
              sound.unloadAsync();
            }
            navigation.goBack();
          }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Legionnaires</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {members.map((categoryData, categoryIndex) => {
            const rows = Math.ceil(categoryData.members.length / columns);

            return (
              <View key={categoryIndex} style={styles.categorySection}>
                <Text style={styles.categoryHeader}>{categoryData.category}</Text>
                <View style={styles.divider} />
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <View key={rowIndex} style={[styles.row, { marginBottom: verticalSpacing }]}>
                    {Array.from({ length: columns }).map((_, colIndex) => {
                      const memberIndex = rowIndex * columns + colIndex;
                      const memberObj = categoryData.members[memberIndex];
                      if (!memberObj || !memberObj.name) return <View key={colIndex} style={styles.cardSpacer} />;

                      const member = {
                        ...memberObj,
                        image: memberObj.imageUrl && memberObj.imageUrl !== 'placeholder'
                          ? { uri: memberObj.imageUrl }
                          : (legionImages[memberObj.name]?.image || require('../../assets/Armor/PlaceHolder.jpg')),
                        clickable: memberObj.clickable !== undefined ? memberObj.clickable : (legionImages[memberObj.name]?.clickable || true),
                      };

                      return renderMemberCard(member);
                    })}
                  </View>
                ))}
              </View>
            );
          })}
          <LegionFriends
            collectionPath="LegionairesMembers"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            hero={members}
            setHero={setMembers}
            hardcodedHero={memberCategories}
            editingHero={editingMember}
            setEditingHero={setEditingMember}
            onDelete={onDelete}
          />
        </ScrollView>

        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewMember(null)}
            >
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageScrollContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={SCREEN_WIDTH * 0.7 + 20}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
                <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
                <Text style={styles.previewCategory}>{previewMember?.category || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, member: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.member?.name || ''}"?`}</Text>
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
  },
  container: {
    flex: 1,
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
    color: '#fff',
    textAlign: 'center',
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 20,
    color: '#00b3ff',
  },
  scrollContainer: {
    paddingBottom: 20,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: verticalSpacing * 2,
    width: '100%',
  },
  categoryHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#00b3ff',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: verticalSpacing,
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
  },
  clickableCard: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardSpacer: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    marginHorizontal: horizontalSpacing / 2,
  },
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  characterImage: {
    width: cardSize,
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingLeft: 20,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    width: '100%',
  },
  previewCodename: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
  },
  previewCategory: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    width: cardSize,
  },
  editButton: {
    backgroundColor: '#FFA500',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
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
export default LegionairesScreen;