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

// 🎧 Sable / Enlightened tracks
const TRACKS = [
  {
    id: "sable_main",
    label: "Sable Theme",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "sable_alt",
    label: "Final Whisper Mix",
    source: require("../../../assets/audio/sableGood.m4a"),
  },
];

const characters = [
  { name: "Sable", image: require("../../../assets/Villains/Sable.jpg"), clickable: true },
  { name: "Sable The Final Whisper", image: require("../../../assets/Villains/Sable2.jpg"), clickable: true },
];

export default function SableScreen() {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const isDesktop = windowWidth >= 768;

  // ✅ Safe guards (missing in your version)
  const safeTracks =
    Array.isArray(TRACKS) && TRACKS.length > 0
      ? TRACKS
      : [{ id: "fallback", label: "No Track", source: null }];

  const safeIndex = Math.min(Math.max(trackIndex, 0), safeTracks.length - 1);
  const currentTrack = safeTracks[safeIndex];

  // ✅ Responsive width listener
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
          volume: 0.85,
        });
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Sable track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound, safeTracks]
  );

  const playTheme = async () => {
    if (sound) {
      try { await sound.playAsync(); setIsPlaying(true); } catch (e) { console.error("Play error", e); }
    } else {
      await loadAndPlayTrack(safeIndex);
    }
  };

  const pauseTheme = async () => {
    if (!sound) return;
    try { await sound.pauseAsync(); setIsPlaying(false); } catch (e) { console.error("Pause error", e); }
  };

  const cycleTrack = async (direction) => {
    if (safeTracks.length <= 1) return;

    const nextIndex = (safeIndex + direction + safeTracks.length) % safeTracks.length;
    setTrackIndex(nextIndex);

    if (isPlaying) await loadAndPlayTrack(nextIndex);
    else await unloadSound();
  };

  // Stop sound when leaving screen
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
      style={[styles.card(isDesktop, windowWidth)]}
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
        {/* 🎧 MUSIC BAR — BLACK + ENERGY RED */}
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
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.85}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Sable the Assassin</Text>
                <Text style={styles.subtitle}>Blades • Shadows • Final Whisper</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shadow Gallery</Text>
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
            <Text style={styles.aboutHeader}>About Me</Text>

            <Text style={styles.aboutText}>
              Forbidden Lover:{" "}
              <Text style={{ fontWeight: "900", color: "rgba(255, 49, 49, 0.95)" }}>
                Void Walker
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              Sable is a merciless warrior with an arsenal of deadly, shadow-infused weaponry. Her ability to slip
              through dimensions allows her to be anywhere and nowhere, striking down threats to Erevos’s plans without
              leaving a trace.
            </Text>

            <Text style={styles.aboutText}>
              She is deeply in love with Void Walker (Sam), which has led to a personal and bitter rivalry with Chrona.
              Despite being assigned to eliminate Sam for betraying the Enlightened, she has repeatedly failed or
              hesitated—torn between duty and emotion.
            </Text>

            <Text style={styles.aboutText}>
              Among the Enlightened, Sable is one of Erevos’s deadliest lieutenants and serves as his most effective spy
              and informant.
            </Text>

            <Text style={styles.aboutText}>
              Preferred weapons: twin void-forged blades that phase through armor and disrupt neural pathways, leaving
              enemies conscious but paralyzed.
            </Text>

            <Text style={styles.aboutText}>
              Her armor adapts to shadows, rendering her nearly invisible in darkened environments. When moving, she
              emits no sound—only the shimmer of displaced air.
            </Text>

            <Text style={styles.aboutText}>
              Codename within the Enlightened:{" "}
              <Text style={{ fontWeight: "900", color: "rgba(255, 49, 49, 0.95)" }}>
                “The Final Whisper”
              </Text>
              .
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

  // 🎧 MUSIC BAR — BLACK + ENERGY RED (NO GLOW)
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(8, 8, 10, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 49, 49, 0.38)",
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
    borderColor: "rgba(255, 49, 49, 0.55)",
    backgroundColor: "rgba(12, 12, 14, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#F7F7F7", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(10, 10, 12, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.35)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(247, 247, 247, 0.70)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#F7F7F7", fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: "rgba(12, 12, 14, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.55)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(10, 10, 12, 0.90)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  musicText: { color: "#F7F7F7", fontWeight: "bold", fontSize: 13 },
  musicTextAlt: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  disabled: { opacity: 0.5 },

  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(12, 12, 14, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.45)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#F7F7F7" },

  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(12, 12, 14, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.22)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "rgba(255, 49, 49, 0.95)",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(247, 247, 247, 0.82)",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(10, 10, 12, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.16)",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#F7F7F7", textAlign: "center" },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 49, 49, 0.70)",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.20)",
    backgroundColor: "rgba(0,0,0,0.55)",
  }),
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    color: "#F7F7F7",
    fontSize: 12,
    fontWeight: "700",
  },

  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(8, 8, 10, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.18)",
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: "rgba(255, 49, 49, 0.95)",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  aboutText: {
    fontSize: 14,
    color: "#F7F7F7",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
