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
import { olympiansCategories } from './OlympiansMembers';
import { Audio } from 'expo-av';
import descriptions from './OlympiansDescription';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const OlympiansScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle music playback
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/SupermanTrailer.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
        console.log('Playing Sound at:', new Date().toISOString());
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/SupermanTrailer.mp4');
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
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get('window').width);
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      subscription?.remove();
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
        navigation.navigate('OlympiansCharacterDetail', { member });
      }
    }
  };

  const renderMemberCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      images: member.images || [{ uri: require('../../assets/Armor/PlaceHolder.jpg'), name: 'Placeholder', clickable: true }],
      clickable: member.clickable !== undefined ? member.clickable : true,
      description: descriptions[member.name] || 'No description available',
      family: olympiansCategories.find(category => category.members.some(m => m.name === member.name))?.family || 'Unknown',
    };

    // console.log('Passing member:', member.name, 'Images:', enhancedMember.images);

    return (
      <TouchableOpacity
        key={member.name}
        style={[
          styles.card,
          { width: cardSize, height: cardSize * cardHeightMultiplier },
          !enhancedMember.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
        disabled={!enhancedMember.clickable}
      >
        {enhancedMember.image && (
          <>
            <Image
              source={typeof enhancedMember.image === 'string' ? { uri: enhancedMember.image } : enhancedMember.image}
              style={[styles.characterImage, { width: '100%', height: cardSize * 1.2 }]}
              onError={(e) => console.error('Image load error:', e.nativeEvent.error, 'URI:', enhancedMember.image)}
            />
            <View style={styles.transparentOverlay} />
          </>
        )}
        <Text style={styles.codename}>{enhancedMember.codename || ''}</Text>
        <Text style={styles.name}>{enhancedMember.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderJenniferCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      images: member.images || [{ uri: require('../../assets/Armor/PlaceHolder.jpg'), name: 'Placeholder', clickable: true }],
      clickable: member.clickable !== undefined ? member.clickable : true,
      description: descriptions[member.name] || 'No description available',
      family: olympiansCategories.find(category => category.members.some(m => m.name === member.name))?.family || 'Unknown',
    };

    return (
      <TouchableOpacity
        key={member.name}
        style={[
          styles.jenniferCard,
          { width: 2 * cardSize, height: cardSize * 2.5 },
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
        disabled={!enhancedMember.clickable}
      >
        {enhancedMember.image && (
          <>
            <Image
              source={typeof enhancedMember.image === 'string' ? { uri: enhancedMember.image } : enhancedMember.image}
              style={[styles.characterImage, { width: '100%', height: cardSize * 1.5 }]}
              onError={(e) => console.error('Image load error:', e.nativeEvent.error, 'URI:', enhancedMember.image)}
            />
            <View style={styles.transparentOverlay} />
          </>
        )}
        <Text style={[styles.codename, styles.jenniferCodename]}>{enhancedMember.codename || ''}</Text>
        <Text style={[styles.name, styles.jenniferName]}>{enhancedMember.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderPreviewCard = (img, index) => {
    const key = img.uri ? `${typeof img.uri === 'string' ? img.uri : index}-${index}` : `image-${index}`;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.previewCard(isDesktop, windowWidth), styles.clickable]}
        onPress={() => setPreviewMember(null)}
      >
        <Image
          source={typeof img.uri === 'string' ? { uri: img.uri } : img.uri}
          style={styles.previewImage}
          resizeMode="cover"
          onError={(e) => console.error('Image load error:', e.nativeEvent.error, 'URI:', img.uri)}
        />
        <View style={styles.transparentOverlay} />
        <Text style={styles.cardName}>
          © {img.name || 'Unknown'}; William Cummings
        </Text>
      </TouchableOpacity>
    );
  };

  const jenniferMember = olympiansCategories
    .flatMap(category => category.members)
    .find(member => member.name === 'Jennifer');

  const allMembers = olympiansCategories
    .flatMap(category => category.members)
    .filter(member => member.name !== 'Jennifer');

  const renderModalContent = () => {
    if (!previewMember) return null;

    const images = previewMember.images?.length
      ? previewMember.images.map((img, idx) => ({
          uri: img.uri,
          name: img.name || `Image ${idx + 1}`,
        }))
      : [{
          uri: previewMember.image || require('../../assets/Armor/PlaceHolder.jpg'),
          name: previewMember.name || 'Default Image',
        }];

    console.log('Preview Member:', previewMember.name, 'Images:', images);

    return (
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
            {images.map(renderPreviewCard)}
          </ScrollView>
        </View>
        <View style={styles.previewAboutSection}>
          <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
          <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
          <Text style={styles.previewFamily}>{previewMember?.family || 'Unknown'}</Text>
          <Text style={styles.previewDescription}>
            {descriptions[previewMember.name] || 'No description available'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
            }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Olympians</Text>
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
          {jenniferMember && (
            <View style={styles.jenniferCardContainer}>
              {renderJenniferCard(jenniferMember)}
            </View>
          )}
          <View style={styles.spacingBelowJennifer} />
          <View style={styles.membersContainer}>
            {Array.from({ length: Math.ceil(allMembers.length / columns) }).map((_, rowIndex) => (
              <View
                key={rowIndex}
                style={[styles.row, { marginBottom: verticalSpacing, gap: horizontalSpacing }]}
              >
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const memberIndex = rowIndex * columns + colIndex;
                  const member = allMembers[memberIndex];
                  if (!member || !member.name) {
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
          </View>
        </ScrollView>

        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            {renderModalContent()}
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
  membersContainer: {
    width: '100%',
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
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  previewFamily: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  previewDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default OlympiansScreen;