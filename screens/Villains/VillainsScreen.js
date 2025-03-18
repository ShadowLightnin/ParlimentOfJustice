import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP = SCREEN_WIDTH > 600; // Desktop width breakpoint

// Dynamic spacing for mobile and larger screens
const HEADER_MARGIN_TOP = IS_DESKTOP ? 30 : 50;
const BACK_BUTTON_TOP = IS_DESKTOP ? 20 : 40;

const VillainsScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/BackGround/VillainsHub.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Header */}
        <Text style={[styles.header, { marginTop: HEADER_MARGIN_TOP }]}>
          The Enlightened
        </Text>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={[styles.backButton, { top: BACK_BUTTON_TOP }]}
        >
          <Text style={styles.backButtonText}>⬅️ Back</Text>
        </TouchableOpacity>

        {/* Pyramid Layout */}
        <View style={styles.cardContainer}>
          <View style={styles.topRow}>
            <Card
              image={require('../../assets/BackGround/Villains.jpg')}
              onPress={() => navigation.navigate('VillainsTab')}
              mobileWidth={140} mobileHeight={160}
              desktopWidth={180} desktopHeight={200}
            />

            <Card
              image={require('../../assets/BackGround/BigBad.jpg')}
              onPress={() => navigation.navigate('BigBadsTab')}
              mobileWidth={140} mobileHeight={160}
              desktopWidth={180} desktopHeight={200}
            />
          </View>

          <View style={styles.bottomRow}>
            <Card
              image={require('../../assets/BackGround/NateEmblem.jpg')}
              onPress={() => navigation.navigate('DemonsSection')}
              mobileWidth={180} mobileHeight={160}
              desktopWidth={220} desktopHeight={200}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

// Card Component
const Card = ({
  image,
  onPress,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
}) => {
  const cardWidth = IS_DESKTOP ? desktopWidth : mobileWidth;
  const cardHeight = IS_DESKTOP ? desktopHeight : mobileHeight;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={onPress}
    >
      <Image source={image} style={styles.cardImage} />
    </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 20,
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
    textShadowColor: '#750000',
    textShadowRadius: 50,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  bottomRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default VillainsScreen;
