import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const MallikhanScreen = () => {
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
    { name: "Mal'likhan", image: require("../../../assets/Villains/Mallikhan.jpg"), clickable: true },
    { name: "Girl Mal'likhan", image: require("../../../assets/Villains/FMallikhan.jpg"), clickable: true },
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
      <Text style={styles.cardName}>
        © {character.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>  );

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
            <Text style={styles.title}>Mal'likhan</Text>
          </View>

          <ScrollView
            horizontal={true}
            style={styles.horizontalImageContainer}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {characters.map(renderCharacterCard)}
          </ScrollView>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            • Nemesis: Aileen Eduria "Ariata"

            </Text>
            <Text style={styles.aboutText}>
            • Backstory: Mal’likhan, originally named Alonzo Cruz, grew up in a family steeped in Filipino folklore and mysticism. Alonzo was drawn to these tales, fascinated by the darker myths of spirits and warriors who wielded power over life and death. After discovering ancient artifacts, he was possessed by a vengeful spirit, transforming him into Mal’likhan, a conduit of darkness and malevolent magic. He believes he is the true inheritor of Filipino strength, bound to the forces of night and shadow. Alonzo feels that Aileen, with her heritage and powers, dishonors this legacy by aligning herself with “Western ideals” of heroism. Driven by pride and resentment, Mal’likhan fights to reclaim what he sees as a rightful heritage of strength and power.

            </Text>
            <Text style={styles.aboutText}>
            • Abilities:
• Soul Drain: Drains strength and energy from his enemies to weaken them.
• Spectral Warriors: Summons shadowy figures inspired by Filipino folklore to attack Aileen in combat.
• Shadow Manipulation: Uses shadows to hide, strike from unexpected angles, and confuse his enemies.

            </Text>
            <Text style={styles.aboutText}>
            • Weapon: A jagged Kris Blade imbued with dark energy, countering Aileen's Kampilan with lethal precision.

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
  horizontalImageContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    width: "100%", // Ensure full width for scrolling
  },
  horizontalScrollContent: {
    flexDirection: "row", // Ensure horizontal layout
    alignItems: "center",
    paddingVertical: 10,
  },
  armorImage: {
    resizeMode: "contain",
  },
  clickable: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginHorizontal: 10, // Space between cards in horizontal scroll
  },
  notClickable: {
    opacity: 0.8,
    borderRadius: 15,
    marginHorizontal: 10,
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

export default MallikhanScreen;
