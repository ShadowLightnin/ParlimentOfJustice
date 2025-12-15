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

// 🎧 Titanus tracks (swap files if you want different ones)
const TRACKS = [
  {
    id: "titanus_main",
    label: "Iron Dominion",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "titanus_alt",
    label: "Molten March",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  {
    name: "Titanus",
    image: require("../../../assets/Villains/Titanus.jpg"),
    clickable: true,
  },
];

export default function TitanusScreen() {
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
        console.error("Failed to play Titanus track", e);
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
        {/* 🎧 MUSIC BAR — STEEL GRAY + BURNING ORANGE (NO GLOW) */}
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
                <Text style={styles.title}>Titanus</Text>
                <Text style={styles.subtitle}>Steel • Brutality • Executioner</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Titanus Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              Titanus, the Titan of Steel: Enhanced by experimental cybernetics and mutated DNA, Titanus is the muscle of
              The Enlightened, with strength that rivals even the strongest Titans of the Parliament. His primary role is
              to crush resistance with brute force. He is a bodyguard for Erevos—though Erevos rarely needs one.
            </Text>

            <Text style={styles.aboutText}>
              Once a gladiator imprisoned in an off-world penal colony, Titanus earned his name by surviving every
              deathmatch and becoming legend. His body was reshaped in a brutal experiment fusing alien alloys with human
              flesh, leaving him more weapon than man.
            </Text>

            <Text style={styles.aboutText}>
              He was freed by Erevos during a prison siege and pledged his allegiance out of sheer respect for Erevos’s
              power and promise of purpose. Titanus sees Erevos as the only being worthy of commanding him.
            </Text>

            <Text style={styles.aboutText}>
              Despite his rage and might, Titanus is strategic, patient, and holds a code of honor forged in battle. He
              despises cowardice, manipulation, and weakness—which fuels his hatred for most heroes.
            </Text>

            <Text style={styles.aboutText}>
              Among The Enlightened, Titanus serves not just as a blunt instrument, but as a war general and executioner.
              When diplomacy fails—or Erevos wants to send a message—Titanus is unleashed.
            </Text>

            <Text style={styles.aboutText}>
              Rivalry: <Text style={{ fontWeight: "900", color: "rgba(255, 140, 40, 0.95)" }}>Annihilator</Text> — whom he
              once battled for hours across a broken planet during a failed ambush. Titanus still bears the scar—and the
              grudge.
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

  // 🎧 MUSIC BAR — STEEL + ORANGE (NO GLOW)
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(10, 11, 12, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 140, 40, 0.38)",
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
    borderColor: "rgba(200, 205, 210, 0.55)",
    backgroundColor: "rgba(16, 17, 18, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#F7F7F7", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(14, 15, 16, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 40, 0.32)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(247, 247, 247, 0.70)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#F7F7F7", fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: "rgba(14, 15, 16, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 140, 40, 0.55)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(12, 13, 14, 0.90)",
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
    backgroundColor: "rgba(16, 17, 18, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(200, 205, 210, 0.40)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#F7F7F7" },

  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(12, 13, 14, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 40, 0.22)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "rgba(255, 140, 40, 0.95)",
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
    backgroundColor: "rgba(10, 11, 12, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(200, 205, 210, 0.14)",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#F7F7F7", textAlign: "center" },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 140, 40, 0.70)",
  },

  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(200, 205, 210, 0.22)",
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
    backgroundColor: "rgba(8, 9, 10, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 40, 0.16)",
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: "rgba(255, 140, 40, 0.95)",
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
