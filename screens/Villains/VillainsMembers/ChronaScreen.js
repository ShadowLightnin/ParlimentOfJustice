import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Array of Sable-related images (replace with your actual image paths)
const characters = [
  { name: "Chrona", image: require("../../../assets/Villains/Chrona.jpg"), clickable: true },
  { name: "Chrona the Time-Bender", image: require("../../../assets/Villains/Chrona2.jpg"), clickable: true },
];

const ChronaScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
      style={[styles.card(isDesktop, windowWidth), character.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
    >
      <Image source={character.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>© {character.name || 'Unknown'}; William Cummings</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require("../../../assets/BackGround/Enlightened.jpg")} style={styles.background}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Chrona the Time-Bender</Text>
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
            <Text style={styles.aboutText}>• Nemesis: Sam Woodwell “Void Walker”</Text>

            <Text style={styles.aboutText}>
              Chrona, the Time-Bender: With control over small pockets of time, Chrona can slow, rewind, or even freeze time within a limited area. She uses her abilities to foresee potential obstacles to Erevos’s rule, manipulating events in his favor.
            </Text>

            <Text style={styles.aboutText}>
              She is obsessed with Void Walker (Sam) and was once his closest companion in the Enlightened. When he defected, it shattered her emotionally and spiritually. Chrona believes she alone understands him and is willing to manipulate the very timeline itself to bring him back.
            </Text>

            <Text style={styles.aboutText}>
              Erevos, wary of the dangerous paradoxes that could arise, has forbidden Chrona from altering the past in that way — though he still uses her immense powers to safeguard his plans.
            </Text>

            <Text style={styles.aboutText}>
              Chrona is cold, meticulous, and almost machine-like in her ability to calculate outcomes. Her loyalty to Erevos is partly out of devotion, but also because she sees his vision as the only constant in a timeline full of chaos.
            </Text>

            <Text style={styles.aboutText}>
              Despite her emotional turmoil, Chrona maintains a facade of perfection and control. Her armor is custom-built to regulate temporal shifts and her mind is trained to resist time-based feedback.
            </Text>

            <Text style={styles.aboutText}>
              She is one of Erevos’s most powerful and dangerous lieutenants — a master tactician who sees the battlefield five moves ahead.
            </Text>

            <Text style={styles.aboutText}>
              Her rivalry with Sable is intense, not just due to their competing love for Sam, but because Chrona sees emotion as weakness while Sable embraces it.
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
    color: "#D4AF37",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
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
    color: "#D4AF37",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ChronaScreen;
