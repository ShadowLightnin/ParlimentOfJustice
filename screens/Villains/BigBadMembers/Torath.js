import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🎨 Torath palette — Gray + Deep Red
const COLORS = {
  void: "rgba(0, 0, 0, 0.86)",
  steel: "rgba(18, 18, 20, 0.96)",
  steelSoft: "rgba(26, 26, 30, 0.92)",
  grayEdge: "rgba(170, 170, 175, 0.55)",
  grayHard: "rgba(210, 210, 220, 0.85)",
  red: "#8B0000", // deep red
  redEdge: "rgba(139, 0, 0, 0.88)",
  redSoft: "rgba(139, 0, 0, 0.45)",
  text: "#F7F7F7",
  textSoft: "rgba(245, 245, 245, 0.80)",
};

// 🎧 Tracks (swap to your Torath audio when ready)
const TRACKS = [
  {
    id: "torath_main",
    label: "Omega Dominion",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "torath_alt",
    label: "Black Crucible March",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  { name: "Torath", image: require("../../../assets/Villains/Torath.jpg"), clickable: true },
];

const Torath = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // 🎧 Audio state
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const isDesktop = windowWidth >= 768;

  const safeTracks = Array.isArray(TRACKS) && TRACKS.length ? TRACKS : [];
  const safeIndex = safeTracks.length ? trackIndex % safeTracks.length : 0;
  const currentTrack = safeTracks.length ? safeTracks[safeIndex] : null;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  // ───────── AUDIO HELPERS ─────────
  const unloadSound = useCallback(async () => {
    if (sound) {
      try { await sound.stopAsync(); } catch {}
      try { await sound.unloadAsync(); } catch {}
      setSound(null);
    }
  }, [sound]);

  const loadAndPlayTrack = useCallback(
    async (index) => {
      if (!safeTracks.length) return;
      await unloadSound();
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          safeTracks[index].source,
          { isLooping: true, volume: 0.85 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Torath track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound, safeTracks]
  );

  const playTheme = async () => {
    if (!safeTracks.length) return;
    if (sound) {
      try {
        await sound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Play error", e);
      }
    } else {
      await loadAndPlayTrack(safeIndex);
    }
  };

  const pauseTheme = async () => {
    if (!sound) return;
    try {
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (e) {
      console.error("Pause error", e);
    }
  };

  const cycleTrack = async (direction) => {
    if (!safeTracks.length) return;
    const nextIndex = (trackIndex + direction + safeTracks.length) % safeTracks.length;
    setTrackIndex(nextIndex);
    if (isPlaying) {
      await loadAndPlayTrack(nextIndex);
    } else {
      await unloadSound();
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        unloadSound();
        setIsPlaying(false);
      };
    }, [unloadSound])
  );

  const handleBackPress = async () => {
    await unloadSound();
    setIsPlaying(false);
    navigation.goBack();
  };

  // ───────── RENDER CARD ─────────
  const renderCharacterCard = (character, index) => (
    <TouchableOpacity
      key={`${character.name}-${index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        character.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
      activeOpacity={0.9}
    >
      <Image source={character.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>© {character.name || "Unknown"}; William Cummings</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/BigBad.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* 🎧 MUSIC BAR */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(-1)}>
            <Text style={styles.trackButtonText}>⟵</Text>
          </TouchableOpacity>

          <View style={styles.trackInfoGlass}>
            <Text style={styles.trackLabel}>Track:</Text>
            <Text style={styles.trackTitle}>{currentTrack?.label || "No Track"}</Text>
          </View>

          <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(1)}>
            <Text style={styles.trackButtonText}>⟶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButton, (isPlaying || !safeTracks.length) && styles.musicButtonDisabled]}
            onPress={playTheme}
            disabled={isPlaying || !safeTracks.length}
          >
            <Text style={styles.musicButtonText}>{isPlaying ? "Playing" : "Play"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButtonSecondary, (!isPlaying || !safeTracks.length) && styles.musicButtonDisabled]}
            onPress={pauseTheme}
            disabled={!isPlaying || !safeTracks.length}
          >
            <Text style={styles.musicButtonTextSecondary}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* HEADER */}
          <View style={styles.headerOuter}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Torath The Devourer</Text>
                <Text style={styles.subtitle}>Tyranny • Cosmic Annihilation • Omega Supremacy</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* ABOUT — LORE KEPT INTACT */}
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
            <Text style={styles.aboutText}>• Powers and Abilities:</Text>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.void,
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.steel,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.redEdge,
    shadowColor: COLORS.red,
    shadowOpacity: 0.30,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.grayHard,
    backgroundColor: COLORS.steelSoft,
    marginRight: 6,
  },
  trackButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(12, 12, 14, 0.92)",
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: COLORS.textSoft,
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#FFF1F1",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 210, 210, 0.55)",
  },
  musicButtonSecondary: {
    backgroundColor: COLORS.steelSoft,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#160000",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#FFF1F1",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.steelSoft,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: COLORS.text,
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.steel,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    shadowColor: COLORS.red,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#E8E8EA",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 220, 220, 0.75)",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: COLORS.steel,
    borderWidth: 1,
    borderColor: COLORS.grayEdge,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF1F1",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  sectionDivider: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: COLORS.redEdge,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // CARD
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    marginRight: 18,
    backgroundColor: COLORS.steel,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    shadowColor: COLORS.red,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  }),
  clickable: {},
  notClickable: { opacity: 0.8 },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 12,
    color: "#FFF1F1",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },

  // ABOUT
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: COLORS.steel,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    shadowColor: COLORS.red,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E8E8EA",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "rgba(245, 245, 245, 0.88)",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Torath;
