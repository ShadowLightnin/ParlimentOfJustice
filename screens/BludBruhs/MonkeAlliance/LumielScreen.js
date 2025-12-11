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

// 🎧 Lumiel / Mansion themes – swap to your real audio files
const TRACKS = [
  // {
  //   id: "lumiel_theme",
  //   label: "Lumiel's Lament",
  //   source: require("../../../assets/audio/lumiel.m4a"), // 🔧 update path
  // },
  // {
  //   id: "mansion_heart",
  //   label: "Heart of the Mansion",
  //   source: require("../../../assets/audio/lumiel.m4a"), // 🔧 or second track
  // },
];

const armors = [
  {
    name: "Lumiel",
    image: require("../../../assets/Armor/LumielPhantom.jpg"),
    clickable: true,
  },
];

const LumielScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // 🎶 audio state
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

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
          { isLooping: true, volume: 1.0 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Lumiel track", e);
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

  // Stop audio when leaving screen
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

  const renderArmorCard = (armor, index) => (
    <TouchableOpacity
      key={`${armor.name}-${index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        armor.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
      activeOpacity={0.9}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || "Unknown"}; William Cummings
      </Text>
      {!armor.clickable && (
        <Text style={styles.disabledText}>Not Clickable</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/Armor/LumielAngel.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* 🎧 LUMIEL MUSIC BAR – soft gold / ethereal */}
        {/* <View style={styles.musicControls}>
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
        </View> */}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* HEADER – glass panel over mansion bg */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>Lumiel</Text>
                <Text style={styles.subtitle}>
                  Fallen Guardian of the Montrose Mansion
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={SCREEN_WIDTH * 0.7 + 20}
              decelerationRate="fast"
            >
              {armors.map(renderArmorCard)}
            </ScrollView>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              “No, I am a physical memory of what I once was, I am the life
              blood of the Mansion you see before you.”
            </Text>
            <Text style={styles.aboutText}>
              “It is my duty to protect all mortals in Melcornia. I created the
              Mansion as a sanctuary for a lost family that was stranded here
              long ago. The Mansion would protect them from the creatures on
              this planet. Until the demons came and stole the Mansion from me
              and defiled it. I was once an angel of light, but the grief and
              sadness of my failure to protect the Montrose family withered away
              my magnificence."
            </Text>
            <Text style={styles.aboutText}>
              “My name was in a tongue mortals would not understand. In your
              tongue it would sound something like… Lumiel.”
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
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.82)",
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 28,
  },

  // 🎧 MUSIC BAR – soft gold / white
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(5, 4, 10, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(240, 216, 140, 0.9)",
    shadowColor: "#f4e6c8",
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.9)",
    backgroundColor: "rgba(10, 8, 18, 0.96)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#fdf8ea",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(12, 10, 22, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.9)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#f2dba0",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fdf8ea",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(240, 216, 140, 0.98)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(14, 10, 4, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(10, 8, 18, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.85)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#2b1e05",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#fdf8ea",
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
    backgroundColor: "rgba(8, 6, 12, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.85)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#fdf8ea",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(15, 10, 18, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.9)",
    shadowColor: "#f4e6c8",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#f4e6c8",
    textAlign: "center",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    color: "#f2dba0",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // IMAGE STRIP
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },

  // CARD
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 14,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.9)",
    shadowColor: "#f4e6c8",
    shadowOpacity: 0.7,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
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
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
  },

  // ABOUT
  aboutSection: {
    marginTop: 40,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: "rgba(6, 5, 10, 0.94)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(240, 216, 140, 0.75)",
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f4e6c8",
    textAlign: "center",
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 16,
    color: "#fdf8ea",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
});

export default LumielScreen;
