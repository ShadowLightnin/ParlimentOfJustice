import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ErevosScreen = () => {
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

  const mainCharacter = [
    { name: "Erevos the Ascendancy", image: require("../../../assets/Villains/Erevos.jpg"), clickable: true },
  ];

  const secondaryCharacters = [
    { name: "Erevan", image: require("../../../assets/Villains/Erevan.jpg"), clickable: true },
    { name: "Erevos the Eternal", image: require("../../../assets/Villains/GreatErevos.jpg"), clickable: true },
    { name: "Erevos", image: require("../../../assets/Villains/Erevos2.jpg"), clickable: true },
  ];

  const renderCharacterCard = (character, isSecondary = false) => (
    <TouchableOpacity
      key={character.name}
      style={[styles.card(isDesktop, windowWidth, isSecondary), character.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
    >
      <Image
        source={character.image}
        style={styles.armorImage}
      />
      <View style={styles.transparentOverlay} />
      {/* <Text style={styles.cardName}>
        {isSecondary ? character.name : `© ${character.name || 'Unknown'}; William Cummings`}
      </Text> */}
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
            <Text style={styles.title}>Erevos</Text>
          </View>

          {/* Main Erevos Image (Single, Large, Centered) */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={windowWidth * 0.7 + 20}
              decelerationRate="fast"
            >
              {mainCharacter.map((character) => renderCharacterCard(character, false))}
            </ScrollView>
          </View>

          {/* Secondary Images (Horizontal Scroll) */}
          <Text style={styles.secondaryTitle}>Erevos’s Legacy</Text>
          <ScrollView
            horizontal
            style={styles.horizontalImageContainer}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {secondaryCharacters.map((character) => renderCharacterCard(character, true))}
          </ScrollView>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              The Parliament of Justice’s Big Bad
            </Text>
<Text style={styles.aboutText}>
  Once a prehistoric warlord named Erevan, he was struck by a fragment from a cosmic meteor that crashed to Earth during his early conquests. Instead of dying, he rose reborn—immortal, empowered, and driven. Taking the name <Text style={{ fontStyle: 'italic' }}>Erevos</Text>, he disappeared from history’s spotlight and began guiding it from the shadows. With millennia of warfare, manipulation, and conquest behind him, Erevos seeks to reshape the world into an eternal empire ruled by might, order, and evolutionary supremacy.
</Text>

<Text style={styles.aboutText}>
  • Powers and Abilities:
</Text>
<Text style={styles.aboutText}>
  • Immortality: Unaging and nearly unkillable, Erevos regenerates from almost any wound, making death a temporary inconvenience.
</Text>
<Text style={styles.aboutText}>
  • Enhanced Physique: Strength, speed, and endurance that exceed human limits; his ancient body has adapted beyond its original mortal frame.
</Text>
<Text style={styles.aboutText}>
  • Master Strategist: Possessing thousands of years of military, political, and psychological experience, Erevos is an unmatched tactician.
</Text>
<Text style={styles.aboutText}>
  • Cosmic Energy Manipulation: Residual meteorite power grants Erevos control over dark energy fields, force projection, and telekinesis.
</Text>
<Text style={styles.aboutText}>
  • Meteor Staff: Erevos wields a staff forged from shards of the very meteor that changed him—capable of absorbing energy and unleashing cosmic force.
</Text>
<Text style={styles.aboutText}>
  • Ancestral Sigil: As the original meta-human, Erevos can suppress or command meta-powers through an ancient artifact tied to his bloodline.
</Text>

<Text style={styles.aboutText}>
  Erevos’s Timeline:
</Text>
<Text style={styles.aboutText}>
  1. <Text style={{ fontWeight: 'bold' }}>Erevos Primeval</Text> – His origin form shortly after gaining immortality, clad in bronze-age armor, still discovering the limits of his new power.
</Text>
<Text style={styles.aboutText}>
  2. <Text style={{ fontWeight: 'bold' }}>Erevos the Conqueror</Text> – A medieval tyrant who led empires across continents, clad in obsidian-black armor streaked with star-metal.
</Text>
<Text style={styles.aboutText}>
  3. <Text style={{ fontWeight: 'bold' }}>Modern Erevos</Text> – A quiet kingmaker operating behind global conflicts, dressed in regal armor and trench-like coats woven with cosmic threads.
</Text>
<Text style={styles.aboutText}>
  4. <Text style={{ fontWeight: 'bold' }}>Erevos Ascendant</Text> – His future form after conquering half the galaxy, now nearly divine, infused with red cosmic fire and armored in god-forged blacksteel.
</Text>

<Text style={styles.aboutText}>
  Current Agenda: <Text style={{ fontStyle: 'italic' }}>Project Ascendancy</Text>
</Text>
<Text style={styles.aboutText}>
  Erevos’s final vision is the unification of Earth and its meta-humans under his immortal rule. He plans to harvest the powers of heroes using the Celestial Eye and activate the Ancestral Sigil, binding all meta-kind to him. He will then reshape Earth’s fabric using cosmic energy granted through a dangerous alliance with Torath—the Devourer.
</Text>

<Text style={styles.aboutText}>
  The Enlightened:
</Text>
<Text style={styles.aboutText}>
  Erevos leads a secret cabal known as <Text style={{ fontWeight: 'bold' }}>The Enlightened</Text>, mirroring the ancient Light. Each Lieutenant represents a domain of power and fulfills a vital role in Erevos’s grand strategy:
</Text>
<Text style={styles.aboutText}>
  • <Text style={{ fontWeight: 'bold' }}>Chrona</Text>: A time-bending manipulator of fate and contingency. She sees alternate timelines and subtly influences causality to ensure Erevos's future dominance.
</Text>
<Text style={styles.aboutText}>
  • <Text style={{ fontWeight: 'bold' }}>Noctura</Text>: A master illusionist and psychological manipulator. Noctura uses hallucinations and misinformation to cloud mass perception, control narratives, and disrupt social cohesion. Behind the veil of her illusions, she also commands a network of elite spies and seduction agents, subtly turning diplomats, influencers, and even heroes into pawns of The Enlightened.</Text>
<Text style={styles.aboutText}>
  • <Text style={{ fontWeight: 'bold' }}>Sable</Text>: Erevos's most trusted and lethal assassin. A master of dimensional phasing, she can enter and exit reality to execute targets without leaving a trace. Known to always finish the mission.
</Text>
<Text style={styles.aboutText}>
  • <Text style={{ fontWeight: 'bold' }}>Obelisk</Text>: A mystic warlock who commands dark rituals and ancient energy. He maintains Erevos’s arcane strongholds and opens portals to cosmic realms, allowing communication with entities beyond mortal comprehension.
</Text>
<Text style={styles.aboutText}>
  • <Text style={{ fontWeight: 'bold' }}>Titanus</Text>: A genetically and cybernetically enhanced juggernaut. As Erevos’s personal enforcer, Titanus crushes resistance movements and wipes out rebellious metahumans with brute force.
</Text>
<Text style={styles.aboutText}>
  • <Text style={{ fontWeight: 'bold' }}>Red Mercury</Text>: The political puppetmaster and financial juggernaut of The Enlightened. He commands vast empires of wealth, media, and industry, pulling the strings behind world leaders and global institutions. Every law passed, every crisis exploited, every conflict prolonged—his influence shapes it all. Red Mercury ensures the cabal’s shadow remains cast across every government on Earth.</Text>


<Text style={styles.aboutText}>
  Pact with Torath – The Devourer:
</Text>
<Text style={styles.aboutText}>
  Erevos made a cosmic bargain with Torath, the Devourer—a being who consumes worlds. Erevos promised him Earth and its meta-humans in exchange for power. Their deal is simple: whoever claims Earth first keeps it. If Erevos fails, Torath devours everything.
</Text>
<Text style={styles.aboutText}>
  The alliance is unstable—both plot to betray the other once Ascendancy is complete.
</Text>

<Text style={styles.aboutText}>
  Erevos’s Legacy:
</Text>
<Text style={styles.aboutText}>
  Erevos is not just a threat—he is the source. All meta-powers on Earth stem from his bloodline. Many unknowingly descend from him, and his influence spans generations. He believes their destiny is to return to his rule.
</Text>
<Text style={styles.aboutText}>
  In the Parliament of Justice, Erevos sees only delay. In his mind, peace is weakness, and only through struggle can greatness be born.
</Text>

<Text style={styles.aboutText}>
  To defeat Erevos is to overcome the very shadow of humanity’s darkest ambition.
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
  horizontalImageContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  horizontalScrollContent: {
    flexDirection: 'row',
    alignItems: "center",
    paddingVertical: 5,
  },
  secondaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  card: (isDesktop, windowWidth, isSecondary) => ({
    width: isSecondary ? (isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.6) : (isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9),
    height: isSecondary ? (isDesktop ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.6) : (isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7),
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

export default ErevosScreen;