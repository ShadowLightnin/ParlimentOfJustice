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

// 🟣 Palette: Void Black + Deep Gem Purple
const COLORS = {
  void: "rgba(6, 6, 10, 0.97)",
  void2: "rgba(10, 8, 14, 0.92)",
  glass: "rgba(10, 8, 14, 0.90)",

  gem: "#6D28D9",          // deep gem purple
  gemHot: "#8B5CF6",       // brighter accent (still “gem”)
  gemSoft: "rgba(109, 40, 217, 0.35)",
  gemLine: "rgba(109, 40, 217, 0.55)",
  gemGlow: "rgba(139, 92, 246, 0.25)",

  text: "#FFF7FF",
  textSoft: "rgba(255, 247, 255, 0.82)",
  line: "rgba(255, 255, 255, 0.14)",
  line2: "rgba(255, 255, 255, 0.24)",
};

// 🎧 Optional (swap later if you add Almarra audio)
const TRACKS = [
  {
    id: "almarra_main",
    label: "Enchanted Empress Theme",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "almarra_alt",
    label: "Fateweaver Mix",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

const characters = [
  {
    name: "Almarra",
    image: require("../../../assets/Villains/Almarra.jpg"),
    clickable: true,
  },
];

export default function AlmarraScreen() {
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
        console.error("Failed to play Almarra track", e);
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
        {/* 🎧 MUSIC BAR — gem glass */}
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
                <Text style={styles.title}>Almarra</Text>
                <Text style={styles.subtitle}>
                  Enchanted Empress • Fateweaver • Void Royalty
                </Text>
              </View>
            </View>
          </View>

          {/* GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Empress Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* DOSSIER */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>Dossier</Text>

            <Text style={styles.aboutText}>
              Almarra was not born—she was woven into existence by the threads of
              destiny itself. Once a mortal queen of an empire lost to time, she
              sought absolute control over fate, refusing to let her people fall
              to war, death, or the whims of lesser rulers.
            </Text>

            <Text style={styles.aboutText}>
              She turned to forbidden magic, bending the fabric of reality
              itself, but in doing so, she became something more—an entity
              unbound by time, space, or mortality. Her empire crumbled,
              swallowed by the abyss, yet Almarra remained—forever reshaping
              herself into the perfect being.
            </Text>

            <Text style={styles.aboutText}>
              Now, she moves through the cosmos like a ghostly monarch, her
              presence heralded by shadowy fog and whispered prophecy. Wherever
              Almarra treads, reality bends, kingdoms fall, and fate rewrites
              itself in her image.
            </Text>

            <Text style={styles.aboutText}>
              She does not conquer through brute force alone. She enthralls. She
              seduces. She reconstructs the will of others until they desire to
              serve her. Her enemies do not simply die—they are woven into her
              legend, their souls bound in eternal servitude.
            </Text>

            <Text style={[styles.aboutText, { marginTop: 10 }]}>
              <Text style={{ fontWeight: "900", color: COLORS.gemHot }}>
                Powers & Abilities
              </Text>
            </Text>

            <Text style={styles.aboutText}>
              • Weaver of Fate — rewrites outcomes, ensuring victory before a
              battle even begins.
            </Text>
            <Text style={styles.aboutText}>
              • Celestial Enchantment — intoxicating magic that reshapes minds
              and bodies of those who oppose her.
            </Text>
            <Text style={styles.aboutText}>
              • Ethereal Form — untouchable unless she allows it; her touch can
              bind a soul for eternity.
            </Text>
            <Text style={styles.aboutText}>
              • Crown of Dominion — a conduit of cosmic power, amplifying her
              magic beyond mortal comprehension.
            </Text>
            <Text style={styles.aboutText}>
              • The Empress’s Fog — a creeping mist that whispers the names of
              those who will fall under her influence next.
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
    borderBottomColor: COLORS.gemSoft,
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
  trackButtonText: { color: COLORS.text, fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.gemSoft,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: COLORS.gemHot, fontSize: 11, marginRight: 6 },
  trackTitle: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: COLORS.void2,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.gemSoft,
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
  musicText: { color: COLORS.text, fontWeight: "bold", fontSize: 13 },
  musicTextAlt: { color: COLORS.textSoft, fontWeight: "bold", fontSize: 13 },
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
    borderColor: COLORS.gemSoft,
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: COLORS.text },
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
    color: COLORS.gemHot,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: COLORS.gemGlow,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSoft,
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
    backgroundColor: COLORS.gemSoft,
  },

  // CARD
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.gemSoft,
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
    color: COLORS.gemHot,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.6,
    textShadowColor: COLORS.gemGlow,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});
