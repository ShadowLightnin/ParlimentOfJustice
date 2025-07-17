import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { FlatList } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Guardians from './Guardians';
import Elementals from './Elementals';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// Background music (shared across screens)
let backgroundSound = null;

const playBackgroundMusic = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/Superman.mp4'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      backgroundSound = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/Superman.mp4');
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

const JusticeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [previewHero, setPreviewHero] = useState(null);

  useEffect(() => {
    if (isFocused && !backgroundSound) {
      playBackgroundMusic();
    }
    return () => {
      if (navigation.getState().routes[navigation.getState().index].name === 'Home') {
        stopBackgroundMusic();
      }
    };
  }, [isFocused, navigation]);

  const handleHeroPress = async (hero) => {
    if (hero.clickable) {
      if (!hero.screen) {
        if (backgroundSound) {
          try {
            await backgroundSound.pauseAsync();
          } catch (error) {
            console.error('Error pausing sound on hero press:', error);
          }
        }
        setPreviewHero(hero);
      } else {
        navigation.navigate(hero.screen);
      }
    }
  };

  const renderHeroCard = ({ item }) => (
    <TouchableOpacity
      key={item.name || item.image.toString()}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        item.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => handleHeroPress(item)}
      disabled={!item.clickable}
    >
      {item?.image && (
        <>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.name}>{item.name || item.codename || 'Unknown'}</Text>
      {!item.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  const renderPreviewCard = (hero) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={async () => {
        await playBackgroundMusic();
        setPreviewHero(null);
      }}
    >
      <Image
        source={hero.image || require('../../assets/Armor/LoneRanger.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {hero.name || hero.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Justice.jpg')}
      style={styles.background}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Heroes')}>
            <Text style={[styles.header, { marginTop: 20, marginBottom: 60 }]}>Guardians of Justice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await stopBackgroundMusic();
              navigation.navigate('Home');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>⬅️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await stopBackgroundMusic();
              navigation.navigate('VigilanteScreen');
            }}
            style={styles.vigilanteButton}
          >
            <Image
              source={require('../../assets/BackGround/Vigilantes.jpg')}
              style={styles.vigilanteImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.scrollWrapper}>
            <Text style={styles.categoryHeader}>Guardians</Text>
            <FlatList
              horizontal
              data={Guardians}
              renderItem={renderHeroCard}
              keyExtractor={(item) => item.name || item.image.toString()}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.scrollContainer}
            />
            <Text style={styles.categoryHeader}>Elementals</Text>
            <FlatList
              horizontal
              data={Elementals}
              renderItem={renderHeroCard}
              keyExtractor={(item) => item.name || item.image.toString()}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.scrollContainer}
            />
          </View>

          <Modal
            visible={!!previewHero}
            transparent={true}
            animationType="fade"
            onRequestClose={async () => {
              await playBackgroundMusic();
              setPreviewHero(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={async () => {
                  await playBackgroundMusic();
                  setPreviewHero(null);
                }}
              >
                <View style={styles.imageContainer}>
                  {previewHero && (
                    <FlatList
                      horizontal
                      data={[previewHero]}
                      renderItem={({ item }) => renderPreviewCard(item)}
                      keyExtractor={(item) => item.name || item.image.toString()}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.imageScrollContainer}
                    />
                  )}
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewHero?.name || previewHero?.codename || 'Unknown'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.6)',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'left',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },
  vigilanteButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    padding: 5,
    borderRadius: 5,
  },
  vigilanteImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 1,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    marginTop: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: horizontalSpacing,
  },
  clickable: {
    borderColor: 'yellow',
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: 'yellow',
    marginTop: 5,
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
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default JusticeScreen;