import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Array of Sable-related images (replace with your actual image paths)
const characters = [
  { name: "Lane Mercury", image: require("../../../assets/Villains/RedMercury.jpg"), clickable: true },
  { name: "Red Murcury", image: require("../../../assets/Villains/RedMercury2.jpg"), clickable: true }, // Example placeholder
  // Add more images here as needed
];

const RedMercuryScreen = () => {
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

  // Render each image card
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
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Lane Mercury</Text>
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
  • <Text style={{ fontWeight: 'bold' }}>Red Mercury</Text>: Born Lane Mercury, he is the master manipulator of global influence, unmatched in wealth, charisma, and cold calculation.
</Text>
<Text style={styles.aboutText}>
Red Mercury views heroes as naive idealists—fools who disrupt the natural order with sentiment and chaos. To him, their moral codes are liabilities that prevent true progress.
</Text>
<Text style={styles.aboutText}>
  A former tech mogul turned political kingmaker, Red Mercury presents himself as a benevolent futurist and public philanthropist while secretly funding warlords, black-ops units, and authoritarian regimes to destabilize the world and create dependence on his empire. He serves as the public face and financial engine behind The Enlightened, ensuring Erevos’s rise goes unseen by the masses.
</Text>
<Text style={styles.aboutText}>
  Lane’s influence stretches across the globe—from controlling stock markets and digital infrastructure to rigging elections through deepfake media networks. He is untouchable, operating with diplomatic immunity and wielding entire governments as puppets.
</Text>
<Text style={styles.aboutText}>
  His sprawling conglomerate, Mercury Global, is the world’s most powerful megacorp, masking its true operations behind layers of shell companies and corporate espionage. It funds most anti-hero legislation, produces anti-metahuman tech, and secretly backs extremist movements to increase public fear and justify government crackdowns.
</Text>
<Text style={styles.aboutText}>
  Lane’s loyalty to Erevos is rooted in ideology: he sees Erevos as the only being capable of creating the perfect, hierarchical world order. Unlike others who fear Erevos, Lane admires him as the apex of evolution and sees himself as the architect behind Erevos’s ascent.
</Text>
<Text style={styles.aboutText}>
  Lane also employs his personal assassin, <Text style={{ fontWeight: 'bold' }}>Blackout</Text>, a silent operative cloaked in energy disruption fields, capable of neutralizing electronics and rendering targets unconscious in seconds. Blackout acts as Lane’s shadow, eliminating threats before they ever reach the spotlight. Silent, surgical, and surgically loyal, Blackout has never failed a mission—his presence often unconfirmed, his victims erased without trace.
</Text>
<Text style={styles.aboutText}>
  Red Mercury is the political puppetmaster and financial juggernaut of The Enlightened. He commands vast empires of wealth, media, and industry, pulling the strings behind world leaders and global institutions. Every law passed, every crisis exploited, every conflict prolonged—his influence shapes it all. He ensures the cabal’s shadow remains cast across every government on Earth.
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

export default RedMercuryScreen;
