import React from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity, Dimensions 
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Screen Size Check
const isDesktop = SCREEN_WIDTH > 600;

const NateScreen = () => { 
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/NateEmblem.jpg')} 
      style={isDesktop ? styles.desktopBackground : styles.mobileBackground}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* Title */}
          <Text style={isDesktop ? styles.desktopTitle : styles.mobileTitle}>
            🔥 Demon Lord Nate 🔥
          </Text>

          {/* Image with Transparent Overlay */}
          <View style={isDesktop ? styles.desktopImageContainer : styles.mobileImageContainer}>
            <Image 
              source={require('../../../assets/Villains/Nate.jpg')} 
              style={isDesktop ? styles.desktopImage : styles.mobileImage} 
            />
            <View style={styles.transparentOverlay} />
          </View>

          {/* Description */}
          <Text style={isDesktop ? styles.desktopDescription : styles.mobileDescription}>
            The mighty Demon Lord Nate reigns supreme, feared by all who cross his path. 
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
    paddingHorizontal: 100, // Extra width space for desktop
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

  // 🔥 Title
  mobileTitle: {
    fontSize: 40,
    color: '#ff4500',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    textShadowColor: '#8B0000',
    textShadowRadius: 25,
  },
  desktopTitle: {
    fontSize: 60, // Larger text for desktop presence
    color: '#ff4500',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
    textShadowColor: '#8B0000',
    textShadowRadius: 35,
  },

  // 🔥 Image Containers
  mobileImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderColor: '#8B0000',
    borderWidth: 4,
    borderRadius: 15,
  },
  desktopImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderColor: '#8B0000',
    borderWidth: 6,
    borderRadius: 20,
  },

  // 🔥 Images
  mobileImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 15,
  },
  desktopImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.9,
    borderRadius: 20,
  },

  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },

  // 🔥 Descriptions
  mobileDescription: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  desktopDescription: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
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
