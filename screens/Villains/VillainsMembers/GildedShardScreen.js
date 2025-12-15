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

// ✅ TEMP TRACKS (safe placeholder). Swap to your real Gilded Shard audio later.
const TRACKS = [
  { id: "gilded_main", label: "Gilded Shard Theme", source: require("../../../assets/audio/sableEvilish.m4a") },
  { id: "gilded_alt", label: "Cursed Gold Mix", source: require("../../../assets/audio/sableEvilish.m4a") },
];

const characters = [
  { name: "Gilded Shard", image: require("../../../assets/Villains/GildedShard.jpg"), clickable: true },
  { name: "Girl Gilded Shard", image: require("../../../assets/Villains/FGildedShard.jpg"), clickable: true },
];

export default function GildedShardScreen() {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const isDesktop = windowWidth >= 768;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  // ───────── AUDIO SAFETY ─────────
  const safeTracks =
    Array.isArray(TRACKS) && TRACKS.length > 0
      ? TRACKS
      : [{ id: "fallback", label: "No Track", source: null }];

  const safeIndex = Math.min(Math.max(trackIndex, 0), safeTracks.length - 1);
  const currentTrack = safeTracks[safeIndex];

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
        console.error("Failed to play Gilded Shard track", e);
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

  // ───────── UI ─────────
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
                <Text style={styles.title}>Gilded Shard</Text>
                <Text style={styles.subtitle}>Cursed Gold • Fracture • Torment</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shard Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal contentContainerStyle={styles.imageScrollContainer} showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              Nemesis:{" "}
              <Text style={{ fontWeight: "900", color: "rgba(255, 49, 49, 0.95)" }}>
                Jennifer McNeil — Kintsugi
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              Elias Mendez was once a master craftsman—until a failed experiment shattered more than his body. His flesh
              split into living fractures, bound by cursed gold that pulses like molten veins. In the ruins of his old
              life, he became the Gilded Shard: a man held together by pain and obsession.
            </Text>

            <Text style={styles.aboutText}>
              He is fascinated by Jennifer’s Kintsugi armor, seeing a “kindred fracture,” but he despises her calm and
              acceptance. To him, brokenness isn’t something to honor—it’s a sentence. He wants to break her peace and
              force her to wear torment as truth.
            </Text>

            <Text style={styles.aboutText}>
              Abilities: mineral/metal control, shard extrusion and telekinetic “gold stitching,” localized petrification,
              and impact-splinter bursts (fracture shockwaves).
            </Text>

            <Text style={styles.aboutText}>
              Weapon: forged “Gilded Chisel” + detachable razor shards that reassemble mid-air into blades, chains, or a
              crushing halo-cage.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { backgroundColor: "rgba(0, 0, 0, 0.82)", flex: 1 },
  scrollContainer: { paddingBottom: 20 },

  // ✅ THEME: obsidian + molten gold + bone-white (NO red)
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(8, 8, 10, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217, 175, 72, 0.35)",
    shadowColor: "#D9AF48",
    shadowOpacity: 0.30,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.85)",
    backgroundColor: "rgba(14, 14, 16, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#FFF3D1", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(12, 12, 14, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.55)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(255, 243, 209, 0.70)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#FFF3D1", fontSize: 13, fontWeight: "700" },

  musicButton: {
    backgroundColor: "rgba(18, 14, 8, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.90)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(10, 10, 12, 0.90)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  musicButtonDisabled: { opacity: 0.55 },
  musicButtonText: { color: "#FFF3D1", fontWeight: "bold", fontSize: 13 },
  musicButtonTextSecondary: { color: "#F2F2F2", fontWeight: "bold", fontSize: 13 },

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(14, 14, 16, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.90)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#FFF3D1" },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(12, 12, 14, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.45)",
    shadowColor: "#D9AF48",
    shadowOpacity: 0.30,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#D9AF48",
    textAlign: "center",
    textShadowColor: "#D9AF48",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 243, 209, 0.82)",
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
    backgroundColor: "rgba(14, 14, 16, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.30)",
    shadowColor: "#D9AF48",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF3D1",
    textAlign: "center",
    textShadowColor: "#D9AF48",
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
    backgroundColor: "rgba(217, 175, 72, 0.90)",
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
    backgroundColor: "rgba(8, 8, 10, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.85)",
    shadowColor: "#D9AF48",
    shadowOpacity: 0.55,
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
    color: "#FFF3D1",
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
    backgroundColor: "rgba(10, 10, 12, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(217, 175, 72, 0.35)",
    shadowColor: "#D9AF48",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D9AF48",
    textAlign: "center",
    textShadowColor: "#D9AF48",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#FFF3D1",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
