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

// ✅ TEMP: Use Sable tracks so nothing breaks until you add Wraithblade audio.
// Track[0] is ALWAYS the default.
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

// ✅ Wraithblade gallery
const characters = [
  { name: "Wraithblade", image: require("../../../assets/Villains/Wraithblade.jpg"), clickable: true },
];

export default function WraithbladeScreen() {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ Default always 0
  const [trackIndex, setTrackIndex] = useState(0);

  // ✅ HARD GUARD: never allow undefined track
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
      if (!track?.source) return; // ✅ guard for fallback / missing

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          track.source,
          { isLooping: true, volume: 0.8 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Wraithblade track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound, safeTracks]
  );

  const playTheme = async () => {
    // ✅ never auto-randomize. Always uses current selected track.
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

    // ✅ IMPORTANT: no random autoplay
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

  // ───────── UI ─────────
  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
      style={[
        styles.card(isDesktop, windowWidth),
        character.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() =>
        character.clickable && console.log(`${character.name} clicked`)
      }
      disabled={!character.clickable}
      activeOpacity={0.9}
    >
      <Image source={character.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {character.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Villains.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* 🎧 MUSIC BAR (Sable-style) */}
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
            style={[styles.musicButton, isPlaying && styles.musicButtonDisabled]}
            onPress={playTheme}
            disabled={isPlaying || !currentTrack?.source}
          >
            <Text style={styles.musicButtonText}>
              {isPlaying ? "Playing" : "Play"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.musicButtonSecondary,
              !isPlaying && styles.musicButtonDisabled,
            ]}
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
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.85}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Wraithblade</Text>
                <Text style={styles.subtitle}>
                  Phase • Precision • Shadow Crusade
                </Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wraith Gallery</Text>
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
              Nemesis:{" "}
              <Text style={{ fontWeight: "900", color: "#20E6D3" }}>
                Jared McNeil “Spector”
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              Wraithblade was once a legendary crusader—exiled for brutal,
              unchecked tactics. Revived in the present, he gained the power to
              phase through matter and strike with unnerving precision. He sees
              Spector as a naive reflection of what he used to be.
            </Text>

            <Text style={styles.aboutText}>
              Powers: super speed equal to Spector’s, plus phasing through solid
              objects and ethereal movement.
            </Text>

            <Text style={styles.aboutText}>
              Weapon: dual shadow blades that can solidify or turn ethereal,
              cutting through both physical and energy defenses.
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

  // 🎨 WRAITHBLADE COLOR SET (ghost violet + abyss teal)
// ✅ WRAITHBLADE — Dead Gray + Icy Blue Theme

musicControls: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 10,
  backgroundColor: "rgba(6, 10, 14, 0.95)",
  borderBottomWidth: 1,
  borderBottomColor: "rgba(127, 217, 255, 0.35)",
  shadowColor: "#7FD9FF",
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
  borderColor: "rgba(127, 217, 255, 0.85)",
  backgroundColor: "rgba(8, 14, 18, 0.96)",
  marginRight: 6,
},
trackButtonText: { color: "#E6F4FF", fontSize: 14, fontWeight: "bold" },
trackInfoGlass: {
  flex: 1,
  marginHorizontal: 6,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 999,
  backgroundColor: "rgba(8, 12, 16, 0.96)",
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.55)",
  flexDirection: "row",
  alignItems: "center",
},
trackLabel: { color: "rgba(230, 244, 255, 0.75)", fontSize: 11, marginRight: 6 },
trackTitle: { color: "#E6F4FF", fontSize: 13, fontWeight: "700" },

musicButton: {
  backgroundColor: "rgba(10, 16, 20, 0.95)",
  paddingHorizontal: 16,
  paddingVertical: 9,
  borderRadius: 999,
  marginHorizontal: 4,
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.85)",
},
musicButtonSecondary: {
  backgroundColor: "rgba(8, 12, 16, 0.9)",
  paddingHorizontal: 16,
  paddingVertical: 9,
  borderRadius: 999,
  marginHorizontal: 4,
  borderWidth: 1,
  borderColor: "rgba(154, 163, 170, 0.55)", // dead gray secondary border
},
musicButtonDisabled: { opacity: 0.55 },
musicButtonText: { color: "#E6F4FF", fontWeight: "bold", fontSize: 13 },
musicButtonTextSecondary: { color: "#E6F4FF", fontWeight: "bold", fontSize: 13 },

// HEADER
headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
headerContainer: { flexDirection: "row", alignItems: "center" },
backButton: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 999,
  backgroundColor: "rgba(8, 12, 16, 0.95)",
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.55)",
  marginRight: 10,
},
backButtonText: { fontSize: 22, color: "#E6F4FF" },
headerGlass: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  backgroundColor: "rgba(10, 16, 20, 0.9)",
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.55)",
  shadowColor: "#7FD9FF",
  shadowOpacity: 0.45,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
},
title: {
  fontSize: 26,
  fontWeight: "900",
  color: "#9AA3AA",          // ✅ dead gray title (not purple)
  textAlign: "center",
  textShadowColor: "#7FD9FF", // ✅ icy glow
  textShadowRadius: 10,
  textShadowOffset: { width: 0, height: 0 },
  letterSpacing: 1,
},
subtitle: {
  marginTop: 4,
  fontSize: 12,
  color: "rgba(127, 217, 255, 0.85)", // ✅ icy blue
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
  backgroundColor: "rgba(8, 12, 16, 0.93)",
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.35)",
  shadowColor: "#7FD9FF",
  shadowOpacity: 0.25,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#E6F4FF",
  textAlign: "center",
  textShadowColor: "#7FD9FF",
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
  backgroundColor: "rgba(127, 217, 255, 0.85)",
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
  backgroundColor: "rgba(6, 10, 14, 0.9)",
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.85)",
  shadowColor: "#7FD9FF",
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
  color: "#E6F4FF",
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
  backgroundColor: "rgba(8, 12, 16, 0.96)",
  borderWidth: 1,
  borderColor: "rgba(127, 217, 255, 0.45)",
  shadowColor: "#7FD9FF",
  shadowOpacity: 0.25,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 12 },
  elevation: 12,
},
aboutHeader: {
  fontSize: 20,
  fontWeight: "800",
  color: "#9AA3AA",           // ✅ dead gray header
  textAlign: "center",
  textShadowColor: "#7FD9FF", // ✅ icy glow
  textShadowRadius: 10,
  textShadowOffset: { width: 0, height: 0 },
  letterSpacing: 0.8,
  marginBottom: 6,
},
aboutText: {
  fontSize: 14,
  color: "#E6F4FF",
  lineHeight: 20,
  marginTop: 6,
  textAlign: "left",
},
});
