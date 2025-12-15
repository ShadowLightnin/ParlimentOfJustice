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

// 🟠 Palette: Void Black + Bronze + Burning Orange
const COLORS = {
  void: "rgba(6, 6, 8, 0.97)",
  void2: "rgba(12, 10, 12, 0.92)",
  glass: "rgba(10, 8, 10, 0.90)",

  bronze: "#CD7F32",
  bronzeSoft: "rgba(205, 127, 50, 0.35)",
  bronzeLine: "rgba(205, 127, 50, 0.55)",

  ember: "#FF7A18",
  emberSoft: "rgba(255, 122, 24, 0.30)",

  lightning: "#FFF2E6",
  text: "#FFF9F2",
  line: "rgba(255, 255, 255, 0.14)",
  line2: "rgba(255, 255, 255, 0.24)",
};

// 🎧 Tracks (swap to real Kharon/Void Conqueror tracks later)
const TRACKS = [
  {
    id: "kharon_main",
    label: "Void Conqueror Theme",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "kharon_alt",
    label: "Bronze Dominion Mix",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  {
    name: "Void Conqueror",
    image: require("../../../assets/Villains/Kharon.jpg"),
    clickable: true,
  },
];

export default function VoidConquerorScreen() {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const isDesktop = windowWidth >= 768;

  const safeTracks =
    Array.isArray(TRACKS) && TRACKS.length > 0
      ? TRACKS
      : [{ id: "fallback", label: "No Track", source: null }];

  const safeIndex = Math.min(Math.max(trackIndex, 0), safeTracks.length - 1);
  const currentTrack = safeTracks[safeIndex];

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => sub?.remove();
  }, []);

  // ───────── AUDIO ─────────
  const unloadSound = useCallback(async () => {
    if (!sound) return;
    try {
      await sound.stopAsync();
    } catch {}
    try {
      await sound.unloadAsync();
    } catch {}
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
          volume: 0.85,
        });
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Void Conqueror track", e);
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
    const nextIndex =
      (safeIndex + direction + safeTracks.length) % safeTracks.length;

    setTrackIndex(nextIndex);

    if (isPlaying) await loadAndPlayTrack(nextIndex);
    else await unloadSound();
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

  // ───────── CARD ─────────
  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
      style={styles.card(isDesktop, windowWidth)}
      activeOpacity={0.9}
    >
      <Image source={character.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>© {character.name}; William Cummings</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/BigBad.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* 🎧 MUSIC BAR — bronze/ember glass */}
        <View style={styles.musicControls}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => cycleTrack(-1)}
          >
            <Text style={styles.trackButtonText}>⟵</Text>
          </TouchableOpacity>

          <View style={styles.trackInfoGlass}>
            <Text style={styles.trackLabel}>Track:</Text>
            <Text style={styles.trackTitle}>
              {currentTrack?.label || "No Track"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => cycleTrack(1)}
          >
            <Text style={styles.trackButtonText}>⟶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButton, isPlaying && styles.disabled]}
            onPress={playTheme}
            disabled={isPlaying || !currentTrack?.source}
          >
            <Text style={styles.musicText}>{isPlaying ? "Playing" : "Play"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButtonSecondary, !isPlaying && styles.disabled]}
            onPress={pauseTheme}
            disabled={!isPlaying}
          >
            <Text style={styles.musicTextAlt}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* HEADER */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.85}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Void Conqueror</Text>
                <Text style={styles.subtitle}>
                  Monke Alliance Big Bad • Kharon • Bronze Dominion
                </Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conqueror Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              <Text style={{ fontWeight: "900", color: COLORS.bronze }}>
                The Monke Alliance’s Big Bad
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              Kharon is an ancient entity who discovered the secrets of life and
              death through a forbidden ritual. With centuries of knowledge, he
              has traveled through dimensions, gathering power and followers.
            </Text>

            <Text style={styles.aboutText}>
              Known for his brutal yet cunning nature, Kharon believes the Monke
              Alliance’s power is wasted on those with no ambition. He intends
              to subjugate them—or eliminate them—if they refuse to serve his
              purpose of ruling across worlds.
            </Text>

            <Text style={[styles.aboutText, { marginTop: 10 }]}>
              <Text style={{ fontWeight: "900", color: COLORS.ember }}>
                Abilities & Gear
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              • Life Force Absorption — draws strength from defeated enemies,
              regenerating himself and becoming stronger.
            </Text>
            <Text style={styles.aboutText}>
              • Necromancy — summons shadowed warriors of those he’s defeated,
              fighting relentlessly until dispelled.
            </Text>
            <Text style={styles.aboutText}>
              • Time Dilation — manipulates time around him to slow or freeze
              enemies, creating guaranteed kill windows.
            </Text>
            <Text style={styles.aboutText}>
              • Master Combatant — unparalleled knowledge of ancient and modern
              combat styles, constantly adapting mid-fight.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { backgroundColor: "rgba(0,0,0,0.86)", flex: 1 },
  scrollContainer: { paddingBottom: 30 },

  // 🎧 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.void,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bronzeSoft,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line2,
    backgroundColor: COLORS.void2,
    marginRight: 6,
  },
  trackButtonText: {
    color: COLORS.lightning,
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.bronzeSoft,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: COLORS.bronze, fontSize: 11, marginRight: 6 },
  trackTitle: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: COLORS.void2,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.bronzeSoft,
  },
  musicButtonSecondary: {
    backgroundColor: COLORS.void2,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  musicText: { color: COLORS.lightning, fontWeight: "bold", fontSize: 13 },
  musicTextAlt: { color: COLORS.text, fontWeight: "bold", fontSize: 13 },
  disabled: { opacity: 0.5 },

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.void2,
    borderWidth: 1,
    borderColor: COLORS.bronzeSoft,
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: COLORS.lightning },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.void,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.bronze,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: COLORS.emberSoft,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 249, 242, 0.80)",
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
    backgroundColor: COLORS.void,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: COLORS.bronzeSoft,
  },

  // CARD
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.bronzeSoft,
    backgroundColor: "rgba(0,0,0,0.55)",
  }),
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowRadius: 8,
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
    backgroundColor: COLORS.void,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.ember,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
