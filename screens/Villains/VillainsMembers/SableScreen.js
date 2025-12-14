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
    source: require("../../../assets/audio/sableGood.m4a"), // second variant; replace if you add another file
  },
];

const characters = [
  {
    name: "Sable",
    image: require("../../../assets/Villains/Sable.jpg"),
    clickable: true,
  },
  {
    name: "Sable Shadow",
    image: require("../../../assets/Villains/Sable2.jpg"),
    clickable: true,
  },
];

const SableScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];
  const isDesktop = windowWidth >= 768;

  // ✅ Responsive width listener
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  // ───────── AUDIO HELPERS ─────────
  const unloadSound = useCallback(async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch {}
      try {
        await sound.unloadAsync();
      } catch {}
      setSound(null);
    }
  }, [sound]);

  const loadAndPlayTrack = useCallback(
    async (index) => {
      await unloadSound();
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          TRACKS[index].source,
          { isLooping: true, volume: 0.8 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Sable track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound]
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
      await loadAndPlayTrack(trackIndex);
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
    const nextIndex = (trackIndex + direction + TRACKS.length) % TRACKS.length;
    setTrackIndex(nextIndex);
    if (isPlaying) {
      await loadAndPlayTrack(nextIndex);
    } else {
      await unloadSound();
    }
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
      <Text style={styles.cardName}>
        © {character.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* 🎧 MUSIC BAR – glassy assassin / Enlightened vibe */}
        <View className="music-bar" style={styles.musicControls}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => cycleTrack(-1)}
          >
            <Text style={styles.trackButtonText}>⟵</Text>
          </TouchableOpacity>

          <View style={styles.trackInfoGlass}>
            <Text style={styles.trackLabel}>Track:</Text>
            <Text style={styles.trackTitle}>{currentTrack.label}</Text>
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
            disabled={isPlaying}
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
          {/* HEADER – glass, clean, like the others */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Sable the Assassin</Text>
                <Text style={styles.subtitle}>
                  Blades • Shadows • Final Whisper
                </Text>
              </View>
            </View>
          </View>

          {/* ARMORY / GALLERY SECTION */}
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

          {/* ABOUT SECTION – kept, but glassed up */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              • Nemesis: Sam Woodwell “Void Walker”
            </Text>
            <Text style={styles.aboutText}>
              Sable is a merciless warrior with an arsenal of deadly,
              shadow-infused weaponry. Her ability to slip through dimensions
              allows her to be anywhere and nowhere, striking down threats to
              Erevos’s plans without leaving a trace.
            </Text>
            <Text style={styles.aboutText}>
              She is deeply in love with Void Walker (Sam), which has led to a
              personal and bitter rivalry with Chrona, who also harbors feelings
              for him. Despite Erevos assigning her to eliminate Sam for
              betraying the Enlightened, she has repeatedly failed or hesitated
              — torn between duty and emotion. Instead of executing him, she
              often settles for mortally wounding him or letting him go.
            </Text>
            <Text style={styles.aboutText}>
              Among the Enlightened, Sable is considered one of Erevos’s
              deadliest lieutenants and serves as his most deadly and effective
              spy and informant.
            </Text>
            <Text style={styles.aboutText}>
              She was once Erevos’s top infiltrator during the Shadow Purges, a
              mission that wiped out dozens of rising metahuman factions before
              they could become threats. Her name is whispered in fear by
              resistance cells.
            </Text>
            <Text style={styles.aboutText}>
              Her preferred weapons are twin void-forged blades that phase
              through armor and disrupt neural pathways, leaving enemies
              conscious but paralyzed.
            </Text>
            <Text style={styles.aboutText}>
              Sable’s armor adapts to shadows, rendering her nearly invisible in
              darkened environments. When moving, she emits no sound—only the
              shimmer of displaced air.
            </Text>
            <Text style={styles.aboutText}>
              Despite her loyalty to Erevos, she often questions the cost of
              obedience. Each mission that pits her against Sam drives deeper
              fractures into her soul.
            </Text>
            <Text style={styles.aboutText}>
              She and Obelisk frequently operate together, with Obelisk serving
              as the brute enforcer while Sable handles the surgical precision
              of espionage and assassination.
            </Text>
            <Text style={styles.aboutText}>
              Sable’s codename among the Enlightened is “The Final Whisper”
              — because when she appears, there is no sound, no escape, and no
              warning.
            </Text>
            <Text style={styles.aboutText}>
              Sable was once a war orphan taken in by Erevos during one of his
              earliest purges. She grew up in his shadow, trained by his
              assassins, and eventually earned his personal trust and
              mentorship.
            </Text>
            <Text style={styles.aboutText}>
              She believes Erevos saved her from a meaningless, brutal life. Her
              loyalty is born from gratitude, purpose, and belief that his
              vision, however cruel, will bring lasting order to the galaxy.
            </Text>
            <Text style={styles.aboutText}>
              Sable is furious at Sam’s defection. She sees it as a personal
              betrayal—not just of Erevos, but of everything they survived
              together. She cannot understand why he would throw it all away.
            </Text>
            <Text style={styles.aboutText}>
              Her emotional conflict with Sam—caught between vengeance,
              heartbreak, and lingering love—is one of the few vulnerabilities
              she cannot cloak in shadow.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.80)", // dark glass over bg
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR – void / gold glass
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(5, 3, 10, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.7)", // gold hint
    shadowColor: "#D4AF37",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(230, 220, 255, 0.9)",
    backgroundColor: "rgba(18, 10, 30, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#f7f3ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(12, 8, 24, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#e3d6ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fff9e8",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(212, 175, 55, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 220, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(20, 10, 34, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#1b102a",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#fff9e8",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(18, 10, 30, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.8)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#f7f3ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(8, 4, 18, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.9)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#D4AF37",
    textAlign: "center",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#f0e7c0",
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
    backgroundColor: "rgba(8, 4, 20, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.45)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff9e8",
    textAlign: "center",
    textShadowColor: "#000",
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
    backgroundColor: "rgba(212, 175, 55, 0.9)",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // CARD
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    marginRight: 18,
    backgroundColor: "rgba(6, 2, 18, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.9)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.75,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  }),
  clickable: {},
  notClickable: {
    opacity: 0.8,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 12,
    color: "#fff9e8",
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
    backgroundColor: "rgba(8, 4, 20, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.9)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D4AF37",
    textAlign: "center",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#f0e7c0",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default SableScreen;
