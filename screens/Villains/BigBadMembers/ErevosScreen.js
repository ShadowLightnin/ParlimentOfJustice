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

// 🎨 Erevos palette — royal dark purple + cosmic deep blue + gunmetal + dark red
const COLORS = {
  void: "rgba(0, 0, 0, 0.86)",
  gunmetal: "rgba(18, 18, 22, 0.96)",
  gunmetalSoft: "rgba(26, 26, 34, 0.92)",
  cosmicBlue: "rgba(10, 16, 36, 0.92)",
  royalPurple: "#3B1C5A",
  royalPurpleEdge: "rgba(59, 28, 90, 0.88)",
  red: "#5B0000",
  redEdge: "rgba(91, 0, 0, 0.85)",
  redSoft: "rgba(91, 0, 0, 0.40)",
  text: "#F7F7F7",
  textSoft: "rgba(245, 245, 245, 0.82)",
};

// 🎧 Tracks (swap to your actual Erevos audio later)
const TRACKS = [
  {
    id: "erevos_main",
    label: "Project Ascendancy",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "erevos_alt",
    label: "The Enlightened",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

// Main + secondary images (same content you already had)
const mainCharacter = [
  { name: "Erevos the Ascendancy", image: require("../../../assets/Villains/Erevos.jpg"), clickable: true },
];

const secondaryCharacters = [
  { name: "Erevan", image: require("../../../assets/Villains/Erevan.jpg"), clickable: true },
  { name: "Erevos the Eternal", image: require("../../../assets/Villains/GreatErevos.jpg"), clickable: true },
  { name: "Erevos", image: require("../../../assets/Villains/Erevos2.jpg"), clickable: true },
];

const ErevosScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const isDesktop = windowWidth >= 768;

  // 🎧 Audio state
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const safeTracks = Array.isArray(TRACKS) && TRACKS.length ? TRACKS : [];
  const safeIndex = safeTracks.length ? trackIndex % safeTracks.length : 0;
  const currentTrack = safeTracks.length ? safeTracks[safeIndex] : null;

  // ✅ Responsive listener
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
        console.error("Failed to play Erevos track", e);
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
  const renderCharacterCard = (character, index, isSecondary = false) => (
    <TouchableOpacity
      key={`${character.name}-${index}-${isSecondary ? "sec" : "main"}`}
      style={[
        styles.card(isDesktop, windowWidth, isSecondary),
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
      source={require("../../../assets/BackGround/Enlightened.jpg")}
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
                <Text style={styles.title}>Erevos</Text>
                {/* ✅ NOT COLORS — theme words only */}
                <Text style={styles.subtitle}>Immortal • Shadow Empire • Project Ascendancy</Text>
              </View>
            </View>
          </View>

          {/* MAIN GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {mainCharacter.map((c, i) => renderCharacterCard(c, i, false))}
            </ScrollView>
          </View>

          {/* LEGACY GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Erevos’s Legacy</Text>
            <View style={styles.sectionDivider} />
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {secondaryCharacters.map((c, i) => renderCharacterCard(c, i, true))}
            </ScrollView>
          </View>

          {/* ABOUT — LORE KEPT INTACT (UNCHANGED TEXT) */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              The Parliament of Justice’s Big Bad
            </Text>

            <Text style={styles.aboutText}>
              Once a prehistoric warlord named Erevan, he was struck by a fragment from a cosmic meteor that crashed to Earth during his early conquests. Instead of dying, he rose reborn—immortal, empowered, and driven. Taking the name <Text style={{ fontStyle: "italic" }}>Erevos</Text>, he disappeared from history’s spotlight and began guiding it from the shadows. With millennia of warfare, manipulation, and conquest behind him, Erevos seeks to reshape the world into an eternal empire ruled by might, order, and evolutionary supremacy.
            </Text>

            <Text style={styles.aboutText}>• Powers and Abilities:</Text>
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

            <Text style={styles.aboutText}>Erevos’s Timeline:</Text>
            <Text style={styles.aboutText}>
              1. <Text style={{ fontWeight: "bold" }}>Erevos Primeval</Text> – His origin form shortly after gaining immortality, clad in bronze-age armor, still discovering the limits of his new power.
            </Text>
            <Text style={styles.aboutText}>
              2. <Text style={{ fontWeight: "bold" }}>Erevos the Conqueror</Text> – A medieval tyrant who led empires across continents, clad in obsidian-black armor streaked with star-metal.
            </Text>
            <Text style={styles.aboutText}>
              3. <Text style={{ fontWeight: "bold" }}>Modern Erevos</Text> – A quiet kingmaker operating behind global conflicts, dressed in regal armor and trench-like coats woven with cosmic threads.
            </Text>
            <Text style={styles.aboutText}>
              4. <Text style={{ fontWeight: "bold" }}>Erevos Ascendant</Text> – His future form after conquering half the galaxy, now nearly divine, infused with red cosmic fire and armored in god-forged blacksteel.
            </Text>

            <Text style={styles.aboutText}>
              Current Agenda: <Text style={{ fontStyle: "italic" }}>Project Ascendancy</Text>
            </Text>
            <Text style={styles.aboutText}>
              Erevos’s final vision is the unification of Earth and its meta-humans under his immortal rule. He plans to harvest the powers of heroes using the Celestial Eye and activate the Ancestral Sigil, binding all meta-kind to him. He will then reshape Earth’s fabric using cosmic energy granted through a dangerous alliance with Torath—the Devourer.
            </Text>

            <Text style={styles.aboutText}>The Enlightened:</Text>
            <Text style={styles.aboutText}>
              Erevos leads a secret cabal known as <Text style={{ fontWeight: "bold" }}>The Enlightened</Text>, mirroring the ancient Light. Each Lieutenant represents a domain of power and fulfills a vital role in Erevos’s grand strategy:
            </Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "bold" }}>Chrona</Text>: A time-bending manipulator of fate and contingency. She sees alternate timelines and subtly influences causality to ensure Erevos's future dominance.
            </Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "bold" }}>Noctura</Text>: A master illusionist and psychological manipulator. Noctura uses hallucinations and misinformation to cloud mass perception, control narratives, and disrupt social cohesion. Behind the veil of her illusions, she also commands a network of elite spies and seduction agents, subtly turning diplomats, influencers, and even heroes into pawns of The Enlightened.
            </Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "bold" }}>Sable</Text>: Erevos's most trusted and lethal assassin. A master of dimensional phasing, she can enter and exit reality to execute targets without leaving a trace. Known to always finish the mission.
            </Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "bold" }}>Obelisk</Text>: A mystic warlock who commands dark rituals and ancient energy. He maintains Erevos’s arcane strongholds and opens portals to cosmic realms, allowing communication with entities beyond mortal comprehension.
            </Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "bold" }}>Titanus</Text>: A genetically and cybernetically enhanced juggernaut. As Erevos’s personal enforcer, Titanus crushes resistance movements and wipes out rebellious metahumans with brute force.
            </Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "bold" }}>Red Mercury</Text>: The political puppetmaster and financial juggernaut of The Enlightened. He commands vast empires of wealth, media, and industry, pulling the strings behind world leaders and global institutions. Every law passed, every crisis exploited, every conflict prolonged—his influence shapes it all. Red Mercury ensures the cabal’s shadow remains cast across every government on Earth.
            </Text>

            <Text style={styles.aboutText}>Pact with Torath – The Devourer:</Text>
            <Text style={styles.aboutText}>
              Erevos made a cosmic bargain with Torath, the Devourer—a being who consumes worlds. Erevos promised him Earth and its meta-humans in exchange for power. Their deal is simple: whoever claims Earth first keeps it. If Erevos fails, Torath devours everything.
            </Text>
            <Text style={styles.aboutText}>
              The alliance is unstable—both plot to betray the other once Ascendancy is complete.
            </Text>

            <Text style={styles.aboutText}>Erevos’s Legacy:</Text>
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
    backgroundColor: COLORS.gunmetal,
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
    borderColor: "rgba(230, 230, 240, 0.80)",
    backgroundColor: COLORS.gunmetalSoft,
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
    backgroundColor: COLORS.cosmicBlue,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: COLORS.textSoft,
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#EFE6FF",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: COLORS.royalPurple,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 235, 255, 0.55)",
  },
  musicButtonSecondary: {
    backgroundColor: COLORS.gunmetalSoft,
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
    color: "#F4EEFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#FFEDED",
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
    backgroundColor: COLORS.gunmetalSoft,
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
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    shadowColor: COLORS.royalPurple,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#EFE6FF",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 235, 235, 0.72)",
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
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: "rgba(160, 140, 190, 0.40)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EFE6FF",
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
  card: (isDesktop, windowWidth, isSecondary) => ({
    width: isSecondary ? (isDesktop ? windowWidth * 0.26 : SCREEN_WIDTH * 0.62) : (isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9),
    height: isSecondary ? (isDesktop ? SCREEN_HEIGHT * 0.42 : SCREEN_HEIGHT * 0.55) : (isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7),
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    marginRight: 18,
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    shadowColor: COLORS.royalPurple,
    shadowOpacity: 0.42,
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
    color: "#EFE6FF",
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
    backgroundColor: COLORS.gunmetal,
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
    color: "#EFE6FF",
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

export default ErevosScreen;
