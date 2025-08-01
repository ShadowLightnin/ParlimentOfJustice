import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OlympiansMembers from './OlympiansMembers';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

const rows = Math.ceil((OlympiansMembers.length - 1) / columns);

export const OlympiansScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [sound, setSound] = useState(null);
  const soundRef = useRef(null); // Track sound object to handle async loading

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get('window').width);
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);

    // Load and play background music
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/SupermanTrailer.mp4'),
          { shouldPlay: true, isLooping: true }
        );
        soundRef.current = sound; // Store in ref to track immediately
        setSound(sound);
        await sound.playAsync();
        console.log('Background music started: SupermanTrailer.mp4');
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    }
    loadSound();

    return () => {
      subscription?.remove();
      // Cleanup audio on unmount
      if (soundRef.current) {
        soundRef.current.stopAsync().catch((e) => console.error('Error stopping audio:', e));
        soundRef.current.unloadAsync().catch((e) => console.error('Error unloading audio:', e));
        soundRef.current = null;
        console.log('Audio stopped and unloaded on unmount');
      }
    };
  }, []);

  useEffect(() => {
    // Stop and unload music when navigating away
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          console.log('Audio stopped and unloaded on navigation');
        } catch (error) {
          console.error('Error stopping/unloading audio on navigation:', error);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  const goToChat = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        console.log('Audio stopped and unloaded for TeamChat navigation');
      } catch (error) {
        console.error('Error stopping/unloading audio for TeamChat:', error);
      }
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
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * cardHeightMultiplier },
        !member.clickable && styles.disabledCard,
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      {member.image && (
        <>
          <Image
            source={member.image}
            style={[styles.characterImage, { width: '100%', height: cardSize * 1.2 }]}
          />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.codename}>{member.codename || ''}</Text>
      <Text style={styles.name}>{member.name}</Text>
    </TouchableOpacity>
  );

  const renderJenniferCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.jenniferCard,
        { width: 2 * cardSize, height: cardSize * 2.5 },
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      {member.image && (
        <>
          <Image
            source={member.image}
            style={[styles.characterImage, { width: '100%', height: cardSize * 1.5 }]}
          />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={[styles.codename, styles.jenniferCodename]}>{member.codename || ''}</Text>
      <Text style={[styles.name, styles.jenniferName]}>{member.name}</Text>
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[styles.previewCard(isDesktop, windowWidth), styles.clickable]}
      onPress={() => setPreviewMember(null)}
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

  const jenniferMember = OlympiansMembers.find(member => member.name === 'Jennifer');

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Olympians.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              if (soundRef.current) {
                try {
                  await soundRef.current.stopAsync();
                  await soundRef.current.unloadAsync();
                  soundRef.current = null;
                  console.log('Audio stopped and unloaded on back press');
                } catch (error) {
                  console.error('Error stopping/unloading audio on back press:', error);
                }
              }
              navigation.goBack();
            }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Olympians</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {jenniferMember && (
            <View style={styles.jenniferCardContainer}>
              {renderJenniferCard(jenniferMember)}
            </View>
          )}
          <View style={styles.spacingBelowJennifer} />
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.row, { marginBottom: verticalSpacing, gap: horizontalSpacing }]}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const memberIndex = rowIndex * columns + colIndex;
                const member = OlympiansMembers[memberIndex + (memberIndex >= OlympiansMembers.findIndex(m => m.name === 'Jennifer') ? 1 : 0)];

                if (!member || !member.name || member.name === 'Jennifer') {
                  return (
                    <View
                      key={colIndex}
                      style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
                    />
                  );
                }

                return renderMemberCard(member);
              })}
            </View>
          ))}
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
                  snapToInterval={windowWidth * 0.7 + 20}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
                <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
                <Text style={styles.previewFamily}>{previewMember?.family || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  disabledCard: {
    shadowColor: 'transparent',
    backgroundColor: '#444',
  },
  characterImage: {
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  codename: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  jenniferCard: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#ff9999',
    shadowOpacity: 1.5,
    shadowRadius: 15,
    elevation: 10,
  },
  jenniferCodename: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff9999',
    textAlign: 'center',
    marginTop: 5,
  },
  jenniferName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#ffcccc',
    textAlign: 'center',
  },
  jenniferCardContainer: {
    alignItems: 'center',
    marginTop: verticalSpacing,
  },
  spacingBelowJennifer: {
    height: verticalSpacing * 2,
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
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.8,
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
  previewFamily: {
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
});

export default OlympiansScreen;