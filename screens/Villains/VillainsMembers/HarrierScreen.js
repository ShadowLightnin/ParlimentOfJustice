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

// ✅ TEMP TRACKS (swap later)
const TRACKS = [
  {
    id: "harrier_main",
    label: "Harrier Theme",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "harrier_alt",
    label: "White-Glow Pursuit",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const HarrierScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const safeTracks =
    Array.isArray(TRACKS) && TRACKS.length > 0
      ? TRACKS
      : [{ id: "fallback", label: "No Track", source: null }];

  const safeIndex = Math.min(Math.max(trackIndex, 0), safeTracks.length - 1);
  const currentTrack = safeTracks[safeIndex];

  useEffect(() => {
    const updateDimensions = () => setWindowWidth(Dimensions.get("window").width);
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  const unloadSound = useCallback(async () => {
    if (!sound) return;
    try { await sound.stopAsync(); } catch {}
    try { await sound.unloadAsync(); } catch {}
    setSound(null);
  }, [sound]);

  const loadAndPlayTrack = useCallback(
    async (index) => {
      await unloadSound();

      const track = safeTracks[index];
      if (!track?.source) return;

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          track.source,
          { isLooping: true, volume: 0.8 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Harrier track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound, safeTracks]
  );

  const playTheme = async () => {
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
    if (safeTracks.length <= 1) return;

    const nextIndex = (safeIndex + direction + safeTracks.length) % safeTracks.length;
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

  const characters = [
    { name: "Harrier", image: require("../../../assets/Villains/Harrier.jpg"), clickable: true },
  ];

  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
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
      source={require("../../../assets/BackGround/Villains.jpg")}
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
            style={[styles.musicButton, isPlaying && styles.musicButtonDisabled]}
            onPress={playTheme}
            disabled={isPlaying || !currentTrack?.source}
          >
            <Text style={styles.musicButtonText}>{isPlaying ? "Playing" : "Play"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButtonSecondary, !isPlaying && styles.musicButtonDisabled]}
            onPress={pauseTheme}
            disabled={!isPlaying}
          >
            <Text style={styles.musicButtonTextSecondary}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* HEADER */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.85}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Harrier</Text>
                <Text style={styles.subtitle}>BLACKOUT • WHITEGLOW • HUNTER</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Harrier Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              Nemesis: <Text style={{ fontWeight: "900", color: "rgba(255, 49, 49, 0.95)" }}>Night Hawk</Text>
            </Text>
            <Text style={styles.aboutText}>
              Once a government experiment to create the perfect stealth operative, Marcus Hailstone went rogue after
              being betrayed by his handlers. Equipped with prototype stealth armor and an experimental cloaking device,
              he became The Harrier—striking from the shadows. His suit mimics Night Hawk’s stealth features, but with
              added aggression: Hailstone sees himself as a hunter and stalks targets with meticulous intent. Resenting
              Will’s principles, he aims to “liberate” Night Hawk from morality, believing true power comes from embracing
              predatory instincts without restraint.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { backgroundColor: "rgba(0, 0, 0, 0.82)", flex: 1 },
  scrollContainer: { paddingBottom: 20 },

  // ✅ HARRIER: black + white + glowing white
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.35)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
    backgroundColor: "rgba(8, 8, 10, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(8, 8, 10, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(255, 255, 255, 0.65)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },

  musicButton: {
    backgroundColor: "rgba(12, 12, 14, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(0, 0, 0, 0.92)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",
  },
  musicButtonDisabled: { opacity: 0.55 },
  musicButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
  musicButtonTextSecondary: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(8, 8, 10, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.75)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#FFFFFF" },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(8, 8, 10, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#FFFFFF",
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
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
    backgroundColor: "rgba(0, 0, 0, 0.93)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#FFFFFF",
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingTop: 4,
    alignItems: "center",
  },

  // CARD
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.75)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  }),
  clickable: {},
  notClickable: { opacity: 0.75 },
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.25)" },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
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
    backgroundColor: "rgba(8, 8, 10, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.30)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#FFFFFF",
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default HarrierScreen;
