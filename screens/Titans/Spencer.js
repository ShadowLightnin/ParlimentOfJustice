import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🔥 Spencer music array (you can swap these files later)
const TRACKS = [
  {
    id: "annihilator_main",
    label: "Annihilator Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "annihilator_variant",
    label: "Annihilator – Variant",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const Spencer = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

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

  const armors = [
    { name: "Annihilator", image: require("../../assets/Armor/Spencer8.jpg"), clickable: true },
    { name: "Annihilator", image: require("../../assets/Armor/Spencer6.jpg"), clickable: true },
    { name: "Annihilator", image: require("../../assets/Armor/Spencer7.jpg"), clickable: true },
    { name: "Legacy", image: require("../../assets/Armor/SpencerLegacy.jpg"), clickable: true },
    { name: "Annihilator", image: require("../../assets/Armor/Spencer3.jpg"), clickable: true },
  ];

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
        console.error("Failed to play track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound]
  );

  const playTheme = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
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
    const nextIndex =
      (trackIndex + direction + TRACKS.length) % TRACKS.length;
    setTrackIndex(nextIndex);
    if (isPlaying) {
      await loadAndPlayTrack(nextIndex);
    } else {
      // not playing, just change label, no audio
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

  // ───────── RENDER CARDS ─────────
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
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || "Unknown"}; William Cummings
      </Text>
      {!armor.clickable && (
        <Text style={styles.disabledText}>Not Clickable</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🔥 MUSIC BAR */}
      <View style={styles.musicControls}>
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
          style={[
            styles.musicButton,
            isPlaying && styles.musicButtonDisabled,
          ]}
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
        {/* HEADER */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Annihilator</Text>
              <Text style={styles.subtitle}>Guardian • Caring • The First</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annihilator Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          {/* <Text style={styles.aboutText}>
          Spencer McNeil, known as Annihilus, is the eldest of the McNeil siblings and the oldest among the nine oldest cousins, making him a foundational figure in the Titans and the Parliament of Justice. His imposing presence is a mix of authority, nostalgia, and vulnerability, a fallen leader who once united his extended family but now struggles with uncertainty. He’s deeply committed to helping others, especially his siblings Jared and Jennifer, his cousins Ben and Azure (Briggs), Will and Emma (Cummings), and the other oldest cousins like Josh S and Garden. Spencer prefers the simplicity and morality of a bygone era, reminiscent of Christ’s time, where faith, community, and honor guided actions. Despite losing his way, his inherent goodness and love for his family—spanning the McNeil’s, Briggs, Cummings, Jensen’s, Bolander’s, and Stillman families—make him a cherished, if conflicted, patriarch.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Raised in a remote village on the edge of Zion City’s Terrestrial sector, Spencer was the firstborn of the McNeil siblings, with Jared and Jennifer following closely. His family, part of a larger network of cousins from the Cummings, Jensen’s, Briggs, Bolander’s, and Stillman clans, shared a deep-rooted tradition of faith, strength, and unity. As the oldest cousin, Spencer took it upon himself to lead, mentoring not only his siblings but also cousins like Ben and Azure (Briggs), Will and Emma (Cummings), and the Stillman cousins Josh S and Garden, who were among the nine oldest.
          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors fractured, Spencer’s village faced raids from the lawless Outer Darkness sector. During one such attack, his super strength emerged, saving his siblings and cousins and solidifying his role as the Titans’ leader. The burning goat skull relic he later discovered—tied to myths of destruction and renewal—became his symbol, but as modern corruption and technological overreach grew, Spencer began to withdraw, longing for the simplicity of the past.          
          </Text>
          <Text style={styles.aboutText}>
          His leadership waned as he saw the younger cousins, like Jared, adapt to the new world with speed and innovation, while he clung to outdated ideals. Among the nine oldest cousins, only seven—Spencer, Jared, Jennifer, Ben, Azure, Will, and Emma—formed the core Titans, with Josh S and Garden occasionally stepping in. Spencer now sees Jared as his potential successor, a realization that both inspires and haunts him, as he fears losing the values he holds dear.          
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Spencer’s powers are a reflection of his role as a fallen leader and protector of his vast family          
          </Text>
          <Text style={styles.aboutText}>
          Super Strength: The cornerstone of his identity, now tempered by doubt but still formidable when inspired by his family’s faith.          
          </Text>
          <Text style={styles.aboutText}>
          Endurance: A testament to his lifelong commitment to his cousins and siblings, though he sometimes overextends himself.          
          </Text>
          <Text style={styles.aboutText}>
          Fire Aura: The flickering flames of his helmet symbolize his inner struggle, burning brightly when he draws strength from family bonds.          
          </Text>
          <Text style={styles.aboutText}>
          Primal Instinct: Rooted in his shared heritage with the Briggs and Cummings cousins, this instinct helps him protect and anticipate threats.          
          </Text>
          <Text style={styles.aboutText}>
          Earthshaking Impact: A power to disrupt and defend, often used to shield his family from Zion City’s chaos.          
          </Text>
          <Text style={styles.aboutText}>
          Inspirational Presence: His ability to uplift his siblings and cousins, especially Jared, whom he mentors as his successor, remains his greatest asset.          
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          As the oldest Titan and cousin, Spencer is the unofficial patriarch of the nine oldest, but his fall from leadership has left him searching for purpose. He’s deeply connected to his siblings (Jared and Jennifer) and cousins (Ben and Azure, Will and Emma, Josh S and Garden), often acting as their advisor and protector. His preference for the past clashes with the modern approaches of younger cousins like Lee (Jensen) and Mason (Stillman), but his goodness ensures he remains a stabilizing force.          
          </Text>
          <Text style={styles.aboutText}>
          Spencer sees Jared as his successor, a role that both pressures and inspires him. His relationships with the other Titans—Jennifer’s compassion, Ben and Azure’s teamwork, Will and Emma’s innovation—are rooted in shared history, while his interactions with the broader family (like Todd’s leadership from Cummings or Samantha’s strength) remind him of his broader responsibility. His goal is to reclaim his leadership by guiding Jared and the Titans to balance tradition and progress, ensuring Zion City’s safety for all their families.          
          </Text> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#070305",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🔥 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(15, 4, 4, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 140, 80, 0.4)",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 174, 66, 0.9)",
    backgroundColor: "rgba(40, 12, 4, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#ffe9c4",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(30, 8, 4, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 174, 66, 0.7)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffd9b0",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fff2dc",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(120, 30, 10, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 120, 70, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(20, 8, 6, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 180, 120, 0.8)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#fff4ea",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#ffe1c5",
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
    backgroundColor: "rgba(40, 10, 6, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 120, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#ffe9d3",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(35, 8, 6, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 120, 70, 0.8)",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff4ea",
    textAlign: "center",
    textShadowColor: "#ff6b35",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffd2ad",
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
    backgroundColor: "rgba(24, 6, 6, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 120, 70, 0.5)",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffe9d3",
    textAlign: "center",
    textShadowColor: "#ffae42",
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
    backgroundColor: "rgba(255, 174, 66, 0.9)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // CARDS
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(10, 2, 2, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 80, 0.9)",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.75,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  }),
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  clickable: {},
  notClickable: {
    opacity: 0.75,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    fontSize: 12,
    color: "#ffe9d3",
    fontWeight: "600",
    textShadowColor: "#000",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  disabledText: {
    position: "absolute",
    top: 10,
    right: 12,
    fontSize: 10,
    color: "#ff9b7a",
    fontWeight: "600",
  },

  // ABOUT (for when you uncomment)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(22, 6, 4, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 80, 0.6)",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffe9d3",
    textAlign: "center",
    textShadowColor: "#ffae42",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#ffe0c4",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Spencer;
