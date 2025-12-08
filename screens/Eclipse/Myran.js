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

// 🎧 Techno Guard / Cyber music array
const TRACKS = [
  {
    id: "techno_guard_main",
    label: "Techno Guard Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "techno_guard_alt",
    label: "Cyber Sentinel Loop",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const armors = [
  { name: "Techno Guard", image: require("../../assets/Armor/Myran.jpg"), clickable: true },
];

const kids = [
  { name: "Lucas", image: require("../../assets/Armor/Lucas2.jpg"), clickable: true },
];

const Myran = () => {
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
        console.error("Failed to play Techno Guard track", e);
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
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const renderKidCard = (kid, index) => (
    <TouchableOpacity
      key={`${kid.name}-${index}`}
      style={[
        styles.kidCard(isDesktop, windowWidth),
        kid.clickable ? styles.clickableKid : styles.notClickable,
      ]}
      onPress={() => kid.clickable && console.log(`${kid.name} clicked`)}
      disabled={!kid.clickable}
      activeOpacity={0.9}
    >
      <Image source={kid.image} style={styles.kidImage} />
      <View style={styles.kidOverlay} />
      <Text style={styles.kidCardName}>
        © {kid.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – cyber teal / matrix green / glass */}
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
        {/* HEADER – glassy cyber card like the others */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Techno Guard</Text>
              <Text style={styles.subtitle}>Firewalls • Shields • Code</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cyber Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* KIDS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleGreen}>First Born</Text>
          <View style={styles.sectionDividerGreen} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {kids.map(renderKidCard)}
          </ScrollView>
        </View>

        {/* ABOUT SECTION – your lore stays commented like the others */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Myran Webb, known as Techno Guard, is a brilliant innovator and steadfast protector, the husband of Jennifer McNeil “Kintsugi” and a vital member of The Eclipse, the Titans’ significant others within the Parliament of Justice. His presence is both cerebral and commanding, a fusion of technological mastery and unshakable loyalty that makes him a cornerstone for his wife and her family. Behind his high-tech armor, Myran is analytical, supportive, and deeply committed to Jennifer, seeing her brokenness as a strength he amplifies with his own ingenuity. He extends this devotion to the Titans—Spencer, Jared, William, Emma, Ben, and Azure—and their partners, using his gadgets and intellect to safeguard their mission. Off the battlefield, he’s a thinker and a tinkerer, often found upgrading his tech or strategizing with Jennifer, but his reliance on technology sometimes blinds him to simpler solutions.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Myran grew up in Zion City’s Terrestrial sector, in a family of engineers and inventors who thrived on the edge of the Celestial sector’s advancements. From a young age, he was fascinated by technology’s potential to solve problems, inspired by futuristic heroes and the promise of a better world. His natural talent for data analysis and gadgetry set him apart, but it was his encounter with Jennifer McNeil that shaped his path.
          </Text>
          <Text style={styles.aboutText}>
            Myran met Jennifer during a chaotic raid from the Outer Darkness sector, where her healing saved his life after he was injured defending civilians. Her Kintsugi armor—cracked yet mended with gold—captivated him, and he saw in her a beauty born from resilience. As they grew closer, Myran developed his Techno Guard armor to complement her abilities, using his techno-telekinesis to protect her and her family. Their marriage became a partnership of heart and mind, with Myran’s tech enhancing Jennifer’s healing and her compassion grounding his intellect.
          </Text>
          <Text style={styles.aboutText}>
            Joining The Eclipse, Myran aligned with the significant others of the Titans—Kelsie (Jared’s wife), James (Azure’s husband), and Aileen (William’s girlfriend)—to support their mission. He felt the weight of Jennifer’s fallen state and Spencer’s lost leadership, but saw an opportunity to bolster the Titans with his innovations. His connection to the broader Parliament of Justice—strategists like William and defenders like Ben—strengthens him, but he struggles with the chaos of Zion City’s lower sectors, relying on his tech to impose order.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Myran’s suit and technological prowess grant him a range of powers focused on control, defense, and support, reflecting his role as a sentinel:
          </Text>
          <Text style={styles.aboutText}>
            Techno-Telekinesis: Can manipulate technology with his mind, controlling gadgets, drones, and machinery within a limited range. This allows him to disarm enemies, redirect projectiles, or enhance allies’ equipment on the fly.
          </Text>
          <Text style={styles.aboutText}>
            Data Analysis: Processes information at superhuman speed, interpreting battlefield data, enemy patterns, and ally statuses to formulate strategies instantly, making him a tactical linchpin.
          </Text>
          <Text style={styles.aboutText}>
            Techno-Shielding: Generates energy shields from his armor, powered by nanotech, to protect himself and others. These shields can be shaped or expanded, often used to guard Jennifer during her healing.
          </Text>
          <Text style={styles.aboutText}>
            Holographic Projections: Creates realistic illusions or decoys to distract enemies or deceive them, drawing on his HUD to craft visuals that support the Titans’ plans.
          </Text>
          <Text style={styles.aboutText}>
            Energy Emission: Projects energy blasts from his gauntlets or emitters, used for offense or propulsion, balancing his defensive focus with combat utility.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Myran is the intellect and tech support of The Eclipse, complementing Jennifer’s healing with his defensive and strategic abilities. He’s methodical, supportive, and deeply in love with Jennifer, seeing her Kintsugi nature as a perfect match for his own precision. His relationship with Jennifer is one of mutual reliance—he bolsters her resilience with tech, while she softens his analytical edge with empathy. His children, Lila and Hope, inspire his creations, their memory and promise driving him to safeguard his family’s future.
          </Text>
          <Text style={styles.aboutText}>
            Among The Eclipse, Myran collaborates with Kelsie’s agility, James’s calm, and Aileen’s strength, forming a cohesive support unit for the Titans. He respects Spencer’s power but shares Jared’s view on progress, often working with William (Night Hawk) on tech upgrades. His cousins-in-law—Ben, Azure, Emma—rely on his shields and holograms, while he draws inspiration from their diversity.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, Myran bridges the Titans and their allies, coordinating with tech-savvy members like William and strategists like Todd (Cummings). His ultimate goal is to protect Zion City’s future alongside Jennifer, proving that technology and heart can mend a fractured world, while ensuring his wife and their children’s legacy—Lila’s memory and Hope’s promise—shine eternal.
          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#020509", // deep cyber navy
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR — cyber teal / green glass
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(4, 12, 28, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 180, 0.7)",
    shadowColor: "#00ffbf",
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
    borderColor: "rgba(0, 255, 220, 0.95)",
    backgroundColor: "rgba(10, 24, 48, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e3fbff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(6, 20, 40, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 190, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#7de8ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e3fbff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 255, 190, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 230, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(8, 22, 46, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(140, 220, 255, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#00201a",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#e3fbff",
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
    backgroundColor: "rgba(8, 20, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 180, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e3fbff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(10, 24, 52, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 200, 0.8)",
    shadowColor: "#00ffbf",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e3fbff",
    textAlign: "center",
    textShadowColor: "#00ffbf",
    textShadowRadius: 22,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#7de8ff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // GENERIC SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(4, 12, 30, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 180, 0.45)",
    shadowColor: "#00ffbf",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e3fbff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
    textShadowRadius: 16,
    letterSpacing: 0.8,
  },
  sectionTitleGreen: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00ffbf",
    textAlign: "center",
    textShadowColor: "#00e676",
    textShadowRadius: 16,
    letterSpacing: 0.8,
  },
  sectionDivider: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(0, 255, 200, 0.9)",
  },
  sectionDividerGreen: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(0, 255, 128, 0.95)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // ARMOR CARDS
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(3, 10, 22, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 200, 0.9)",
    shadowColor: "#00ffbf",
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
    color: "#e3fbff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
  },

  // KID CARDS
  kidCard: (isDesktop, w) => ({
    width: isDesktop ? w * 0.16 : SCREEN_WIDTH * 0.46,
    height: isDesktop ? SCREEN_HEIGHT * 0.42 : SCREEN_HEIGHT * 0.38,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "rgba(3, 10, 22, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 180, 0.9)",
    shadowColor: "#00e676",
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  }),
  kidImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  kidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  clickableKid: {},
  kidCardName: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    fontSize: 11,
    color: "#e3fbff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
  },

  // ABOUT
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(4, 12, 30, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 200, 0.9)",
    shadowColor: "#00ffbf",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e3fbff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
    textShadowRadius: 18,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#dcecff",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Myran;
