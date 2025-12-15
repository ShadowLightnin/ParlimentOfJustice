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
    id: "red_mercury_main",
    label: "Crimson Consensus",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "red_mercury_alt",
    label: "Gilded Pressure",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  { name: "Lane Mercury", image: require("../../../assets/Villains/RedMercury.jpg"), clickable: true },
  { name: "Red Mercury", image: require("../../../assets/Villains/RedMercury2.jpg"), clickable: true },
];

export default function RedMercuryScreen() {
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
        console.error("Failed to play Red Mercury track", e);
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
                <Text style={styles.title}>Lane Mercury</Text>
                <Text style={styles.subtitle}>Crimson Influence • Cold Calculation • World-Lever Control</Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mercury Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              • <Text style={{ fontWeight: "900" }}>Red Mercury</Text>: Born Lane Mercury — master manipulator of global
              influence, unmatched in wealth, charisma, and cold calculation.
            </Text>

            <Text style={styles.aboutText}>
              Red Mercury views heroes as naive idealists — fools who disrupt the natural order with sentiment and chaos.
              To him, moral codes are liabilities that prevent “true” progress.
            </Text>

            <Text style={styles.aboutText}>
              A former tech mogul turned political kingmaker, Lane presents as a benevolent futurist and public
              philanthropist while secretly funding warlords, black-ops units, and authoritarian regimes to destabilize the
              world and manufacture dependence on his empire.
            </Text>

            <Text style={styles.aboutText}>
              Lane’s influence stretches across the globe — from stock markets and digital infrastructure to election
              shaping through deepfake media networks. He operates with near-untouchable protection and wields entire
              governments as puppets.
            </Text>

            <Text style={styles.aboutText}>
              His conglomerate, <Text style={{ fontWeight: "900" }}>Mercury Global</Text>, is the financial engine behind
              The Enlightened — hiding black projects behind shell companies, corporate espionage, and “public safety”
              initiatives.
            </Text>

            <Text style={styles.aboutText}>
              Lane’s loyalty to Erevos is ideology-first: he admires Erevos as the apex of evolution and sees himself as
              the architect behind Erevos’s ascent.
            </Text>

            <Text style={styles.aboutText}>
              He employs his personal assassin, <Text style={{ fontWeight: "900" }}>Blackout</Text> — a silent operative
              cloaked in disruption fields, capable of neutralizing electronics and erasing threats before they ever reach
              the spotlight.
            </Text>

            <Text style={styles.aboutText}>
              Red Mercury is the political puppetmaster and financial juggernaut of The Enlightened — every law pushed,
              every crisis exploited, every conflict prolonged is another lever in his hand.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const ACCENT_RED = "#FF3131";     // main red
const ACCENT_GOLD = "#D4AF37";    // hint of gold

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { backgroundColor: "rgba(0,0,0,0.86)", flex: 1 },
  scrollContainer: { paddingBottom: 30 },

  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(12, 8, 8, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 49, 49, 0.28)",
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
    borderColor: "rgba(255, 49, 49, 0.70)",
    backgroundColor: "rgba(18, 10, 10, 0.96)",
    marginRight: 6,
  },
  trackButtonText: { color: "#FFECEC", fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(16, 10, 10, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.40)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: "rgba(255, 236, 236, 0.70)", fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#FFECEC", fontSize: 13, fontWeight: "700" },

  musicButton: {
    backgroundColor: "rgba(16, 10, 10, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.70)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(10, 10, 10, 0.90)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  musicText: { color: "#FFECEC", fontWeight: "bold", fontSize: 13 },
  musicTextAlt: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  disabled: { opacity: 0.5 },

  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(16, 10, 10, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.55)",
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#FFECEC" },

  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(16, 10, 10, 0.92)",
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
    color: ACCENT_RED,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 236, 236, 0.82)",
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
    backgroundColor: "rgba(10, 8, 8, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.16)",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#FFECEC", textAlign: "center" },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 49, 49, 0.75)",
  },

  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.28)",
    backgroundColor: "rgba(0,0,0,0.55)",
  }),
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    color: "#FFECEC",
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
    backgroundColor: "rgba(8, 6, 6, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.18)",
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: ACCENT_RED,
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "#000",
    textShadowRadius: 10,
  },

  aboutText: {
    fontSize: 14,
    color: "#FFECEC",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
