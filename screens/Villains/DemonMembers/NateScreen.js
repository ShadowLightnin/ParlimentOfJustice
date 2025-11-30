import React, { useState, useEffect } from 'react';
import { 
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Screen Size Check
const isDesktop = SCREEN_WIDTH > 600;

const NateScreen = () => { 
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Sizes for Nate (full size)
  const nateImageSize = isDesktop ? windowWidth * 0.8 : SCREEN_WIDTH * 0.8; // Larger for Nate
  const nateImageHeight = isDesktop ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.5;

  // Sizes for Spawn (half the size of Nate)
  const spawnImageSize = isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.5; // Smaller for Spawn
  const spawnImageHeight = isDesktop ? SCREEN_HEIGHT * 0.3 : SCREEN_HEIGHT * 0.5;

  const nateCharacters = [
    { name: "Demon Lord Naq'thul", image: require('../../../assets/Villains/Nate.jpg'), clickable: true },
    { name: "Skinwalker Naq'thul", image: require('../../../assets/Villains/Nate2.jpg'), clickable: true },
    { name: "Naq'thul", image: require('../../../assets/Villains/Nate3.jpg'), clickable: true },
  ];

  const spawnCharacters = [
    { name: "Morphisto", image: require('../../../assets/Villains/Spawn.jpg'), clickable: true },
    { name: "Slendral", image: require('../../../assets/Villains/Spawn1.jpg'), clickable: true },
    { name: "Verndigo", image: require('../../../assets/Villains/Spawn2.jpg'), clickable: true },
    { name: "Howler", image: require('../../../assets/Villains/Spawn3.jpg'), clickable: true },
    { name: "Skullroot", image: require('../../../assets/Villains/Spawn4.jpg'), clickable: true },
    { name: "Wooddrift", image: require('../../../assets/Villains/Spawn5.jpg'), clickable: true },
    { name: "Creeking", image: require('../../../assets/Villains/Spawn6.jpg'), clickable: true },
  ];

  const renderCharacterCard = (character, isSpawn = false) => (
    <TouchableOpacity
      key={character.name}
      style={character.clickable ? styles.clickable : styles.notClickable}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
    >
      <Image
        source={character.image}
        style={[styles.armorImage, {
          width: isSpawn ? spawnImageSize : nateImageSize,
          height: isSpawn ? spawnImageHeight : nateImageHeight,
        }]}
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {character.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/NateEmblem.jpg')} 
      style={isDesktop ? styles.desktopBackground : styles.mobileBackground}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* Title */}
          <Text style={isDesktop ? styles.desktopTitle : styles.mobileTitle}>
            🔥 Demon Lord Naq'thul 🔥
          </Text>

          {/* Nate's Image (Horizontal Scroll Container) */}
          <Text style={styles.nateTitle}>Naq'thul Variants</Text>
          <ScrollView
            horizontal={true}
            style={styles.horizontalImageContainer}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            snapToAlignment="center"
            snapToInterval={nateImageSize + 20} // Snap to larger Nate cards
            decelerationRate="fast"
          >
            {nateCharacters.map((character) => renderCharacterCard(character, false))}
          </ScrollView>

          {/* Spawn's Image (Horizontal Scroll Container) */}
          <Text style={styles.spawnTitle}>Naq'thul's Spawn</Text>
          <ScrollView
            horizontal={true}
            style={styles.horizontalImageContainer}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            snapToAlignment="center"
            snapToInterval={spawnImageSize + 20} // Snap to smaller Spawn cards
            decelerationRate="fast"
          >
            {spawnCharacters.map((character) => renderCharacterCard(character, true))}
          </ScrollView>

          {/* Description */}
          <Text style={isDesktop ? styles.desktopDescription : styles.mobileDescription}>
            The mighty Demon Lord Naq'thul reigns supreme, feared by all who cross his path. 
            Legends speak of him commanding the infernal legions and wielding a blade forged 
            in the heart of a dying star. Beware his wrath!
          </Text>

          {/* Return Button */}
          <TouchableOpacity 
            style={isDesktop ? styles.desktopButton : styles.mobileButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.returnButtonText}>Return to Safety</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // 🔥 Background
  mobileBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  desktopBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    paddingHorizontal: 100,
  },

  // 🔥 Overlay
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    flex: 1,
  },

  // 🔥 Scroll Container
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },

  // 🔥 Titles
  mobileTitle: {
    fontSize: 40,
    color: '#ff4500',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    textShadowColor: '#8B0000',
    textShadowRadius: 25,
  },
  desktopTitle: {
    fontSize: 60,
    color: '#ff4500',
    textAlign: 'center',
    marginVertical: 40,
    fontWeight: 'bold',
    textShadowColor: '#8B0000',
    textShadowRadius: 35,
  },
  nateTitle: {
    fontSize: 24,
    color: '#ff4500',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textShadowColor: '#8B0000',
    textShadowRadius: 15,
  },
  spawnTitle: {
    fontSize: 24,
    color: '#ff4500',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textShadowColor: '#8B0000',
    textShadowRadius: 15,
  },

  // 🔥 Image Containers
  horizontalImageContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#111',
    paddingVertical: 20,
    borderRadius: isDesktop ? 20 : 15,
    borderColor: '#8B0000',
    borderWidth: isDesktop ? 6 : 4,
  },
  horizontalScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  // 🔥 Images
  armorImage: {
    resizeMode: "contain",
    borderRadius: isDesktop ? 20 : 15,
  },

  clickable: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: isDesktop ? 20 : 15,
    marginHorizontal: 10,
  },
  notClickable: {
    opacity: 0.8,
    borderRadius: isDesktop ? 20 : 15,
    marginHorizontal: 10,
  },

  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },

  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },

  // 🔥 Descriptions
  mobileDescription: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  desktopDescription: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 40,
    paddingHorizontal: 60,
  },

  // 🔥 Buttons
  mobileButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderColor: '#ff4500',
    borderWidth: 2,
    marginTop: 10,
  },
  desktopButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 15,
    borderColor: '#ff4500',
    borderWidth: 3,
    marginTop: 20,
  },

  returnButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NateScreen;