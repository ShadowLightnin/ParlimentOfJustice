import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
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

          {/* Three-Row Layout */}
          <View style={styles.cardContainer}>
            {/* Top Row: Villains and Big Bads */}
            <View style={styles.topRow}>
              <Card
                image={require('../../assets/BackGround/Villains.jpg')}
                onPress={() => navigation.navigate('VillainsTab')}
                mobileWidth={140}
                mobileHeight={160}
                desktopWidth={290}
                desktopHeight={300}
              />
              <Card
                image={require('../../assets/BackGround/BigBad.jpg')}
                onPress={() => navigation.navigate('BigBadsTab')}
                mobileWidth={140}
                mobileHeight={160}
                desktopWidth={290}
                desktopHeight={300}
              />
            </View>

            {/* Middle Row: Ships */}
            <View style={styles.middleRow}>
              <Card
                image={require('../../assets/BackGround/VillainShipYard.jpg')}
                onPress={() => navigation.navigate('Villain Fleet')}
                mobileWidth={105}
                mobileHeight={120}
                desktopWidth={218}
                desktopHeight={225}
              />
            </View>

            {/* Bottom Row: Demons */}
            <View style={styles.bottomRow}>
              <Card
                image={require('../../assets/BackGround/NateEmblem.jpg')}
                onPress={() => navigation.navigate('DemonsSection')}
                mobileWidth={180}
                mobileHeight={160}
                desktopWidth={340}
                desktopHeight={400}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Card Component with Transparent Overlay
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
      
      {/* Transparent Overlay to Prevent Saving */}
      <View style={styles.transparentOverlay} />
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
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
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
    color: '#630404',
    textAlign: 'center',
    textShadowColor: '#ff1c1c',
    textShadowRadius: 30,
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
  middleRow: {
    alignItems: 'center',
    marginTop: 5,
  },
  bottomRow: {
    alignItems: 'center',
    marginTop: 5,
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
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0)', 
    zIndex: 1, // Ensures overlay blocks saving but keeps interaction intact
  },
});

export default VillainsScreen;