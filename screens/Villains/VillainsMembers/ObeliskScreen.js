import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ObeliskScreen = () => {
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
    { name: "Obelisk", image: require("../../../assets/Villains/Obelisk.jpg"), clickable: true },
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
            <Text style={styles.title}>Obelisk the Warlock</Text>
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
              • <Text style={{ fontWeight: 'bold' }}>Obelisk</Text>: A cold and ancient sorcerer of cosmic age, Obelisk predates even the rise of modern civilization. He has walked among the ruins of empires and studied forces that predate mortal understanding.
            </Text>
            <Text style={styles.aboutText}>
              Obelisk views heroes as short-sighted meddlers who delay the inevitable unraveling of the world. In his eyes, their morals are dust—he believes only the dominion of the arcane can bring true stability.
            </Text>
            <Text style={styles.aboutText}>
              Unlike the flamboyant chaos of mortal warlocks, Obelisk is solemn, slow-speaking, and calculating. He speaks in riddles and incantations that bend the seams of reality, drawing from magic sourced beyond the veil of time.
            </Text>
            <Text style={styles.aboutText}>
              His loyalty to Erevos is not born of worship but curiosity—Obelisk witnessed Erevos's rise millennia ago and aligned himself out of interest in what he calls “the one who walks unmarred by death.”
            </Text>
            <Text style={styles.aboutText}>
              In truth, Erevos is aware that Obelisk may be a remnant of a Maw-touched being—something old and dangerous that doesn't realize its origin. He keeps Obelisk close, both as a tool and a potential threat.
            </Text>
            <Text style={styles.aboutText}>
              As a member of The Enlightened, Obelisk is the cultic spiritualist. He oversees rituals, relic awakenings, forbidden summoning, and astral rites that keep the cabal anchored across timelines and dimensions.
            </Text>
            <Text style={styles.aboutText}>
              His presence signals moments of great power-shifting; when Obelisk appears, it means reality itself is being tested, warped, or rewritten. Portals tremble in his wake, and his voice alone has been known to turn lesser minds into husks.
            </Text>
            <Text style={styles.aboutText}>
              Obelisk is one of Erevos’s most relied-upon advisors—equal in trust to Noctura—and the keeper of knowledge long forbidden even in ancient libraries. Together, they form the ideological core of the Enlightened’s arcane arm.
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

export default ObeliskScreen;