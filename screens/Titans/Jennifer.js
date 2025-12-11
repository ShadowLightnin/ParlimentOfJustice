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

// 🎧 Jennifer / Kintsugi music array
const TRACKS = [
  {
    id: "kintsugi_main",
    label: "Kintsugi Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "kintsugi_soft",
    label: "Kintsugi – Soft Reflection",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const armors = [
  {
    name: "Kintsugi Prime",
    image: require("../../assets/Armor/JenniferLegacy.jpg"),
    clickable: true,
  },
  {
    name: "Kintsugi",
    image: require("../../assets/Armor/Jennifer2.jpg"),
    clickable: true,
  },
  {
    name: "Kintsugi",
    image: require("../../assets/Armor/Jennifer.jpg"),
    clickable: true,
  },
  {
    name: "Kintsugi",
    image: require("../../assets/Armor/Jennifer3.jpg"),
    clickable: true,
  },
  {
    name: "Kintsugi",
    image: require("../../assets/Armor/Jennifer4.jpg"),
    clickable: true,
  },
];

const kids = [
  {
    name: "Lucas",
    image: require("../../assets/Armor/Lucas2.jpg"),
    clickable: true,
  },
    {
    name: "Ruth",
    image: require("../../assets/Armor/Ruth.jpg"),
    clickable: true,
  },
];

const Jennifer = () => {
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
        console.error("Failed to play Jennifer track", e);
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
      {!armor.clickable && (
        <Text style={styles.disabledText}>Not Clickable</Text>
      )}
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
      {/* 🎧 MUSIC BAR – pink / ocean blue / kintsugi gold, same structure as others */}
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
        {/* HEADER – same glass style pattern as Spencer/Will/Emma */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Kintsugi</Text>
              <Text style={styles.subtitle}>Resilience • Caring • Champion</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kintsugi Armory</Text>
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
          <Text style={styles.sectionTitlePink}>First Gen</Text>
          <View style={styles.sectionDividerPink} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {kids.map(renderKidCard)}
          </ScrollView>
        </View>

        {/* ABOUT SECTION – kept EXACTLY as you wrote it, still commented like the others */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Jennifer McNeil, known as Kintsugi, is the middle child of the McNeil siblings and a vital member of the Titans within the Parliament of Justice, a woman who has been shattered by loss but reborn stronger through her pain. At 5'8", her presence is both delicate and resolute, her cracked yet golden-mended armor a testament to her resilience. Behind her serene demeanor lies a soul that has fallen from grace, much like her brother Spencer, but where he struggles with nostalgia, Jennifer finds strength in acceptance and healing. She’s married to Myran, whose technological prowess complements her own abilities, and she’s deeply devoted to her brothers, Spencer and Jared, as well as her cousins Ben, Azure, Will, and Emma. Jennifer prefers to mend rather than destroy, drawing inspiration from the beauty of imperfection, but her fallen state leaves her questioning her own worth. Off the battlefield, she’s a nurturer, often found tending to her family’s emotional wounds or crafting art that reflects her journey.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Jennifer grew up in the same rugged village as her brothers Spencer and Jared, the middle sibling in a family defined by strength and faith. While Spencer led with power and Jared with speed, Jennifer was the heart of the family, her compassion and creativity setting her apart. She was inspired by stories of redemption and renewal, particularly the idea of Kintsugi—turning brokenness into something beautiful with gold. This philosophy became her lifeline when tragedy struck.
          </Text>
          <Text style={styles.aboutText}>
            During a devastating raid on their village from Zion City’s Outer Darkness sector, Jennifer witnessed the destruction of everything she held dear—homes burned, families scattered, and her brothers pushed to their limits. In the chaos, she discovered her ability to heal, but the trauma left her spiritually and emotionally broken. Her armor, once pristine, cracked under the weight of her grief, but she refused to let it define her. Drawing on her faith and the support of her brothers and cousins, she mended her armor with gold, embracing her flaws as part of her strength.
          </Text>
          <Text style={styles.aboutText}>
            As a Titan, Jennifer stood alongside Spencer and Jared, using her healing to protect their family, including the Briggs (Ben and Azure), Cummings (Will and Emma), and other oldest cousins. But as Zion City’s corruption grew, so did her sense of failure. She felt responsible for not preventing Spencer’s fall or easing Jared’s burden, and her own confidence wavered. Married to Myran, a techno-savvy ally, Jennifer found a partner who helped her see the beauty in her brokenness, but her fallen state—mirrored by Spencer’s—continues to haunt her. Her Kintsugi armor became a symbol of hope, but also a reminder of how far she’s fallen from the healer she once was.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Jennifer’s suit and innate compassion grant her a range of powers focused on healing, protection, and resilience, reflecting her Kintsugi theme:
          </Text>
          <Text style={styles.aboutText}>
            Healing Touch: Can mend physical and emotional wounds, restoring health and morale to allies. Her touch leaves a golden glow, symbolizing renewal, but it drains her when she overextends herself.
          </Text>
          <Text style={styles.aboutText}>
            Golden Resilience: Her cracked, gold-mended armor absorbs damage and redistributes it as protective energy, making her surprisingly durable despite her fragility. The gold seams glow brighter under stress, enhancing her defenses.
          </Text>
          <Text style={styles.aboutText}>
            Empathic Connection: Can sense the pain and needs of others, allowing her to prioritize healing where it’s most needed, but this also makes her vulnerable to their despair.
          </Text>
          <Text style={styles.aboutText}>
            Light Projection: Can emit soft, golden light to soothe allies, dispel darkness (literal and metaphorical), and disorient enemies, drawing from The Imagined’s creative energy.
          </Text>
          <Text style={styles.aboutText}>
            Restorative Aura: Creates a field around herself that accelerates recovery for her family and teammates, but it weakens if her own resolve falters.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Jennifer is the heart of the Titans, a healer and mediator who tries to mend the fractures within her family and team. Like Spencer, she’s fallen from grace, but where he clings to the past, she embraces her brokenness as a source of strength. Her relationship with Spencer is tender but tense—he sees her as a reminder of what he’s lost, while she sees him as a project to heal. With Jared, she’s protective, worried about the pressure he faces as Spencer’s successor, but she also admires his drive.
          </Text>
          <Text style={styles.aboutText}>
            As the middle sibling, Jennifer feels a responsibility to her cousins—Ben and Azure (Briggs), Will and Emma (Cummings)—and the broader family, often acting as their emotional anchor. Her marriage to Myran strengthens her, as he helps her see the beauty in her flaws, but her fallen state leaves her questioning whether she can truly lead or heal as she once did. Her children, Lila and Hope, fuel her resolve, their memory and promise guiding her to protect and nurture her family.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, Jennifer works closely with healers like Angela (Cummings) and Emily (Jensen), drawing on their shared nurturing instincts, while her Kintsugi armor inspires hope in allies like Todd (Cummings) and Mary (McNeil). Her ultimate goal is to restore balance to Zion City and her family, proving that even the most broken can shine with gold, just as her love for Lila and Hope shines eternal.
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
    backgroundColor: "#090812", // deep violet/blue
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR — pink, ocean blue, kintsugi gold
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(15, 20, 40, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(243, 211, 140, 0.7)",
    shadowColor: "#f3d38c",
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
    borderColor: "rgba(255, 160, 190, 0.95)",
    backgroundColor: "rgba(30, 52, 90, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#ffeaf4",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(18, 30, 60, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffb6c1",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#8fd3ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(255, 167, 196, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(24, 40, 72, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(159, 210, 255, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#2b0a18",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#ffe6f4",
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
    backgroundColor: "rgba(20, 24, 44, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#ffeaf4",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(18, 24, 52, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.8)",
    shadowColor: "#f3d38c",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ffeaf4",
    textAlign: "center",
    textShadowColor: "#f3d38c",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffd9f2",
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
    backgroundColor: "rgba(12, 16, 32, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.45)",
    shadowColor: "#f3d38c",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffeaf4",
    textAlign: "center",
    textShadowColor: "#f3d38c",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  sectionTitlePink: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffb6c1",
    textAlign: "center",
    textShadowColor: "#ff8fb8",
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
    backgroundColor: "rgba(243, 211, 140, 0.9)",
  },
  sectionDividerPink: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 160, 190, 0.95)",
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
    backgroundColor: "rgba(4, 10, 22, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.9)",
    shadowColor: "#f3d38c",
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
    color: "#ffeaf4",
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
    color: "#ff8a8a",
    fontWeight: "600",
  },

  // KID CARDS
  kidCard: (isDesktop, w) => ({
    width: isDesktop ? w * 0.16 : SCREEN_WIDTH * 0.46,
    height: isDesktop ? SCREEN_HEIGHT * 0.42 : SCREEN_HEIGHT * 0.38,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "rgba(6, 10, 22, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 160, 190, 0.9)",
    shadowColor: "#ff8fb8",
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
    color: "#ffeaf4",
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
    backgroundColor: "rgba(15, 20, 40, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(243, 211, 140, 0.9)",
    shadowColor: "#f3d38c",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffeaf4",
    textAlign: "center",
    textShadowColor: "#ffb6c1",
            textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#fdf7ff",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Jennifer;
