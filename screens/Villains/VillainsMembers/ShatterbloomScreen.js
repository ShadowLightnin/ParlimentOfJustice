import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ShatterbloomScreen = () => {
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
    { name: "Shatterbloom", image: require("../../../assets/Villains/Shatterbloom.jpg"), clickable: true },
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
      source={require("../../../assets/BackGround/Villains.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Shatterbloom</Text>
          </View>

          <View style={styles.imageContainer}>
            {characters.map(renderCharacterCard)}
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            • Nemesis: Jennifer McNeil "Kintsugi”

            </Text>
            <Text style={styles.aboutText}>
            • Backstory: A glass sculptor whose work shattered along with her mind during a failed experiment, Shatterbloom can now break apart and reform her body at will. She sees Jennifer’s Kintsugi theme as shallow, dismissing her acceptance of “brokenness” as weak. Shatterbloom’s fractured form is a weapon, and she seeks to break Jennifer’s calm, attacking her with shards that represent her own shattered psyche. Her goal is to prove that true beauty comes only through destruction, and she believes Jennifer’s acceptance of her brokenness is nothing but a disguise for fragility.

            </Text>
            <Text style={styles.aboutText}>
            • Powers: The ability to break apart and reform, similar to Jennifer's "Kintsugi," but uses her fragmented form offensively, launching shards at her enemies.

            </Text>
            <Text style={styles.aboutText}>
            • Weapon: Twin glass daggers that shatter and reform, sending deadly shards in all directions.

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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#111", // Dark background from original
    paddingVertical: 30,
    borderRadius: 20,
    position: "relative", // Required for overlay
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

export default ShatterbloomScreen;
