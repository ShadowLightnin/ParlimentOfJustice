// screens/Legionaires/LegionairesCharacterDetail.js
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
import descriptions from './LegionDescription';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PLACEHOLDER = require('../../assets/Armor/PlaceHolder.jpg');

// 🔹 Normalize any “image-like” value into a valid RN Image `source`
const normalizeImageSource = (img) => {
  if (!img) return PLACEHOLDER;

  // already a local require id
  if (typeof img === 'number') return img;

  if (typeof img === 'object') {
    // sometimes nested like { source: require(...) }
    if (img.source) return normalizeImageSource(img.source);

    if (img.uri != null) {
      if (typeof img.uri === 'number') return img.uri;        // local require in uri
      if (typeof img.uri === 'string') return { uri: img.uri }; // remote/local string uri
    }
  }

  if (typeof img === 'string') {
    return { uri: img };
  }

  return PLACEHOLDER;
};

const LegionairesCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9;

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get('window').width);
    };
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
    }).catch((e) => console.error('Audio mode setup error:', e));

    const loadAudio = async () => {
      if (member?.mediaUri && member?.mediaType === 'audio' && !audioRef.current) {
        try {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: member.mediaUri });
          audioRef.current = sound;
          console.log('Audio loaded:', member.mediaUri);
        } catch (e) {
          console.error('Audio load error:', e.message);
        }
      }
    };

    loadAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current
          .unloadAsync()
          .catch((e) => console.error('Audio unload error:', e));
        audioRef.current = null;
        console.log('Audio unloaded on cleanup');
      }
    };
  }, [member?.mediaUri, member?.mediaType]);

  const togglePlayPause = async () => {
    if (member?.mediaType === 'video' && videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
        console.log(`Video ${isPlaying ? 'paused' : 'playing'}: ${member.mediaUri}`);
      } catch (e) {
        console.error('Video toggle error:', e.message);
      }
    } else if (member?.mediaType === 'audio' && audioRef.current) {
      try {
        const status = await audioRef.current.getStatusAsync();
        if (!status.isLoaded) {
          console.error('Audio not loaded:', member.mediaUri);
          return;
        }
        if (isPlaying) {
          await audioRef.current.pauseAsync();
        } else {
          await audioRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
        console.log(`Audio ${isPlaying ? 'paused' : 'playing'}: ${member.mediaUri}`);
      } catch (e) {
        console.error('Audio toggle error:', e.message);
      }
    }
  };

  // 🔹 Copyright text per image
  const copyrightText = member?.codename
    ? `© ${member.codename}; William Cummings`
    : '© William Cummings';

  // 🔹 Build a normalized images array
  let images;
  if (member?.images?.length) {
    images = member.images.map((img) => {
      const base =
        typeof img === 'object' && img !== null ? img : { uri: img };
      return {
        source: normalizeImageSource(base.uri ?? base),
        name: copyrightText,
        clickable: base.clickable ?? true,
      };
    });
  } else {
    images = [
      {
        source: normalizeImageSource(member?.image || PLACEHOLDER),
        name: copyrightText,
        clickable: true,
      },
    ];
  }

  console.log('Member:', member?.name, 'Images:', images);

  const renderImageCard = (img, index) => {
    const key = `image-${index}`;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.card(isDesktop, windowWidth), img.clickable !== false && styles.clickable]}
        onPress={() => console.log(`${img.name || 'Image'} clicked`)}
        activeOpacity={0.9}
      >
        <Image
          source={normalizeImageSource(img.source)}
          style={styles.armorImage}
          resizeMode="cover"
          onError={(e) =>
            console.error(
              'Image load error:',
              e.nativeEvent.error,
              'source:',
              img.source
            )
          }
        />
        <View className="transparentOverlay" style={styles.transparentOverlay} />
        {img.name && img.name.trim() && (
          <Text style={styles.cardName}>{img.name.trim()}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderMediaPlayer = () => {
    if (!member?.mediaUri) return null;
    const mediaStyle = {
      width: '100%',
      height: member.mediaType === 'video' ? 200 : 50,
      borderRadius: 10,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <View style={styles.mediaContainer}>
        {member.mediaType === 'video' ? (
          <Video
            ref={videoRef}
            source={{ uri: member.mediaUri }}
            style={mediaStyle}
            resizeMode="cover"
            isLooping
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={(status) => {
              console.log('Video playback status:', status);
              setIsPlaying(!!status.isPlaying);
            }}
          />
        ) : member.mediaType === 'audio' ? (
          <View style={mediaStyle}>
            <Text style={styles.mediaText}>
              Audio: {member.mediaUri.split('/').pop()}
            </Text>
          </View>
        ) : (
          <View style={mediaStyle}>
            <Text style={styles.mediaText}>
              File: {member.mediaUri.split('/').pop()}
            </Text>
          </View>
        )}
        {(member.mediaType === 'video' || member.mediaType === 'audio') && (
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getDescription = (name, memberDesc) => {
    const desc = memberDesc || descriptions[name] || 'No description available';
    return typeof desc === 'string' ? desc.trim() : 'No description available';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              if (audioRef.current) {
                try {
                  await audioRef.current.pauseAsync();
                  await audioRef.current.unloadAsync();
                  audioRef.current = null;
                  console.log('Audio paused and unloaded on back press');
                } catch (e) {
                  console.error('Audio stop error on back press:', e.message);
                }
              }
              if (videoRef.current) {
                try {
                  await videoRef.current.pauseAsync();
                  console.log('Video paused on back press');
                } catch (e) {
                  console.error('Video stop error on back press:', e.message);
                }
              }
              setIsPlaying(false);
              navigation.goBack();
            }}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{member?.codename || 'N/A'}</Text>
        </View>

        {/* Image gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={cardWidth + 20}
            decelerationRate="fast"
            contentOffset={{
              x: (SCREEN_WIDTH - cardWidth) / 2 - 10,
              y: 0,
            }}
          >
            {images.map(renderImageCard)}
          </ScrollView>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>
            About {member?.name || 'Character'}
          </Text>
          <Text style={styles.aboutText}>
            {getDescription(member?.name, member?.description)}
          </Text>
        </View>

        {/* Media */}
        {renderMediaPlayer()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#111',
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: '#00b3ff',
  },
  armorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  aboutSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  mediaContainer: {
    marginBottom: 20,
    marginTop: 40,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  mediaText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#00b3ff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default LegionairesCharacterDetail;
