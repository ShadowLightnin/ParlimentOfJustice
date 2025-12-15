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

// 🎨 Vortigar palette — Gold + Navy
const COLORS = {
  navy: "rgba(0, 0, 0, 0.86)",
  navySoft: "rgba(18, 18, 20, 0.96)",
  gold: "#D4AF37",
  goldSoft: "rgba(212, 175, 55, 0.55)",
  goldEdge: "rgba(212, 175, 55, 0.90)",
  text: "#F7F7F7",
  textSoft: "rgba(245, 245, 245, 0.85)",
};

// 🎧 Tracks (swap to your actual Vortigar tracks later)
const TRACKS = [
  {
    id: "vortigar_main",
    label: "Inevitable Doctrine",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "vortigar_alt",
    label: "Equilibrium March",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  {
    name: "Vortigar the Inevitable",
    image: require("../../../assets/Villains/Vortigar.jpg"),
    clickable: true,
  },
];

const VortigarScreen = () => {
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
        console.error("Failed to play Vortigar track", e);
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
            <Text style={styles.trackTitle}>
              {currentTrack?.label || "No Track"}
            </Text>
          </View>

          <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(1)}>
            <Text style={styles.trackButtonText}>⟶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButton, isPlaying && styles.musicButtonDisabled]}
            onPress={playTheme}
            disabled={isPlaying || !safeTracks.length}
          >
            <Text style={styles.musicButtonText}>
              {isPlaying ? "Playing" : "Play"}
            </Text>
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
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Vortigar the Inevitable</Text>
                <Text style={styles.subtitle}>Balance • Cosmic Judgment • Equilibrium Doctrine</Text>
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
              Vortigar is a cosmic warlord who believes in the doctrine of "Cosmic Equilibrium." He sees civilizations as endlessly consuming resources, leading to inevitable collapse. To "preserve existence," he enforces mass culling across star systems. His race was wiped out by unchecked expansion, and he now enacts ruthless “cleansings” to ensure no species meets the same fate—by his logic, survival must be earned.
            </Text>

            <Text style={styles.aboutText}>
              He once served the cosmic tribunal as a cosmic judge, but after witnessing the council's apathy during a galactic extinction event, he abandoned their order and declared that life itself must be trimmed, not preserved. He forged his own path, one soaked in conquest and cosmic entropy.
            </Text>

            <Text style={styles.aboutText}>
              Vortigar views heroes as hypocrites—champions of unchecked growth and emotional mercy. He sees them as the very disease that destroyed his people. To him, they are blind idealists who prolong suffering instead of curing it.
            </Text>

            <Text style={styles.aboutText}>• Powers and Abilities:</Text>
            <Text style={styles.aboutText}>Celestial Physiology – Nearly indestructible and impossibly strong.</Text>
            <Text style={styles.aboutText}>Entropy Gauntlet – A gauntlet capable of unraveling energy and matter at will.</Text>
            <Text style={styles.aboutText}>Fate Domination – Can peer into potential futures to determine which must be "pruned."</Text>
            <Text style={styles.aboutText}>Graviton Will – Can manipulate gravity fields across planetary ranges, collapsing cities or suspending armies.</Text>
            <Text style={styles.aboutText}>Void Step – Vortigar may temporarily vanish from time to avoid death or reset a timeline.</Text>
            <Text style={styles.aboutText}>• The Equinox Blades – Twin curved swords forged from dead stars. One severs time, the other severs space.</Text>

            <Text style={styles.aboutText}>• Followers — The Dread Starborn:</Text>
            <Text style={styles.aboutText}>1. Nihzera, The Shard Queen – Mistress of pain and manipulation, with crystalline armor and a venomous mind.</Text>
            <Text style={styles.aboutText}>2. Xovek the Endborn – A brute of pure antimatter, fueled by hunger and destruction.</Text>
            <Text style={styles.aboutText}>3. Kaelthys – Vortigar’s executioner, a silent warrior whose blade erases souls from existence.</Text>
            <Text style={styles.aboutText}>4. Vaedra the Speaker – A telepathic herald who delivers Vortigar’s edicts through mental invasion.</Text>
            <Text style={styles.aboutText}>5. Myrr – A childlike being who manipulates time loops to ensnare civilizations in endless failure.</Text>
            <Text style={styles.aboutText}>These five form the Dread Starborn, Vortigar’s personal death choir, and herald his arrival across galaxies.</Text>
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
    backgroundColor: "rgba(0,0,0,0.80)",
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
    backgroundColor: COLORS.navy,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldEdge,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(240, 240, 255, 0.85)",
    backgroundColor: COLORS.navySoft,
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
    backgroundColor: "rgba(12, 18, 40, 0.92)",
    borderWidth: 1,
    borderColor: COLORS.goldEdge,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: COLORS.textSoft,
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#FFF6D6",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 220, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: COLORS.navySoft,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.goldEdge,
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "rgba(20, 18, 12, 0.95)",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#FFF6D6",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.navySoft,
    borderWidth: 1,
    borderColor: COLORS.goldEdge,
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
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.goldEdge,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.40,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.gold,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 246, 214, 0.82)",
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
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.goldSoft,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF6D6",
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
    backgroundColor: COLORS.goldEdge,
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
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.goldEdge,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.55,
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
    color: "#FFF6D6",
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
    backgroundColor: COLORS.navy,
    borderWidth: 1,
    borderColor: COLORS.goldEdge,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.gold,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "rgba(255, 246, 214, 0.88)",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default VortigarScreen;
