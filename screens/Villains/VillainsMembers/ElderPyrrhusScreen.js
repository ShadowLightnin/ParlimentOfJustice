import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ElderPyrrhusScreen = () => {
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

  const characters = [
    { name: "Elder Pyrrhus", image: require("../../../assets/Villains/ElderPyrrhus.jpg"), clickable: true },
    // Add more related characters here if desired
  ];

  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
      style={[styles.card(isDesktop, windowWidth), character.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
    >
      <Image
        source={character.image}
        style={styles.armorImage}
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {character.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Villains.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Elder Pyrrhus</Text>
          </View>

          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={windowWidth * 0.7 + 20}
              decelerationRate="fast"
            >
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              • Nemesis: Spencer McNeil "Annihilus”
            </Text>
            <Text style={styles.aboutText}>
              • Backstory: A former tribal leader cast out for his brutal interpretation of strength, Elder Pyrrhus believes only the ruthless survive. He scorned modern society, retreating into the wilderness where he honed his powers through a brutal connection with ancient mountain spirits. These spirits grant him immense strength and the power to manipulate fire, making him nearly invulnerable in battle. When he hears of Spencer’s Annihilus persona, Elder Pyrrhus sees a potential challenger for his title as the ultimate warrior. His fiery skull helmet represents his intent to incinerate Spencer’s ideals of heroism, proving that true power lies in destruction without restraint.
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
    color: "#ff3131", // Red hue from original
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  notClickable: {
    opacity: 0.8,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)",
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
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
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
    color: "#ff3131", // Red hue from original
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ElderPyrrhusScreen;