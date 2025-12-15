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

// 🎨 Kaidan Vyros palette: Dark Metal Gray + Deep Glowing Red
const COLORS = {
  metal: "rgba(10, 10, 12, 0.98)",
  metal2: "rgba(16, 16, 20, 0.92)",
  glass: "rgba(12, 12, 16, 0.92)",
  line: "rgba(255, 255, 255, 0.14)",
  line2: "rgba(255, 255, 255, 0.22)",

  red: "rgba(210, 25, 35, 0.98)",
  redSoft: "rgba(210, 25, 35, 0.32)",
  redDim: "rgba(210, 25, 35, 0.72)",

  text: "#F7F7F7",
};

// 🎧 Tracks (swap to your actual Kaidan files when ready)
const TRACKS = [
  {
    id: "kaidan_main",
    label: "Crimson Hunt",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "kaidan_alt",
    label: "Beastbound Vow",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  {
    name: "Kaidan Vyros",
    image: require("../../../assets/Villains/KaidanVyros.jpg"),
    clickable: true,
  },
];

export default function KaidanVyrosScreen() {
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

  // ───────── AUDIO HELPERS ─────────
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
        console.error("Failed to play Kaidan track", e);
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
      style={[styles.card(isDesktop, windowWidth)]}
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
        {/* 🎧 MUSIC BAR — Kaidan (metal + red) */}
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
                <Text style={styles.title}>Kaidan Vyros</Text>
                <Text style={styles.subtitle}>
                  Spartans Big Bad • Beastbound Survivor • Crimson Warlord
                </Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kaidan Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              The Spartans’ Big Bad — Once an elite soldier in a rival faction,
              Kaidan Vyros was betrayed by his own leaders and left to die on a
              hostile planet filled with colossal monsters. He survived in
              isolation, adapting through relentless hunting and ruthless
              evolution.
            </Text>

            <Text style={styles.aboutText}>
              His armor is fused with alien scales and energy-absorbing plating,
              granting monstrous strength and a predatory resilience. Over time,
              he formed a near-psychic bond with the beasts he tamed—turning the
              wilderness into a personal army.
            </Text>

            <Text style={styles.aboutText}>
              <Text style={{ fontWeight: "900", color: COLORS.red }}>
                Abilities & Gear
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              • Monstrous Armor — Halo-grade plating fused with creature-scale
              armor, built to absorb punishment and intimidate.
            </Text>
            <Text style={styles.aboutText}>
              • Beast Summoning — calls otherworldly monsters (including a dark,
              mutated Hydra) that hunts in sync with him.
            </Text>
            <Text style={styles.aboutText}>
              • Crushing Strength — rivals the strongest Spartans, overpowering
              foes with brutal efficiency.
            </Text>
            <Text style={styles.aboutText}>
              • Energy Pulse Cannon — shoulder-mounted cannon firing condensed
              energy pulses to shatter defenses.
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
    backgroundColor: COLORS.metal,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.redSoft,
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
    backgroundColor: COLORS.metal2,
    marginRight: 6,
  },
  trackButtonText: { color: COLORS.text, fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.redSoft,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: COLORS.redDim, fontSize: 11, marginRight: 6 },
  trackTitle: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: COLORS.metal2,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.redSoft,
  },
  musicButtonSecondary: {
    backgroundColor: COLORS.metal2,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  musicText: { color: COLORS.text, fontWeight: "bold", fontSize: 13 },
  musicTextAlt: { color: COLORS.text, fontWeight: "bold", fontSize: 13 },
  disabled: { opacity: 0.5 },

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.metal2,
    borderWidth: 1,
    borderColor: COLORS.redSoft,
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: COLORS.text },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.metal,
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
    color: COLORS.red,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(210,25,35,0.35)", // subtle “glow”
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(247, 247, 247, 0.82)",
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
    backgroundColor: COLORS.metal,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, textAlign: "center" },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: COLORS.redSoft,
  },

  // CARD
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.redSoft,
    backgroundColor: "rgba(0,0,0,0.55)",
  }),
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
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
    backgroundColor: COLORS.metal,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.red,
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
