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

const TRACKS = [
  {
    id: "noctura_main",
    label: "Velvet Hex",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "noctura_alt",
    label: "Violet Mirage",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  {
    name: "Noctura the Illusionist",
    image: require("../../../assets/Villains/Noctura.jpg"),
    clickable: true,
  },
];

export default function NocturaScreen() {
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
        console.error("Failed to play Noctura track", e);
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
    <TouchableOpacity key={character.name} style={[styles.card(isDesktop, windowWidth)]} activeOpacity={0.9}>
      <Image source={character.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>© {character.name}; William Cummings</Text>
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
                <Text style={styles.title}>Noctura the Illusionist</Text>
                <Text style={styles.subtitle}>Dreamweaving • Reality Warp • Sovereign Control</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Illusion Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              Identity: <Text style={{ fontWeight: "900" }}>Liora Valen</Text>
            </Text>

            <Text style={styles.aboutText}>
              Profile: Reigning queen of illusion and deception — conjures reality-warping hallucinations that cloud the
              minds of even the strongest heroes, turning certainty into doubt and allies into strangers.
            </Text>

            <Text style={styles.aboutText}>
              Doctrine: Rejects compassion as weakness — believes peace can only come through control, not empathy.
            </Text>

            <Text style={styles.aboutText}>
              Method: Mass hypnosis through broadcasts and “shared dreams” — can impersonate leaders, manufacture
              disasters, conceal fleets, and appear in multiple places at once to seed disinformation.
            </Text>

            <Text style={styles.aboutText}>
              Rank: Erevos’s high priestess of perception — a primary lieutenant and co-strategist alongside Obelisk,
              entrusted with the cabal’s most delicate plans.
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

  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(10, 8, 14, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(186, 85, 255, 0.28)", // magical purple
    shadowColor: "#BA55FF",
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
    borderColor: "rgba(186, 85, 255, 0.70)",
    backgroundColor: "rgba(16, 12, 22, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#F2E8FF", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(14, 10, 20, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.40)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(242, 232, 255, 0.70)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#F2E8FF", fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: "rgba(14, 10, 20, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.70)",
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
  musicText: { color: "#F2E8FF", fontWeight: "bold", fontSize: 13 },
  musicTextAlt: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  disabled: { opacity: 0.5 },

  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(14, 10, 20, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.55)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#F2E8FF" },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(14, 10, 20, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.22)",
    shadowColor: "#BA55FF",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#BA55FF",
    textAlign: "center",
    textShadowColor: "#BA55FF",
    textShadowRadius: 12,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(242, 232, 255, 0.82)",
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
    backgroundColor: "rgba(10, 8, 14, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.16)",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#F2E8FF", textAlign: "center" },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(186, 85, 255, 0.75)",
  },

  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.28)",
    backgroundColor: "rgba(0,0,0,0.55)",
  }),
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    color: "#F2E8FF",
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "#000",
    textShadowRadius: 10,
  },

  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(8, 6, 12, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(186, 85, 255, 0.18)",
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: "#BA55FF",
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "#BA55FF",
    textShadowRadius: 10,
  },
  aboutText: {
    fontSize: 14,
    color: "#F2E8FF",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
