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

// 🎧 Guardian / James music array
const TRACKS = [
  {
    id: "guardian_main",
    label: "Guardian Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "guardian_alt",
    label: "Heartland Resolve",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const armors = [
  { name: "Guardian", image: require("../../assets/Armor/James.jpg"), clickable: true },
];

const James = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // responsive width
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
        console.error("Failed to play Guardian track", e);
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

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – Ohio navy / scarlet / white */}
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
        {/* HEADER – glassy like the others, with Ohio colors */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Guardian</Text>
              <Text style={styles.subtitle}>Heartland • Shield • Calm</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Armory</Text>
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
          James Connell, known as Gentle Guardian, is a beacon of calm and compassion, the husband of Azure Briggs “Midigator” and a vital member of The Eclipse within the Parliament of Justice. His presence is soothing yet resolute, a blend of empathy and protection that makes him a stabilizing force for his wife and her family. Behind his flexible armor, James is patient, understanding, and fiercely devoted to Azure, seeing her drive for order as a strength he complements with his own gentleness. He extends this care to the Titans—Spencer, Jared, Jennifer, William, Emma, and Ben—and their partners in The Eclipse, using his abilities to heal and shield them. Off the battlefield, he’s a mediator and a listener, often resolving disputes or comforting his family, but his deep empathy can sometimes leave him vulnerable to their pain.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          James grew up in Zion City’s Terrestrial sector, in a family known for their peacekeeping and community-building efforts. From a young age, he was drawn to helping others, inspired by stories of healers and guardians who brought peace to chaos. His natural empathy and ability to sense emotions set him apart, but it was his encounter with Azure Briggs that defined his purpose.          </Text>
          <Text style={styles.aboutText}>
          James met Azure during a tense standoff in the Telestial sector, where her strategic order clashed with a mob’s rage. Stepping in, James used his calming presence to diffuse the situation, revealing his latent healing and shielding powers. Azure’s disciplined strength captivated him, and he crafted his Gentle Guardian suit to support her, using his empathy to balance her rigidity. Their marriage became a partnership of structure and softness, with James’s compassion grounding Azure’s justice.          </Text>
          <Text style={styles.aboutText}>
          Joining The Eclipse, James aligned with the significant others of the Titans—Myran (Jennifer’s husband), Kelsie (Jared’s wife), and Aileen (William’s girlfriend)—to bolster their mission. He felt the strain of Spencer’s fallen leadership and Azure’s burden to maintain order, but saw an opportunity to heal their wounds and unite them. His connection to the broader Parliament of Justice—healers like Jennifer and strategists like William—strengthens him, but he struggles with the violence of Zion City’s lower sectors, relying on his shields and aura to protect his loved ones.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          James’s suit and innate empathy grant him a range of powers focused on healing, protection, and support, reflecting his guardian role:          </Text>
          <Text style={styles.aboutText}>
          Empathetic Aura: Projects a calming field that soothes allies, reduces stress, and restores emotional balance, making him a morale booster in tense situations.          </Text>
          <Text style={styles.aboutText}>
          Healing Touch: Can heal physical injuries and emotional wounds with a gentle touch, channeling energy through his hands to mend his family and teammates, though it takes focus and drains him over time.          </Text>
          <Text style={styles.aboutText}>
          Protective Shield: Generates energy barriers to shield himself and others from harm, drawing on his suit’s design to create flexible, mobile defenses that adapt to threats.          </Text>
          <Text style={styles.aboutText}>
          Telepathic Connection: Can communicate mentally with teammates, sharing thoughts, emotions, or strategies silently, enhancing coordination with Azure and the Titans.          </Text>
          <Text style={styles.aboutText}>
          Conflict Resolution: Uses his empathy and aura to ease tensions and settle disputes, diffusing conflicts within the team or with enemies, a skill honed by his peacemaking nature.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          James is the calm and support of The Eclipse, complementing Azure’s order with his healing and protective abilities. He’s patient, compassionate, and deeply in love with Azure, seeing her justice as a foundation he softens with his empathy. His relationship with Azure is one of mutual balance—he shields her rigidity, while she gives him purpose and direction.          </Text>
          <Text style={styles.aboutText}>
          Among The Eclipse, James collaborates with Myran’s tech, Kelsie’s agility, and Aileen’s strength, forming a cohesive support unit for the Titans. He respects Spencer’s strength but shares Azure’s focus on stability, often using his telepathy to ease tensions within the group. His cousins-in-law—Jennifer, Jared, William, Emma, and Ben—rely on his shields and healing, while he draws strength from their resilience.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, James connects with healers like Jennifer and mediators like Angela (Cummings), using his aura to support their efforts. His ultimate goal is to bring peace to Zion City alongside Azure, proving that compassion and order can heal a fractured world, while ensuring his wife and her family thrive.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#050814", // deep navy / night blue
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR — Ohio navy / scarlet / white
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(10, 16, 34, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 16, 46, 0.8)", // scarlet
    shadowColor: "#c8102e",
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
    borderColor: "rgba(200, 16, 46, 0.95)",
    backgroundColor: "rgba(16, 28, 62, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#f5f7ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(8, 18, 44, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffb3c2",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e3f0ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(200, 16, 46, 0.96)", // scarlet
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(14, 24, 52, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(160, 180, 210, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#fff4f4",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#f0f4ff",
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
    backgroundColor: "rgba(12, 20, 46, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(200, 16, 46, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#f5f7ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(10, 20, 52, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#c8102e",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f5f7ff",
    textAlign: "center",
    textShadowColor: "#c8102e",
    textShadowRadius: 22,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffb3c2",
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
    backgroundColor: "rgba(8, 14, 34, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(200, 16, 46, 0.55)",
    shadowColor: "#c8102e",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f5f7ff",
    textAlign: "center",
    textShadowColor: "#c8102e",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // CARD
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(4, 10, 22, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(200, 16, 46, 0.9)",
    shadowColor: "#c8102e",
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
    color: "#f5f7ff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
  },
  disabledText: {
    position: "absolute",
    top: 10,
    right: 12,
    fontSize: 10,
    color: "#ff8a8a",
    fontWeight: "600",
  },

  // ABOUT (still matches pattern if/when you uncomment)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(10, 16, 36, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#c8102e",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f5f7ff",
    textAlign: "center",
    textShadowColor: "#c8102e",
    textShadowRadius: 18,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#e4e8f5",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default James;
