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

// 🎧 Shadowmind / Thunder Born tracks
const TRACKS = [
  {
    id: "shadowmind_main",
    label: "Shadowmind Theme",
    // 🔧 Update this path/name if your file is different
    source: require("../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "shadowmind_alt",
    label: "Thunderborn Shadows",
    source: require("../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  {
    name: "Shadowmind",
    image: require("../../assets/Armor/JamesBb.jpg"),
    clickable: true,
  },
];

const JameBb = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
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
        console.error("Failed to play Shadowmind track", e);
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

  // stop sound when leaving screen
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
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – shadow / violet glass, like the others */}
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
        {/* HEADER – glassy, shadow-themed */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Shadowmind</Text>
              <Text style={styles.subtitle}>Shadows • Silence • Thunder</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shadow Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* ABOUT SECTION (kept commented, like others) */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          James, known as Shadowmind, is a silent and enigmatic operative, the elusive shadow of the Thunder Born, reborn from the fractured Bludbruhs within Zion City’s chaotic realm. His presence is subtle yet unnerving, a blend of stealth and perception that makes him a ghostly asset to his team. Behind his shadowy armor, James is reserved, insightful, and fiercely loyal to his Thunder Born comrades—Sam “Striker,” Cole “Cruiser,” Joseph “Techoman,” and Tanner - Wolff—seeing their unit as a refuge where his dark gifts can serve a purpose. He thrives in the unseen, drawing power from shadows and his keen senses. Off the battlefield, he’s a watcher and a planner, often lurking on the edges or analyzing threats, but his reclusive nature can make him a mystery even to his closest allies.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          James grew up in Zion City’s Telestial sector, in a shadowed corner where survival meant staying unnoticed. Raised among outcasts and observers, he learned to blend into the dark, honing a natural talent for perception and evasion. His life shifted when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, Tanner, Zeke, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, James was touched by the same corrupting force as Sam—Erevos’s influence awakened his shadow powers as he hid from the chaos that claimed Sam’s family. Unlike Sam, James embraced the darkness quietly, using it to protect rather than destroy.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead after Melcornia, James returned to Zion City, fading into its underbelly and refining his abilities. When Sam resurfaced—alive and corrupted—James rejoined him, Cole, Joseph, and Tanner to form the Bludbruhs, bringing his stealth to their fight against Zion City’s threats. His shadow manipulation synced with Sam’s lightning, Cole’s combat, Joseph’s tech, and Tanner’s ferocity, but Sam’s growing darkness mirrored James’s own, creating a silent bond. When the Bludbruhs fractured over Sam’s dark surge, some split for the Monkie Alliance, but James stayed, his loyalty rooted in understanding Sam’s struggle. He embraced the Thunder Born rebranding, seeing it as a chance to channel his shadows into a new, electric purpose alongside his pack.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          James’s innate gifts and shadowy nature grant him a range of powers focused on stealth, mobility, and awareness, reflecting his Shadowmind persona:          </Text>
          <Text style={styles.aboutText}>
          Shadow Manipulation: Controls and shapes shadows, creating tendrils to strike, barriers to shield, or cloaks to obscure, a power born from Melcornia’s dark influence.          </Text>
          <Text style={styles.aboutText}>
          Teleportation: Moves instantly between shadows within a limited range, vanishing and reappearing to flank or escape, a skill honed by his elusive instincts.          </Text>
          <Text style={styles.aboutText}>
          Invisibility: Fades into near-perfect invisibility when shrouded in darkness, making him a ghost in combat or reconnaissance, enhanced by his armor’s design.          </Text>
          <Text style={styles.aboutText}>
          Enhanced Perception: Sees, hears, and senses beyond normal limits, detecting hidden threats or weak points, a trait sharpened by his watchful nature and Melcornia’s lessons.          </Text>
          <Text style={styles.aboutText}>
          Shadow Strike: Infuses his attacks with shadow energy, boosting their impact or disorienting foes, a subtle nod to Thunder Born’s electric theme through dark synergy.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          James is the stealth and perception of the Thunder Born, complementing Sam’s volatility with his subtlety, Cole’s discipline with his evasion, and Tanner’s ferocity with his precision. He’s quiet, perceptive, and deeply loyal to his pack, seeing their unit as a shadow where he thrives. His relationship with Sam is one of silent understanding—he shares Sam’s dark past but tempers it with control—while with Cole, it’s a tactical alliance, syncing stealth with combat. With Joseph, he’s a shadow to tech, using gadgets to enhance his moves, and with Tanner, he’s a kindred hunter, blending shadow with beast.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, James stayed through the Bludbruhs’ rift, choosing loyalty to Sam, Cole, Joseph, and Tanner over the Monkie Alliance split, drawn by their shared Melcornia scars. His shadow powers proved crucial when the Titans faced “Evil Sam,” revealing his survival alongside the team. In Zion City, he connects with the Titans’ stealth experts like William and Ben Briggs, sharing their subtle approach, but his squad focuses on survival over grand heroics. His ultimate goal is to guard Zion City from the shadows with Thunder Born, proving that darkness can serve light, while keeping his pack intact.          </Text>
          <Text style={styles.aboutText}>
          James stood with Sam during the Bludbruhs’ dissolution, rejecting the Monkie Alliance split over Sam’s dark powers. He embraced the Thunder Born name as a fusion of his shadow roots and their electric renewal, shedding the “Bludbruhs” blood-taint for a title that reflects his subtle synergy with Sam’s lightning, Cole’s charges, Joseph’s tech, and Tanner’s howl, reinforcing their pack’s resilience.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#050308", // deep shadow violet
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR — purple / indigo glass
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(8, 4, 18, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(178, 102, 255, 0.7)",
    shadowColor: "#b266ff",
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
    borderColor: "rgba(200, 160, 255, 0.95)",
    backgroundColor: "rgba(18, 8, 38, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#f0e8ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(12, 6, 28, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#d1bfff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#f5eeff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(190, 130, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 255, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(18, 8, 38, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.9)",
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
    color: "#f5eeff",
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
    backgroundColor: "rgba(18, 8, 38, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#f0e8ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(10, 4, 28, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.8)",
    shadowColor: "#b266ff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f5eeff",
    textAlign: "center",
    textShadowColor: "#b266ff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#d1bfff",
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
    backgroundColor: "rgba(10, 4, 26, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.45)",
    shadowColor: "#b266ff",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f5eeff",
    textAlign: "center",
    textShadowColor: "#b266ff",
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
    backgroundColor: "rgba(190, 130, 255, 0.9)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // ARMOR CARD
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    marginRight: 18,
    backgroundColor: "rgba(6, 2, 18, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.9)",
    shadowColor: "#b266ff",
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
    color: "#f5eeff",
    fontWeight: "600",
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

  // ABOUT (kept in case you re-enable)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(10, 4, 26, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(190, 130, 255, 0.9)",
    shadowColor: "#b266ff",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f5eeff",
    textAlign: "center",
    textShadowColor: "#b266ff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#e9ddff",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default JameBb;
