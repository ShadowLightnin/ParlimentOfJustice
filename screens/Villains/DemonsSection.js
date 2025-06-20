import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 400 : 300;

// Demon factions data
const demonFactions = [
  { name: 'Skinwalkers', screen: 'SkinwalkerScreen', image: require('../../assets/BackGround/Skinwalkers.jpg'), clickable: true },
  { name: 'Weeping Angels', screen: 'WeepingAngelsScreen', image: require('../../assets/BackGround/Statue.jpg'), clickable: false },
  { name: 'Oni', screen: 'DemonsOniScreen', image: require('../../assets/BackGround/Oni.jpg'), clickable: false },
  { name: 'Aliens', screen: 'AliensScreen', image: require('../../assets/BackGround/Aliens.jpg'), clickable: false },
  { name: 'Metalmen', screen: 'MetalmenScreen', image: require('../../assets/BackGround/Robots.jpg'), clickable: false },
  { name: 'Ghosts', screen: 'GhostsScreen', image: require('../../assets/BackGround/Ghosts2.jpg'), clickable: false },
  { name: 'Bugs', screen: 'BugScreen', image: require('../../assets/BackGround/Bugs.jpg'), clickable: false },
];

const DemonsSection = () => {
  const navigation = useNavigation();

  // Render each faction card
  const renderFactionCard = (faction) => (
    <TouchableOpacity
      key={faction.name}
      style={[
        styles.factionCard,
        { width: cardSize, height: cardSize * 1.2 + 60 }, // Extra height for text
        faction.clickable ? styles.clickable : styles.notClickable
      ]}
      onPress={() => faction.clickable && navigation.navigate(faction.screen)}
      disabled={!faction.clickable}
    >
      <Image
        source={faction.image}
        style={[styles.factionImage, { width: cardSize, height: cardSize * 1.2 }]}
      />
      
      {/* Transparent Overlay for Image Protection */}
      <View style={styles.transparentOverlay} />

      <View style={styles.textContainer}>
        <Text style={styles.factionName}>{faction.name}</Text>
        {!faction.clickable && <Text style={styles.disabledText}> </Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/NateEmblem.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>⚡️ Demon Lords ⚡️</Text>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {demonFactions.map(renderFactionCard)}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    color: 'rgba(107, 9, 9, 1)',
    textAlign: 'center',
    textShadowColor: 'rgba(241, 99, 43, 1)',
    textShadowRadius: 20,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: 20,
    alignItems: 'center',
  },
  factionCard: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent to remove red background
    alignItems: 'center',
    marginRight: 20,
  },
  clickable: {
    borderColor: 'transparent',
    borderWidth: 4,
  },
  notClickable: {
    opacity: 0.7,
  },
  factionImage: {
    borderRadius: 15, // Match card border radius
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  factionName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledText: {
    marginTop: 5,
    color: '#ff4444',
    fontSize: 14,
  },
});

export default DemonsSection;