import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { memberCategories } from './LegionairesMembers';
import legionImages from './LegionairesImages';
import descriptions from './LegionDescription';
import LegionFriends from './LegionFriends';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 7 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 20 : 10;

export const LegionairesScreen = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState(memberCategories);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [background, setBackground] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  // Randomly select background and audio on mount
  useEffect(() => {
    const selectMedia = () => {
      const random = Math.random();
      if (random < 0.4) {
        // Option 1: Original background and audio
        setBackground(require('../../assets/BackGround/Legionaires2.jpg'));
        setAudioFile(require('../../assets/audio/BlueBloodsExtend.mp4'));
      } else {
        // Option 2: New background and audio
        setBackground(require('../../assets/BackGround/AnimatedLegion.gif'));
        setAudioFile(require('../../assets/audio/Legion2.mp4'));
      }
    };
    selectMedia();
  }, []);

  // Handle music playback
  const playTheme = async () => {
    if (!audioFile) return; // Wait until audioFile is set
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          audioFile,
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
        console.log('Playing Sound at:', new Date().toISOString());
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', `Failed to load background music. Please check the audio file path: ${audioFile}`);
      }
    } else if (!isPlaying) {
      try {
        await currentSound.playAsync();
        setIsPlaying(true);
        console.log('Audio resumed at:', new Date().toISOString());
      } catch (error) {
        console.error('Error resuming sound:', error);
      }
    }
  };

  // Handle music pause
  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      try {
        await currentSound.pauseAsync();
        setIsPlaying(false);
        console.log('Audio paused at:', new Date().toISOString());
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  // Cleanup sound on unmount or navigation
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('Audio stopped and unloaded on unmount');
        }
      };
    }, [currentSound])
  );

  useEffect(() => {
    // Listen for real-time updates from Firestore
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

    return () => {
      unsubscribe();
    };
  }, []);

  const goToChat = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
        console.log('Audio stopped and unloaded for TeamChat navigation');
      } catch (error) {
        console.error('Error stopping/unloading audio for TeamChat:', error);
      }
    }
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = async (member) => {
    if (member.clickable) {
      if (currentSound) {
        try {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('Audio stopped and unloaded for member navigation');
        } catch (error) {
          console.error('Error stopping sound for member navigation:', error);
        }
      }
      if (member.screen && member.screen !== '') {
        navigation.navigate(member.screen);
      } else {
        navigation.navigate('LegionairesCharacterDetail', { member });
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
      source={background || require('../../assets/BackGround/Legionaires2.jpg')} // Fallback to original
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={async () => {
            if (currentSound) {
              try {
                await currentSound.stopAsync();
                await currentSound.unloadAsync();
                setCurrentSound(null);
                setIsPlaying(false);
                console.log('Audio stopped and unloaded on back press');
              } catch (error) {
                console.error('Error stopping/unloading audio on back press:', error);
              }
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

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
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
                          : (legionImages[memberObj.name]?.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg')),
                        images: legionImages[memberObj.name]?.images || (
                          memberObj.imageUrl && memberObj.imageUrl !== 'placeholder'
                            ? [{ uri: memberObj.imageUrl, name: memberObj.name || 'Member Image', clickable: true }]
                            : [{ uri: require('../../assets/Armor/PlaceHolder.jpg'), name: 'Placeholder', clickable: true }]
                        ),
                        clickable: memberObj.clickable !== undefined ? memberObj.clickable : (legionImages[memberObj.name]?.images?.[0]?.clickable || true),
                        description: descriptions[memberObj.name] || memberObj.description || 'No description available',
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

// Styles remain unchanged
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
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  musicButtonText: {
    fontSize: 12,
    color: '#00b3ff',
    fontWeight: 'bold',
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