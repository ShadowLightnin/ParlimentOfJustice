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

// Big Bads data with images & respective screens
const bigBads = [
  { name: 'Obsian', screen: 'ObsidianScreen', image: require('../../assets/Villains/Obsidian.jpg'), clickable: true },
  { name: 'Umbra Nex', screen: 'UmbraNexScreen', image: require('../../assets/Villains/UmbraNex.jpg'), clickable: true },
  { name: 'Kaidan Vyros', screen: 'KaidanVyrosScreen', image: require('../../assets/Villains/KaidanVyros.jpg'), clickable: true },
  { name: 'Stormshade', screen: 'StormshadeScreen', image: require('../../assets/Villains/Stormshade.jpg'), clickable: true },
  { name: 'Void Conqueror', screen: 'VoidConquerorScreen', image: require('../../assets/Villains/Kharon.jpg'), clickable: true },
  { name: 'Erevos', screen: 'ErevosScreen', image: require('../../assets/Villains/Erevos.jpg'), clickable: true },
  { name: 'Almarra', screen: 'AlmarraScreen', image: require('../../assets/Villains/Almarra.jpg'), clickable: true },
  { name: 'Vortigar', screen: 'VortigarScreen', image: require('../../assets/Villains/Vortigar.jpg'), clickable: true },
  { name: 'Torath', screen: '', image: require('../../assets/Villains/Torath.jpg'), clickable: false },
  { name: 'Lord Dravak', screen: '', image: require('../../assets/Villains/Dravak.jpg'), clickable: false },
  { name: 'Arcane Devos', screen: 'VortigarScreen', image: require('../../assets/Villains/Devos.jpg'), clickable: false },
  { name: 'Archon Ultivax', screen: '', image: require('../../assets/Villains/Ultivax.jpg'), clickable: false }, // use for different after getting ultron
  { name: 'Sovereign Xal-Zor', screen: '', image: require('../../assets/Villains/XalZor.jpg'), clickable: false },
  { name: 'Emperor Obsidian', screen: '', image: require('../../assets/Villains/EmperorObsidian.jpg'), clickable: false }, // use for sauron after getting darkseid
  { name: 'Admiral Scyphos', screen: '', image: require('../../assets/Villains/Scyphos.jpg'), clickable: false }, //use for different after gettign thrawn
  { name: 'Admiral', screen: '', image: require('../../assets/Villains/Admiral.jpg'), clickable: false },
  { name: "Zein'roe", screen: '', image: require('../../assets/Villains/Zeinroe.jpg'), clickable: false },
  { name: 'Devoes', screen: '', image: require('../../assets/Villains/Devoes.jpg'), clickable: false },
  { name: 'Cronos', screen: '', image: require('../../assets/Villains/Cronos.jpg'), clickable: false },
  { name: "Cor'vas", screen: '', image: require('../../assets/Villains/Corvas.jpg'), clickable: false },
  


    // { name: '', screen: '', image: require('../../assets/Villains/.jpg'), clickable: false },

];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};

const BigBadsTab = () => {
  const navigation = useNavigation();

  // Render Each Big Bad Card
  const renderBigBadCard = (bigBad) => (
    <TouchableOpacity
      key={bigBad.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height
        },
        bigBad.clickable ? styles.clickable : styles.notClickable
      ]}
      onPress={() => bigBad.clickable && navigation.navigate(bigBad.screen)}
      disabled={!bigBad.clickable}
    >
      <Image source={bigBad.image} style={styles.image} />
      
      {/* Transparent Overlay for Image Protection */}
      <View style={styles.transparentOverlay} />

      <Text style={styles.name}>{bigBad.name}</Text>
      {!bigBad.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/BigBad.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Big Bads</Text>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {bigBads.map(renderBigBadCard)}
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
    color: '#1b084d',
    textAlign: 'center',
    textShadowColor: '#9561f5',
    textShadowRadius: 25,
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
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clickable: {
    borderColor: 'purple',
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Ensures overlay is on top without blocking buttons
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
    color: '#ff4444',
    marginTop: 5,
  },
});

export default BigBadsTab;