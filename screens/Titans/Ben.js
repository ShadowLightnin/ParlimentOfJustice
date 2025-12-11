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

// 🎧 Ben / Nuscis music array (swap files later if you want)
const TRACKS = [
  {
    id: "nuscis_main",
    label: "Nuscis Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "nuscis_variant",
    label: "Nuscis – Variant",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const Ben = () => {
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
    { name: "Nuscis", copyright: "William Cummings", image: require("../../assets/Armor/Ben4.jpg"), clickable: true },
    { name: "Nuscis", copyright: "William Cummings", image: require("../../assets/Armor/Ben5.jpg"), clickable: true },
    { name: "Legacy", copyright: "William Cummings", image: require("../../assets/Armor/BenLegacy.jpg"), clickable: true },
    { name: "Nuscis", copyright: "William Cummings", image: require("../../assets/Armor/Ben3.jpg"), clickable: true },
    { name: "Nuscus", copyright: "William Cummings", image: require("../../assets/Armor/Ben.jpg"), clickable: true },
    { name: "Nuscus", copyright: "William Cummings", image: require("../../assets/Armor/Ben2.jpg"), clickable: true },
    { name: "", image: require("../../assets/Armor/BensSymbol.jpg"), clickable: true },
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
      key={`${armor.name}-${armor.copyright || index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        armor.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() =>
        armor.clickable && console.log(`${armor.name || "Unnamed"} clicked`)
      }
      disabled={!armor.clickable}
      activeOpacity={0.9}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        {armor.copyright
          ? `© ${armor.name || "Unknown"}; ${armor.copyright}`
          : armor.name}
      </Text>
      {!armor.clickable && (
        <Text style={styles.disabledText}>Not Clickable</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR */}
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
              <Text style={styles.title}>Nuscis</Text>
              <Text style={styles.subtitle}>Calm • Humor • Patient</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuscis Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/*  🔽 About section kept exactly as you had it (still commented out) */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Ben Briggs, known as Nuscis, is a swift and resolute guardian, the second oldest Briggs sibling and a key member of the Titans within the Parliament of Justice. His presence is both agile and commanding, a blend of metallic precision and crusader honor that marks him as a protector of his family and city. Behind his sleek, metallic armor, Ben is strategic, loyal, and fiercely protective of his sister Azure, his cousins among the Titans (Spencer, Jared, Jennifer, William, and Emma), and the broader Briggs and extended family. He sees himself as a shield against Zion City’s chaos, drawing strength from his crusader heritage and his bond with his family. Off the battlefield, he’s a planner and a mentor, often training with his cousins or reinforcing their defenses, but his drive to uphold justice sometimes makes him rigid.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ben grew up in a disciplined household on the edge of Zion City’s Terrestrial sector, alongside his oldest sister Azure, in a family that valued order, strength, and tradition. The Briggs clan was known for their resilience and tactical minds, and Ben inherited a knack for agility and defense from his parents. While Azure leaned toward structure and harmony, Ben was inspired by tales of knights and crusaders, as well as the acrobatic heroism of Spider-Man, whose agility and web-slinging mirrored his own potential.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors began to fracture, Ben’s village faced threats from the lawless Telestial and Outer Darkness sectors. During a critical ambush, he discovered his ability to move with spider-like agility, using scavenged metal to craft his first suit. This moment birthed Nuscis, and his armor evolved to reflect his role as a defender, replacing Spider-Man’s symbol with a crusader emblem to honor his family’s values of justice and protection. Joining the Titans, he stood with the McNeil siblings (Spencer, Jared, Jennifer), the Cummings siblings (William, Emma), and his sister Azure, using his speed and strength to safeguard their mission.          </Text>
          <Text style={styles.aboutText}>
          As one of the oldest cousins, Ben felt the weight of Spencer’s fallen leadership and Jared’s rising ambition, but he also saw an opportunity to stabilize the group. His crusader-inspired armor became a symbol of hope, but his fear of failing his family—especially Azure and the Titans—sometimes clouds his judgment. His connection to the broader family—leaders like Todd (Cummings), strategists like Lee (Jensen), and healers like Jennifer (McNeil)—strengthens him, but he struggles with the balance between tradition and progress in a changing world.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ben’s suit and innate agility grant him a range of powers focused on mobility, defense, and combat, reflecting his Spider-Man and crusader inspirations:          </Text>
          <Text style={styles.aboutText}>
          Enhanced Agility: Can leap, swing, and maneuver with spider-like grace, scaling walls, dodging attacks, and striking from unexpected angles. His movements are fluid and precise, making him a difficult target.          </Text>
          <Text style={styles.aboutText}>
          Metallic Durability: His armor, made of a lightweight yet tough alloy, absorbs impacts and deflects energy, protecting him and his allies. The crusader symbol on his chest can emit a brief protective field for nearby teammates.          </Text>
          <Text style={styles.aboutText}>
          Web-Like Grappling: Can deploy retractable metallic cables from his suit, mimicking Spider-Man’s webbing, to swing, restrain enemies, or create barriers, drawing on his agility for tactical advantage.          </Text>
          <Text style={styles.aboutText}>
          Combat Prowess: Trained in close-quarters combat, Ben uses his agility to deliver rapid, precise strikes, enhanced by the armor’s metallic edges for added impact.          </Text>
          <Text style={styles.aboutText}>
          Crusader’s Resolve: A mental fortitude that boosts his endurance and morale, allowing him to inspire his family and resist psychological attacks, rooted in his honor-bound nature.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Ben is the agility and defense of the Titans, a counterbalance to Spencer’s power, Jared’s speed, and William’s stealth. He’s disciplined, honorable, and deeply loyal, but his rigidity can sometimes clash with the more adaptive approaches of his cousins. His relationship with Azure is protective and collaborative—she’s his anchor, and he relies on her order to balance his impulsiveness. With the McNeil siblings, he respects Spencer’s strength but worries about his fall, admires Jared’s drive, and trusts Jennifer’s healing. With William and Emma (Cummings), he shares a tactical bond, often coordinating with William’s tech and Emma’s flight.          </Text>
          <Text style={styles.aboutText}>
          As the second oldest Briggs sibling, Ben mentors Azure but also learns from her harmony, pushing her to refine her skills while drawing strength from her stability. His cousins—Spencer, Jared, Jennifer, William, and Emma—rely on his defensive capabilities, while he draws inspiration from their diverse strengths. In the broader Parliament of Justice, Ben works closely with strategists like Todd (Cummings) and combatants like Samantha (Jensen), using his agility to protect the family’s flanks.          </Text>
          <Text style={styles.aboutText}>
          His ultimate goal is to uphold justice in Zion City, proving that tradition and agility can safeguard their future, while ensuring his sister and cousins thrive. He sees himself as a shield for the Titans, but his fear of failure—especially toward Azure and the family—drives him to push his limits.          </Text>

        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#020608",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(3, 12, 18, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120, 230, 210, 0.4)",
    shadowColor: "#4af7c8",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(140, 255, 230, 0.9)",
    backgroundColor: "rgba(4, 30, 26, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e4fff9",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(3, 22, 24, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(140, 255, 230, 0.7)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#b9fff1",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#f5fffc",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(8, 86, 78, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(120, 255, 230, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(4, 20, 22, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(180, 255, 238, 0.8)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#eafffb",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#d6fff7",
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
    backgroundColor: "rgba(3, 26, 26, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(170, 255, 230, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e8fff9",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(4, 22, 28, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(120, 255, 230, 0.7)",
    shadowColor: "#4af7c8",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f5fffd",
    textAlign: "center",
    textShadowColor: "#4af7c8",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#bdfcf0",
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
    backgroundColor: "rgba(2, 18, 20, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(120, 255, 230, 0.45)",
    shadowColor: "#4af7c8",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e9fffb",
    textAlign: "center",
    textShadowColor: "#66ffe0",
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
    backgroundColor: "rgba(140, 255, 230, 0.9)",
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
    backgroundColor: "rgba(0, 10, 12, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(120, 255, 230, 0.9)",
    shadowColor: "#4af7c8",
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
    color: "#e9fffb",
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
    color: "#7ad0c1",
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
    backgroundColor: "rgba(2, 20, 22, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(120, 255, 230, 0.6)",
    shadowColor: "#4af7c8",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e9fffb",
    textAlign: "center",
    textShadowColor: "#66ffe0",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#dafff7",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Ben;
