import React, { useState, useEffect } from "react"; 
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const VortigarScreen = () => {
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
    { name: "Vortigar the Inevitable", image: require("../../../assets/Villains/Vortigar.jpg"), clickable: true },
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
      {!character.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
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
            <Text style={styles.title}>Vortigar the Inevitable</Text>
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
              Vortigar is a cosmic warlord who believes in the doctrine of "Cosmic Equilibrium." He sees civilizations as endlessly consuming resources, leading to inevitable collapse. To "preserve existence," he enforces mass culling across star systems. His race was wiped out by unchecked expansion, and he now enacts ruthless “cleansings” to ensure no species meets the same fate—by his logic, survival must be earned.
            </Text>
            <Text style={styles.aboutText}>
              He once served the cosmic tribunal as a cosmic judge, but after witnessing the council's apathy during a galactic extinction event, he abandoned their order and declared that life itself must be trimmed, not preserved. He forged his own path, one soaked in conquest and cosmic entropy.
            </Text>
            <Text style={styles.aboutText}>
              Vortigar views heroes as hypocrites—champions of unchecked growth and emotional mercy. He sees them as the very disease that destroyed his people. To him, they are blind idealists who prolong suffering instead of curing it.
            </Text>
            <Text style={styles.aboutText}>
              • Powers and Abilities:
            </Text>
            <Text style={styles.aboutText}>
              Celestial Physiology – Nearly indestructible and impossibly strong.
            </Text>
            <Text style={styles.aboutText}>
              Entropy Gauntlet – A gauntlet capable of unraveling energy and matter at will.
            </Text>
            <Text style={styles.aboutText}>
              Fate Domination – Can peer into potential futures to determine which must be "pruned."
            </Text>  
            <Text style={styles.aboutText}>
              Graviton Will – Can manipulate gravity fields across planetary ranges, collapsing cities or suspending armies.
            </Text>
            <Text style={styles.aboutText}>
              Void Step – Vortigar may temporarily vanish from time to avoid death or reset a timeline.
            </Text>
            <Text style={styles.aboutText}>
              • The Equinox Blades – Twin curved swords forged from dead stars. One severs time, the other severs space.
            </Text>
            <Text style={styles.aboutText}>
              • Followers — The Dread Starborn:
            </Text>
            <Text style={styles.aboutText}>
              1. Nihzera, The Shard Queen – Mistress of pain and manipulation, with crystalline armor and a venomous mind.
            </Text>
            <Text style={styles.aboutText}>
              2. Xovek the Endborn – A brute of pure antimatter, fueled by hunger and destruction.
            </Text>
            <Text style={styles.aboutText}>
              3. Kaelthys – Vortigar’s executioner, a silent warrior whose blade erases souls from existence.
            </Text>
            <Text style={styles.aboutText}>
              4. Vaedra the Speaker – A telepathic herald who delivers Vortigar’s edicts through mental invasion.
            </Text>
            <Text style={styles.aboutText}>
              5. Myrr – A childlike being who manipulates time loops to ensnare civilizations in endless failure.
            </Text>
            <Text style={styles.aboutText}>
              These five form the Dread Starborn, Vortigar’s personal death choir, and herald his arrival across galaxies.
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
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
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

export default VortigarScreen;
