import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video, Audio } from 'expo-av';
import constollationImages from './ConstollationImages';
import ConstollationDescription from './ConstollationDescription';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ConstollationCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.32 : SCREEN_WIDTH * 0.88;

  useEffect(() => {
    const updateDimensions = () => setWindowWidth(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      if (audioRef.current) audioRef.current.unloadAsync().catch(() => {});
      if (videoRef.current) videoRef.current.pauseAsync().catch(() => {});
    };
  }, []);

  // CORRECT COPYRIGHT TEXT
  const copyrightText = member?.codename
    ? `© ${member.codename}; William Cummings`
    : '© William Cummings';

  // BUILD IMAGES ARRAY WITH COPYRIGHT APPLIED TO EVERY IMAGE
  const images = member?.images?.length > 0
    ? member.images.map((img) => ({
        uri: img.uri,
        name: copyrightText,        // This is what shows under each image
        clickable: img.clickable ?? true,
      }))
    : constollationImages[member?.name]?.images?.length > 0
      ? constollationImages[member.name].images.map((img) => ({
          uri: img.uri,
          name: copyrightText,
          clickable: img.clickable ?? true,
        }))
      : [{
          uri: member?.image || require('../../assets/Armor/PlaceHolder.jpg'),
          name: copyrightText,
          clickable: true,
        }];

  const memberDescription = member?.description || 
    ConstollationDescription[member?.name] || 
    'A guiding star in the Constollation. Their light shapes the future of those they teach, mentor, and inspire. Eternal gratitude to all who illuminate the path.';

  const renderImageCard = (img, index) => {
    const source = typeof img.uri === 'object' ? img.uri : { uri: img.uri };
    return (
      <TouchableOpacity
        key={index}
        style={[styles.card(isDesktop, windowWidth), img.clickable !== false && styles.clickable]}
        onPress={() => console.log(`${copyrightText} clicked`)}
      >
        <Image source={source} style={styles.armorImage} resizeMode="cover" />
        <View style={styles.transparentOverlay} />
        {img.name && (
          <Text style={styles.cardName}>{img.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderMediaPlayer = () => {
    if (!member?.mediaUri) return null;

    return (
      <View style={styles.mediaContainer}>
        {member.mediaType === 'video' ? (
          <Video
            ref={videoRef}
            source={{ uri: member.mediaUri }}
            style={{ width: '100%', height: 220, borderRadius: 12 }}
            resizeMode="contain"
            isLooping
            useNativeControls
          />
        ) : (
          <View style={{ width: '100%', height: 60, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00b3ff' }}>
            <Text style={styles.mediaText}>Audio Message</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {member?.codename || member?.name || 'Constollation Star'}
          </Text>
        </View>

        {/* Horizontal Image Gallery — NOW USING THE CORRECT IMAGES ARRAY */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContainer}
            snapToInterval={cardWidth + 20}
            decelerationRate="fast"
          >
            {images.map(renderImageCard)}
          </ScrollView>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>
            {member?.codename || 'Eternal Light'}
          </Text>
          <Text style={styles.aboutSubheader}>
            {member?.name || 'A Soul of the Constollation'}
          </Text>
          {member?.category && (
            <Text style={styles.aboutCategory}>
              {member.category}
            </Text>
          )}
          <Text style={styles.aboutText}>
            {memberDescription}
          </Text>
        </View>

        {/* Optional Media */}
        {renderMediaPlayer()}
      </ScrollView>
    </View>
  );
};

// Styles remain unchanged...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContainer: { paddingBottom: 60 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 2,
    borderBottomColor: '#00b3ff',
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(0,179,255,0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00b3ff',
  },
  backButtonText: { fontSize: 24, color: '#00b3ff', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#00b3ff', textAlign: 'center', flex: 1, textShadowColor: '#00b3ff', textShadowRadius: 10 },

  imageContainer: { width: '100%', paddingVertical: 20, backgroundColor: '#111', paddingLeft: 15 },
  imageScrollContainer: { paddingHorizontal: 10, alignItems: 'center' },

  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.32 : SCREEN_WIDTH * 0.88,
    height: isDesktop ? SCREEN_HEIGHT * 0.78 : SCREEN_HEIGHT * 0.68,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#00b3ff',
    shadowColor: '#00b3ff',
    shadowOpacity: 0.9,
    shadowRadius: 15,
  }),
  clickable: { borderWidth: 3, borderColor: '#00ffff' },
  armorImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1 },
  cardName: { position: 'absolute', bottom: 16, left: 16, fontSize: 18, color: '#00ffff', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 8 },

  aboutSection: {
    marginTop: 30,
    padding: 25,
    backgroundColor: '#111',
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#00b3ff',
  },
  aboutHeader: { fontSize: 26, fontWeight: 'bold', color: '#00b3ff', textAlign: 'center', textShadowColor: '#00b3ff', textShadowRadius: 8 },
  aboutSubheader: { fontSize: 20, color: '#aaa', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  aboutCategory: { fontSize: 16, color: '#00ffff', textAlign: 'center', marginTop: 12, fontWeight: '600' },
  aboutText: { fontSize: 16, color: '#ccc', textAlign: 'center', marginTop: 16, lineHeight: 24 },

  mediaContainer: { marginTop: 40, marginBottom: 20, width: '90%', alignSelf: 'center', alignItems: 'center' },
  mediaText: { color: '#00b3ff', fontSize: 16, fontWeight: 'bold' },
});

export default ConstollationCharacterDetail;