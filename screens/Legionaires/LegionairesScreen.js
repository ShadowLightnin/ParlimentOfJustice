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

  useEffect(() => {
    const random = Math.random();
    if (random < 0.4) {
      setBackground(require('../../assets/BackGround/Legionaires2.jpg'));
      setAudioFile(require('../../assets/audio/BlueBloodsExtend.mp4'));
    } else {
      setBackground(require('../../assets/BackGround/AnimatedLegion.gif'));
      setAudioFile(require('../../assets/audio/Legion2.mp4'));
    }
  }, []);

  const playTheme = async () => {
    if (!audioFile || currentSound) return;
    try {
      const { sound } = await Audio.Sound.createAsync(audioFile, { shouldPlay: true, isLooping: true });
      setCurrentSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      Alert.alert('Audio Error', 'Failed to load background music.');
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      await currentSound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(useCallback(() => () => stopSound(), [currentSound]));

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'LegionairesMembers'), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const updated = memberCategories.map(cat => ({
        ...cat,
        members: [
          ...cat.members.filter(m => legionImages[m.name]?.hardcoded || !fetched.some(f => f.name === m.name)),
          ...fetched.filter(m => m.category === cat.category && !m.hardcoded)
        ]
      }));
      setMembers(updated);
    });
    return () => unsubscribe();
  }, []);

  const goToChat = async () => { await stopSound(); navigation.navigate('TeamChat'); };

  const handleMemberPress = async (member) => {
    if (!member.clickable) return;
    await stopSound();
    if (member.screen) navigation.navigate(member.screen);
    else navigation.navigate('LegionairesCharacterDetail', { member });
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
          },
          !member.clickable && styles.disabledCard,
          {
            borderWidth: 2,
            borderColor: '#00b3ff',
            backgroundColor: 'rgba(0, 179, 255, 0.1)',
            shadowColor: '#00b3ff',
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10,
          },
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
      >
        <Image source={member.image} style={styles.characterImage} resizeMode="cover" />
        <Text style={styles.codename}>{member.codename || ''}</Text>
        <Text style={styles.name}>{member.name}</Text>
      </TouchableOpacity>

      {!legionImages[member.name]?.hardcoded && !member.hardcoded && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => setEditingMember(member)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => member.id && setDeleteModal({ visible: true, member })}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const confirmDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'LegionairesMembers', id));
      setMembers(prev => prev.map(cat => ({
        ...cat,
        members: cat.members.filter(m => m.id !== id)
      })));
      Alert.alert('Success', 'Member deleted successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete member.');
    } finally {
      setDeleteModal({ visible: false, member: null });
    }
  };

  return (
    <ImageBackground
      source={background || require('../../assets/BackGround/Legionaires2.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={async () => { await stopSound(); navigation.goBack(); }}>
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
                      const memberObj = categoryData.members[rowIndex * columns + colIndex];
                      if (!memberObj?.name) return <View key={colIndex} style={styles.cardSpacer} />;

                      const member = {
                        ...memberObj,
                        image: memberObj.imageUrl && memberObj.imageUrl !== 'placeholder'
                          ? { uri: memberObj.imageUrl }
                          : (legionImages[memberObj.name]?.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg')),
                        clickable: memberObj.clickable !== undefined ? memberObj.clickable : true,
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
            onDelete={(m) => m?.id && setDeleteModal({ visible: true, member: m })}
          />
        </ScrollView>

        <Modal visible={deleteModal.visible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.member?.name || ''}"?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setDeleteModal({ visible: false, member: null })}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalDelete} onPress={() => deleteModal.member?.id && confirmDelete(deleteModal.member.id)}>
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  codename: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  name: {
    position: 'absolute',
    bottom: 34,
    left: 10,
    fontSize: 12,
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardSpacer: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    marginHorizontal: horizontalSpacing / 2,
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