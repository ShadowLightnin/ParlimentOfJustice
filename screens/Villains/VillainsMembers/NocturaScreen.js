import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const NocturaScreen = () => {
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
    { name: "Noctura the Illusionist", image: require("../../../assets/Villains/Noctura.jpg"), clickable: true },
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
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Noctura the Illusionist</Text>
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
              • <Text style={{ fontWeight: 'bold' }}>Noctura the Illusionist</Text>: Born Liora Valen, she is the reigning queen of illusion and deception, able to conjure reality-warping hallucinations that cloud the minds of even the strongest heroes.
            </Text>
            <Text style={styles.aboutText}>
              Noctura sees heroes not as saviors, but as distractions—meddlesome idealists who prolong suffering through sentimentality. She believes true peace can only come through control, not compassion.
            </Text>
            <Text style={styles.aboutText}>
              A former child prodigy raised in a secretive monastery of mentalists, Liora mastered techniques of dream-weaving and psychic suggestion by adolescence. She later overthrew her nation's monarchy, enthralling her people into a permanent state of obedience.
            </Text>
            <Text style={styles.aboutText}>
              She rules as a sovereign empress, her image beloved and feared across continents. Her broadcasts induce mass hypnosis, shaping the minds of millions to align with the goals of The Enlightened.
            </Text>
            <Text style={styles.aboutText}>
              Through her illusions, Noctura can impersonate world leaders, manufacture fake disasters, or conceal entire fleets. She often appears in multiple places at once, sowing disinformation with chilling precision.
            </Text>
            <Text style={styles.aboutText}>
              Her loyalty to Erevos stems from shared philosophy—both see freedom as chaos and believe the only path to order is universal manipulation. She is his high priestess of perception, shaping belief itself as a weapon.
            </Text>
            <Text style={styles.aboutText}>
              But beneath her calm exterior is a deep bitterness toward those who still believe in free will. Noctura has seen the worst of humanity's choices and considers heroism a dangerous illusion in itself.
            </Text>
            <Text style={styles.aboutText}>
              Noctura is the eye behind the veil, the voice in the dream, and the spell cast over society. She doesn’t need to lift a finger to destroy her enemies—she simply convinces them they’re already defeated.
            </Text>
            <Text style={styles.aboutText}>
              She is regarded as Erevos’s primary lieutenant, a co-strategist alongside Obelisk and often the one entrusted with the execution of the cabal’s most delicate plans. When Erevos does not speak, Noctura’s voice becomes his will.
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

export default NocturaScreen;