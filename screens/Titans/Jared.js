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

// 🔥 Spector / Jared tracks (swap sources later if you want)
const TRACKS = [
  {
    id: "spector_main",
    label: "Spector Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "spector_variant",
    label: "Spector – Variant",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const Jared = () => {
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
    {
      name: "Spector",
      copyright: "William Cummings",
      image: require("../../assets/Armor/Jared3.jpg"),
      clickable: true,
    },
    {
      name: "Legacy",
      copyright: "William Cummings",
      image: require("../../assets/Armor/JaredLegacy.jpg"),
      clickable: true,
    },
    {
      name: "Spector",
      copyright: "William Cummings",
      image: require("../../assets/Armor/Jared2.jpg"),
      clickable: true,
    },
    {
      name: "Spector",
      copyright: "William Cummings",
      image: require("../../assets/Armor/Jared.jpg"),
      clickable: true,
    },
    {
      name: "Proto",
      copyright: "William Cummings",
      image: require("../../assets/Armor/JaredProto.jpg"),
      clickable: true,
    },
    {
      name: "",
      image: require("../../assets/Armor/JaredsSymbol.jpg"),
      clickable: true,
    },
  ];

  const kids = [
    {
      name: "Gracie",
      image: require("../../assets/Armor/Gracie.jpg"),
      clickable: true,
    },
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
        console.error("Failed to play Spector track", e);
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

  const renderKidCard = (kid, index) => (
    <TouchableOpacity
      key={kid.name || `kid-${index}`}
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
      <Text style={styles.kidCardName}>© {kid.name || "Unknown"}</Text>
      {!kid.clickable && <Text style={styles.kidDisabledText}> </Text>}
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
              <Text style={styles.title}>Spector</Text>
              <Text style={styles.subtitle}>
                Courage • Heart • Honesty
              </Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spector Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* CHILDREN SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleGold}>Children</Text>
          <View style={styles.sectionDividerGold} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {kids.map(renderKidCard)}
          </ScrollView>
        </View>

        {/* About section kept EXACTLY as you wrote it, still commented out */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Jared McNeil, known as Spector, is a whirlwind of energy and determination, the second oldest McNeil sibling and a key member of the Titans within the Parliament of Justice. With a lean, athletic build, Jared is the embodiment of speed and precision, a stark contrast to his older brother Spencer’s raw power and nostalgia. Behind his sleek, Red Hood-inspired helmet, Jared is sharp-witted, confident, and fiercely loyal to his family, especially his siblings Spencer and Jennifer, and his cousins Ben, Azure, Will, and Emma. While he respects Spencer’s leadership, he feels the weight of his brother’s fall and sees himself as the one to carry their legacy forward. Jared is married to Kelsie, and their partnership fuels his drive to protect Zion City and prove he can lead when the time comes. Off the battlefield, he’s a strategist and a motivator, always pushing his family to adapt to the modern world while honoring their roots.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Jared grew up in the shadow of his older brother Spencer, in the same remote village on Zion City’s Terrestrial sector edge. As the second oldest McNeil sibling, he was always the quicker, more agile counterpart to Spencer’s brute strength and Jennifer’s compassion. While Spencer taught him the value of honor and tradition, Jared was fascinated by the heroes of modern myth—figures like Batman and Captain America, whose speed, strategy, and shields inspired his own path.
          </Text>
          <Text style={styles.aboutText}>
            When the sectors of Zion City began to crumble, Jared’s super speed emerged during a desperate escape from raiders, allowing him to outrun danger and save his younger sister Jennifer. This moment cemented his role as a protector, but also highlighted his differences from Spencer, whose methods were more rooted in destruction than evasion. As the Titans formed, Jared became Spencer’s right hand, using his speed to scout, strike, and coordinate, but he always felt the pressure of living up to his brother’s legacy.
          </Text>
          <Text style={styles.aboutText}>
            The turning point came when Spencer’s confidence waned, and Jared began to see himself as a potential successor. Their bond, while strong, is now strained by this unspoken rivalry—Spencer sees Jared’s modernity as a threat to tradition, while Jared believes progress is the only way to save Zion City. Married to Kelsie, who shares his vision of a balanced future, Jared draws strength from her support and their shared goal of protecting their family and city. His armor, a fusion of Arkham Knight stealth and Captain America heroism, reflects his dual nature: a guardian who moves faster than anyone can react.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Jared’s suit and innate agility grant him the following powers, tailored to his role as a swift leader and protector:
          </Text>
          <Text style={styles.aboutText}>
            Super Speed: Can move, react, and think at incredible velocities, allowing him to outpace any threat, deliver rapid strikes, and cover vast distances in seconds. His speed is both a weapon and a shield, letting him evade attacks and protect his family.
          </Text>
          <Text style={styles.aboutText}>
            Enhanced Reflexes: His mind and body are perfectly synchronized for high-speed combat, enabling him to dodge, parry, and counter with surgical precision.
          </Text>
          <Text style={styles.aboutText}>
            Tactical Acumen: Years of working alongside Spencer and the Titans have honed his ability to analyze battlefields and devise strategies on the fly, making him a natural leader in chaotic situations.
          </Text>
          <Text style={styles.aboutText}>
            Shield Mastery: His Captain America-like shield is not just defensive—it can be thrown with pinpoint accuracy at high speeds, ricochet off multiple targets, and return to his hand, thanks to his speed-enhanced control.
          </Text>
          <Text style={styles.aboutText}>
            Energy Burst (Via Armor): The armor’s crusader visor can emit short-range energy pulses, disorienting enemies and creating openings for his attacks.
          </Text>
          <Text style={styles.aboutText}>
            Inspirational Presence: His ability to uplift his siblings and cousins, especially Jared, whom he mentors as his successor, remains his greatest asset.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Jared is the speed and strategy of the Titans, a counterbalance to Spencer’s power and Jennifer’s healing. He’s confident, sometimes to a fault, but his loyalty to his family is unshakable. As Spencer’s brother, he feels a mix of admiration and frustration—admiring his brother’s strength but frustrated by his refusal to adapt. Jared sees himself as the bridge between tradition and progress, a role he believes will make him the next leader of the Titans.
          </Text>
          <Text style={styles.aboutText}>
            His relationship with Spencer is complex: he respects his brother’s past leadership but believes he’s lost his way, a belief that both motivates and burdens him. With Jennifer, he shares a protective bond, often shielding her with her speed during battles. His cousins—Ben and Azure (Briggs), Will and Emma (Cummings)—look to him for tactical guidance, while he draws inspiration from their unique strengths. Married to Kelsie, Jared finds a partner who shares his vision, and her influence pushes him to balance his ambition with compassion.
          </Text>
          <Text style={styles.aboutText}>
            In the broader Parliament of Justice, Jared works closely with the extended family—coordinating with Todd (Cummings) on leadership, sparring with Samantha (Jensen) for strength training, and strategizing with Lee (Jensen) on marksmanship. His ultimate goal is to prove he can lead the Titans and Zion City into a new era, honoring Spencer’s legacy while forging his own path.
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
    backgroundColor: "#080203",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🔥 MUSIC BAR (red / orange)
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(25, 4, 0, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 120, 70, 0.5)",
    shadowColor: "#ff6b3d",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 170, 120, 0.9)",
    backgroundColor: "rgba(40, 8, 0, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#ffe9dd",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(40, 8, 2, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 100, 0.9)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffd3b3",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fff1e3",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(160, 40, 0, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 90, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(40, 10, 4, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 210, 150, 0.85)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#fff4eb",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#ffe3cf",
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
    backgroundColor: "rgba(45, 10, 4, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#ffe9dd",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(35, 6, 2, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 150, 90, 0.9)",
    shadowColor: "#ff6b3d",
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff4ec",
    textAlign: "center",
    textShadowColor: "#ff6b3d",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffd4b0",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // SECTION SHELL
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(24, 4, 2, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 135, 80, 0.6)",
    shadowColor: "#ff6b3d",
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff3e9",
    textAlign: "center",
    textShadowColor: "#ff8a3b",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  sectionTitleGold: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffe2ab",
    textAlign: "center",
    textShadowColor: "#ffb347",
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
    backgroundColor: "rgba(255, 120, 70, 0.9)",
  },
  sectionDividerGold: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 195, 110, 0.95)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // ARMOR CARDS
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(8, 3, 1, 0.98)",
    borderWidth: 1,
    borderColor: "rgba(255, 130, 70, 0.95)",
    shadowColor: "#ff6b3d",
    shadowOpacity: 0.75,
    shadowRadius: 22,
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
    color: "#fff3e8",
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
    color: "#ffb08a",
    fontWeight: "600",
  },

  // KIDS
  kidsContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  kidCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.15 : SCREEN_WIDTH * 0.45,
    height: isDesktop ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.35,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "rgba(12, 4, 2, 0.98)",
    borderWidth: 1,
    borderColor: "rgba(255, 190, 120, 0.95)",
    shadowColor: "#ffb347",
    shadowOpacity: 0.65,
    shadowRadius: 20,
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
    color: "#fff2de",
    fontWeight: "600",
    textShadowColor: "#000",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  kidDisabledText: {
    fontSize: 10,
    color: "#ffb08a",
    position: "absolute",
    bottom: 15,
    left: 5,
  },

  // ABOUT (for when you decide to turn it on)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(24, 6, 2, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 145, 80, 0.7)",
    shadowColor: "#ff6b3d",
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff2e6",
    textAlign: "center",
    textShadowColor: "#ff8a3b",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#ffe1cd",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Jared;
