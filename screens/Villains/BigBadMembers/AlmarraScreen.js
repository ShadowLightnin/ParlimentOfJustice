import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const AlmarraScreen = () => {
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
  const imageSize = isDesktop ? windowWidth * 0.9 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.6;

  const armors = [
    { name: "Almarra", image: require("../../../assets/Villains/Almarra.jpg"), clickable: true },
  ];

  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={armor.name}
      style={armor.clickable ? styles.clickable : styles.notClickable}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
    >
      <Image
        source={armor.image}
        style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || 'Unknown'}; William Cummings
      </Text>
      {!armor.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/BigBad.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Almarra the Enchanted Empress</Text>
          </View>

          <View style={styles.imageContainer}>
            {armors.map(renderArmorCard)}
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              Almarra was not born—she was woven into existence by the threads of destiny itself. Once a mortal queen of an empire lost to time, she sought absolute control over fate, refusing to let her people fall to war, death, or the whims of lesser rulers. She turned to forbidden magic, bending the fabric of reality itself, but in doing so, she became something more—an entity unbound by time, space, or mortality. Her empire crumbled, swallowed by the abyss, yet Almarra remained, forever reshaping herself into the perfect being—an Empress of the Void, a Mistress of Enchantment.
            </Text>
            <Text style={styles.aboutText}>
              Now, she moves through the cosmos like a ghostly monarch, her presence heralded by shadowy fog and whispered prophecy. Her goals are unclear to all but herself, but one thing is certain: wherever Almarra treads, reality bends, kingdoms fall, and fate rewrites itself in her image.
            </Text>
            <Text style={styles.aboutText}>
              She does not conquer through brute force alone. She enthralls. She seduces. She reconstructs the will of others until they desire to serve her. Her enemies do not simply die—they are woven into her legend, their souls bound in eternal servitude.
            </Text>
            <Text style={styles.aboutText}>
              • Powers and Abilities:
            </Text>
            <Text style={styles.aboutText}>
              Weaver of Fate: Almarra does not just manipulate reality—she rewrites it. She can change the outcome of events, ensuring victory before a battle even begins.
            </Text>
            <Text style={styles.aboutText}>
              Celestial Enchantment: Her magic is an intoxicating mix of dark allure and overwhelming might, enchanting the minds and bodies of those who oppose her.
            </Text>
            <Text style={styles.aboutText}>
              Ethereal Form: Shifting between corporeal and ghostly, she cannot be truly touched unless she allows it. Weapons pass through her like smoke, yet her touch can bind a soul for eternity.
            </Text>
            <Text style={styles.aboutText}>
              Crown of Dominion: Her massive black crown, adorned with ancient jewels, is more than a symbol—it is a conduit of cosmic power, amplifying her magic beyond mortal comprehension.
            </Text>
            <Text style={styles.aboutText}>
              The Empress’s Fog: A creeping, dark gray mist follows her wherever she walks. It is said to whisper the names of those who will fall under her influence next.
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
    color: "purple",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#111",
    paddingVertical: 30,
    borderRadius: 20,
    position: "relative",
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
    color: "purple",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default AlmarraScreen;