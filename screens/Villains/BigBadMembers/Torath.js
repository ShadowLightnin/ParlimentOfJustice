import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Torath = () => {
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
    { name: "Torath", image: require("../../../assets/Villains/Torath.jpg"), clickable: true },
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
            <Text style={styles.title}>Torath The Devourer</Text>
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
  Torath the Devourer is the tyrannical overlord of Korrthuun, a once-thriving world now reduced to a scorched industrial husk. Once known as Draegos, his planet fell into ruin under his iron rule and singular vision of absolute order. Torath believes free will is a plague — that peace can only come through total control and obedience to his will.
</Text>
<Text style={styles.aboutText}>
  He seeks the Omega Core, a reality-warping relic buried beneath Korrthuun, capable of rewriting the laws of existence. With it, Torath aims to impose a new order upon the galaxy — one where individuality, chaos, and rebellion are erased, and every soul serves the singular truth: Torath’s dominion.
</Text>
<Text style={styles.aboutText}>
  In form, Torath is a towering, stone-skinned juggernaut. His gaze alone carries the destructive force of Doom Vision, incinerating anything defiant in his path. He commands Omega Dominion — control over matter, will, and even time in localized zones — allowing him to bend the battlefield to his advantage.
</Text>
<Text style={styles.aboutText}>
  His armies, the Nihilborn, are legion: soulless war-machines bred in the forges of Korrthuun, programmed to obey without hesitation. At the heart of his empire lies the Black Crucible, a citadel of endless flame and unyielding stone, housing the Omega Core and his throne of control.
</Text>
<Text style={styles.aboutText}>
  Torath’s alliance with Erevos is one of necessity and shared philosophy. While Erevos manipulates through shadow and influence, Torath is the hammer — the inevitable conqueror who imposes truth through fire and war. They share a vision of galactic unification, where the weak are ruled and peace is manufactured through power.
</Text>
<Text style={styles.aboutText}>
  Though united, Torath does not trust Erevos. He watches the immortal manipulator from afar, aware that betrayal is inevitable between gods. Yet he does not fear it. For in Torath’s mind, all things — even betrayal — serve the path to control. Even Erevos will kneel, in time.
</Text>
<Text style={styles.aboutText}>
  • Powers and Abilities:
</Text>
<Text style={styles.aboutText}>
  Omega Dominion: The ability to warp matter, time, and will within a certain radius, shaping reality into his desired form.
</Text>
<Text style={styles.aboutText}>
  Doom Vision: Twin beams from his eyes that erase matter, bend space, or destroy willpower — adaptable, guided, and nearly unstoppable.
</Text>
<Text style={styles.aboutText}>
  Planetary Manipulation: Through the Omega Core, Torath can alter tectonics, climate, and atmospheric control across entire worlds.
</Text>
<Text style={styles.aboutText}>
  Superhuman strength, speed, and invulnerability, rivaling the strongest heroes and beings in the universe. No weapon forged by mortal hands has pierced his armor.
</Text>
<Text style={styles.aboutText}>
  Strategic genius: He has conquered dozens of worlds not only through war, but through psychological and ideological subjugation.
</Text>
<Text style={styles.aboutHeader}>Children of Torath</Text>

<Text style={styles.aboutText}>
  Torath does not fight alone. His vision of a unified galaxy is enforced by an elite circle known as the Nihilborn Generals — seven lieutenants forged, corrupted, or chosen to be the enforcers of his will across the stars.
</Text>

<Text style={styles.aboutText}>
  • **Wrothar** – The Wrath Incarnate: A colossus of scorched steel and fused bone. Titanus is Torath's “firstborn,” bred in the fires of the Black Crucible to be the living embodiment of domination. He leads from the front, annihilating cities with his hammer, *Ruinwake*.
</Text>

<Text style={styles.aboutText}>
  • **Cyrak Vorn** – The Architect of Order: Once a galactic philosopher, now broken and reshaped into the mind of Torath’s campaigns. He oversees planetary indoctrination, rewriting culture and history into subservience.
</Text>

<Text style={styles.aboutText}>
  • **Maelstra** – The Song of Silence: A siren-like assassin whose voice can erase memory and will. She subdues rebellion before it can rise. Her silence fields have turned entire revolts into docile parades.
</Text>

<Text style={styles.aboutText}>
  • **Gorr-Mire** – The Planet Eater: A grotesque, biomechanical devourer sent to worlds that resist conquest. He liquifies resources and populations alike to fuel Torath's empire.
</Text>

<Text style={styles.aboutText}>
  • **Vel’Zhar the Cold** – Torath’s Interrogator: Wields cryo-torture and fearcraft to extract secrets and break psyches. Entire fleets have surrendered at the rumor of his arrival.
</Text>

<Text style={styles.aboutText}>
  • **Virelia** – Flamebound Strategist: Torath’s adopted “daughter,” once a rebel general who fell in battle. He revived her as a burning phoenix of vengeance and strategy. She commands orbital warfronts with fiery precision.
</Text>

<Text style={styles.aboutText}>
  • **Nullis Prime** – The Last Word: A faceless executor who delivers Torath’s will to defiant worlds. His blade, *Final Order*, never leaves a survivor.
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

export default Torath;