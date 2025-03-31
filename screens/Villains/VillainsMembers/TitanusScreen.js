import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const TitanusScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;
  const imageSize = isDesktop ? windowWidth * 0.6 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.6;

  const characters = [
    { name: "Titanus", image: require("../../../assets/Villains/Titanus.jpg"), clickable: true },
    // Add more related characters here if desired
  ];

  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
      style={character.clickable ? styles.clickable : styles.notClickable}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
    >
      <Image
        source={character.image}
        style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
      />
      <View style={styles.transparentOverlay} />
      {character.name && <Text style={styles.cardName}>{character.name}</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Titanus</Text>
          </View>

          <View style={styles.imageContainer}>
            {characters.map(renderCharacterCard)}
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            Titanus, the Titan of Steel: Enhanced by experimental 
            cybernetics and mutated DNA, Titanus is the muscle of The Enlightened, 
            with strength that rivals even the strongest Titans of the Parliament. 
            His primary role is to crush resistance with brute force. He is a bodyguard for Everos, as if he needs one.
            </Text>
            <Text style={styles.aboutText}>

            </Text>
            <Text style={styles.aboutText}>

            </Text>
            <Text style={styles.aboutText}>

            </Text>  
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D4AF37", // Gold-like hue from original
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    // backgroundColor: "#111", // Commented out as in original; uncomment if desired
    paddingVertical: 30,
    borderRadius: 20,
  },
  armorImage: {
    resizeMode: "contain",
  },
  clickable: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
  },
  notClickable: {
    opacity: 0.8,
    borderRadius: 15,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent for visual but clickable
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
  aboutSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 15,
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D4AF37", // Gold-like hue from original
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default TitanusScreen;
