// RageVortexScreen.js (black + red, same structure as Fjord/others)
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

// ✅ TEMP: Use Sable tracks so nothing breaks until you add Rage Vortex audio.
const TRACKS = [
  {
    id: "sable_main",
    label: "Sable Theme",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "sable_alt",
    label: "Final Whisper Mix",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

// ✅ Rage Vortex gallery
const characters = [
  { name: "Rage Vortex", image: require("../../../assets/Villains/RageVortex.jpg"), clickable: true },
];

export default function RageVortexScreen() {
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

  const isDesktop = windowWidth >= 768;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  // ───────── AUDIO HELPERS ─────────
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
        const { sound: newSound } = await Audio.Sound.createAsync(track.source, {
          isLooping: true,
          volume: 0.8,
        });
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Rage Vortex track", e);
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
                <Text style={styles.title}>Rage Vortex</Text>
                <Text style={styles.subtitle}>Rage • Chaos • Crushing Force</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rage Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* ABOUT */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              Nemesis: <Text style={{ fontWeight: "900", color: "rgba(255, 49, 49, 0.95)" }}>Guardian</Text>
            </Text>

            <Text style={styles.aboutText}>
              Declan Brann grew up in violence—his power feeding on negative emotion and amplifying it in others.
              He found a home in underground fight rings, where conflict became comfort and chaos became purpose.
            </Text>

            <Text style={styles.aboutText}>
              Abilities: Rage Inducer (amplifies anger), Adrenal Surge (strength/speed scale with fury),
              Barrier Breaker (tears through shields).
            </Text>

            <Text style={styles.aboutText}>
              Weapon: a spiked mace that radiates aggressive energy and hits like a wrecking ball.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)", flex: 1 },
  scrollContainer: { paddingBottom: 20 },

  // ✅ RAGE VORTEX COLORS: black + red
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(18, 6, 6, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 70, 70, 0.35)",
    shadowColor: "#FF4646",
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
    borderColor: "rgba(255, 90, 90, 0.85)",
    backgroundColor: "rgba(22, 8, 8, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#FFECEC", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(20, 8, 8, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 70, 70, 0.60)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(255, 236, 236, 0.75)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#FFECEC", fontSize: 13, fontWeight: "700" },

  musicButton: {
    backgroundColor: "rgba(32, 10, 10, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 70, 70, 0.90)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(18, 6, 6, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 140, 140, 0.60)",
  },
  musicButtonDisabled: { opacity: 0.55 },
  musicButtonText: { color: "#FFECEC", fontWeight: "bold", fontSize: 13 },
  musicButtonTextSecondary: { color: "#FFECEC", fontWeight: "bold", fontSize: 13 },

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(22, 8, 8, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 90, 90, 0.85)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#FFECEC" },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(20, 8, 8, 0.90)",
    borderWidth: 1,
    borderColor: "rgba(255, 70, 70, 0.55)",
    shadowColor: "#FF4646",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FF4646",
    textAlign: "center",
    textShadowColor: "#FF4646",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 170, 170, 0.85)",
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
    backgroundColor: "rgba(16, 6, 6, 0.93)",
    borderWidth: 1,
    borderColor: "rgba(255, 70, 70, 0.30)",
    shadowColor: "#FF4646",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFECEC",
    textAlign: "center",
    textShadowColor: "#FF4646",
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
    backgroundColor: "rgba(255, 70, 70, 0.85)",
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
    backgroundColor: "rgba(6, 2, 2, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 70, 70, 0.85)",
    shadowColor: "#FF4646",
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
    color: "#FFECEC",
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
    backgroundColor: "rgba(12, 4, 4, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 90, 90, 0.40)",
    shadowColor: "#FF4646",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF4646",
    textAlign: "center",
    textShadowColor: "#FF4646",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#FFECEC",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
