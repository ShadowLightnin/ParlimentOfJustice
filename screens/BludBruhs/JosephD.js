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

// 🎧 Joseph / Technoman music array (same structure as Cole/Tanner/James)
const TRACKS = [
  {
    id: "technoman_main",
    label: "Technoman Theme",
    // If you later add a dedicated file, swap this path
    source: require("../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "technoman_alt",
    label: "Thunder Tech Loop",
    source: require("../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  {
    name: "Technoman",
    image: require("../../assets/Armor/JosephD.jpg"),
    clickable: true,
  },
];

const JoesphD = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // dimensions
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
        console.error("Failed to play Technoman track", e);
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

  // stop sound when leaving screen (same as others)
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
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – same structure as Cole/Tanner/James */}
      {/* <View style={styles.musicControls}>
        <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(-1)}>
          <Text style={styles.trackButtonText}>⟵</Text>
        </TouchableOpacity>

        <View style={styles.trackInfoGlass}>
          <Text style={styles.trackLabel}>Track:</Text>
          <Text style={styles.trackTitle}>{currentTrack.label}</Text>
        </View>

        <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(1)}>
          <Text style={styles.trackButtonText}>⟶</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.musicButton, isPlaying && styles.musicButtonDisabled]}
          onPress={playTheme}
          disabled={isPlaying}
        >
          <Text style={styles.musicButtonText}>{isPlaying ? "Playing" : "Play"}</Text>
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
        {/* HEADER – glassy like the others */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Technoman</Text>
              <Text style={styles.subtitle}>\\[Redacted]\\</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION – same section wrapper as the others */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technoman Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Joseph Dresher, known as Techoman, is a visionary and ingenious mind, the technological backbone of the Thunder Born, reborn from the fractured Bludbruhs within Zion City’s chaotic tapestry. His presence is sharp and resourceful, a fusion of scientific brilliance and practical innovation that makes him indispensable to his team. Behind his sleek, Star Citizen-inspired armor, Joseph is meticulous, curious, and steadfastly loyal to his comrades—Sam “Striker,” Cole “Cruiser,” James “Shadowmind,” and Tanner - Wolff—seeing their combined strengths as a canvas for his inventions. He thrives on crafting solutions, from weapons to gadgets, drawing inspiration from his vast knowledge and sci-fi passions. Off the battlefield, he’s a tinkerer and a theorist, often lost in his workshop or debating strategies, but his focus on tech can sometimes distance him from the group’s emotional struggles.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Joseph grew up in Zion City’s Terrestrial sector, in a family of scholars and engineers who prized intellect and discovery. As a young prodigy, he devoured knowledge across fields—physics, chemistry, robotics—and found a creative outlet in Star Citizen, where he admired the game’s futuristic tech and exploration ethos. His early years were spent building gadgets, but his life shifted when he joined Sam, Will (later “Night Hawk”), Cole, James, Tanner, Zeke, Elijah, Tom, and others on a pre-Parliament adventure to the planet Melcornia.          </Text>
          <Text style={styles.aboutText}>
          In Melcornia’s dark mansion, Joseph witnessed Sam’s corruption by Erevos and the death of Sam’s family, an event that sharpened his resolve to protect his friends with his mind. While Sam fell to darkness, Joseph focused on survival, using scavenged tech to aid their escape. Believing Sam dead, he returned to Zion City, honing his skills as a scientist. When Sam resurfaced—alive and wielding corrupted powers—Joseph reunited with him, Cole, James, and Tanner to form the Bludbruhs, a faction to combat Zion City’s threats. His advanced tech bolstered their efforts, but Sam’s growing reliance on dark powers strained the group.          </Text>
          <Text style={styles.aboutText}>
          When the Bludbruhs fractured over Sam’s dark surge, some split off (though not Tanner, who stayed), and Joseph remained loyal, trusting in Sam’s potential for redemption. He embraced the Thunder Born rebranding, seeing it as a chance to redefine their purpose with innovation and strength, aligning his tech with their new electric identity.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Joseph’s armor and scientific expertise grant him a range of powers focused on technology, versatility, and support, reflecting his Star Citizen inspiration:          </Text>
          <Text style={styles.aboutText}>
          Tech Creation: Designs and deploys advanced gadgets and weapons—drones, turrets, energy blades—crafted on the fly or pre-built, drawing on his broad scientific knowledge.          </Text>
          <Text style={styles.aboutText}>
          Weapon Mastery: Wields his creations with precision, from plasma rifles to explosive traps, a skill honed by Star Citizen’s combat mechanics and real-world tinkering.          </Text>
          <Text style={styles.aboutText}>
          Energy Hacking: Manipulates and redirects energy sources, disabling enemy tech or boosting allies’ gear, a nod to his Thunder Born synergy with Sam’s electricity.          </Text>
          <Text style={styles.aboutText}>
          Analytical Insight: Processes data and predicts outcomes with near-superhuman speed, offering strategic solutions in battle, a trait born from his scientific mind.          </Text>
          <Text style={styles.aboutText}>
          Tech Support: Enhances his team’s abilities with buffs or repairs—boosting Cole’s charges, Sam’s lightning, or Tanner’s armor—reflecting his role as their innovator.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Joseph is the brains and versatility of the Thunder Born, supporting Sam’s leadership with his tech and Cole’s combat with his gadgets. He’s precise, inventive, and deeply loyal to his squad, seeing their unit as a perfect testing ground for his creations. His relationship with Sam is one of cautious trust—he values Sam’s strength but monitors his darkness—while with Cole, it’s a practical alliance, syncing tech with combat. With James “Shadowmind,” he shares a synergy of stealth and innovation, and with Tanner - Wolff, he admires the primal edge, enhancing Tanner’s armor with upgrades.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, Joseph stayed through the Bludbruhs’ end, rejecting the Monkie Alliance split (unlike some who left), believing in Sam’s redemption and the group’s potential. His Melcornia past ties him to their origins, and his tech proved vital when the Titans faced “Evil Sam.” In Zion City, he connects with the Titans’ innovators like William and Myran, sharing their tech passion, but his squad focuses on precision over grand heroics. His ultimate goal is to innovate Zion City’s future with Thunder Born, proving that science and loyalty can overcome chaos, while keeping his team cutting-edge.          </Text>
          <Text style={styles.aboutText}>
          Joseph backed Sam during the Bludbruhs’ dissolution, seeing the Thunder Born name as a fresh start after the rift over Sam’s dark powers. While some left for the Monkie Alliance, Joseph, Cole, James, and Tanner stayed, embracing a new identity tied to strength and energy—Thunder Born reflecting their collective resilience and his own tech synergy with Sam’s lightning, shedding the “Bludbruhs” stain of blood and corruption.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE (kept consistent with the glassy Thunder Born screens)
  container: {
    flex: 1,
    backgroundColor: "#05060a",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR — same layout as Cole
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(6, 10, 24, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 179, 255, 0.7)",
    shadowColor: "#00b3ff",
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
    borderColor: "rgba(130, 190, 255, 0.95)",
    backgroundColor: "rgba(10, 20, 40, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e5f3ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(8, 16, 32, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#94d4ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e5f3ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 179, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(220, 245, 255, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(12, 20, 40, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(140, 170, 210, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#02121a",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#eaf4ff",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER — same glass header as Cole
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
    backgroundColor: "rgba(10, 18, 36, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e5f3ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(8, 16, 40, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.8)",
    shadowColor: "#00b3ff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e5f3ff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#94d4ff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // SECTION — same wrapper as Cole
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(6, 12, 26, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.45)",
    shadowColor: "#00b3ff",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5f3ff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
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
    backgroundColor: "rgba(0, 179, 255, 0.9)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // ARMOR CARDS — same as Cole
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(4, 10, 22, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.9)",
    shadowColor: "#00b3ff",
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
    backgroundColor: "rgba(0, 0, 0, 0.25)",
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
    color: "#e5f3ff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },

  // ABOUT (kept for later)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(6, 12, 26, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.9)",
    shadowColor: "#00b3ff",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e5f3ff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#dde8ff",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default JoesphD;
