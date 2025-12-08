import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🎧 Azure / Mediateir music array (swap files later if you want)
const TRACKS = [
  {
    id: "mediateir_main",
    label: "Mediateir Theme",
    source: require("../../assets/audio/BlueBloods.mp4"), // change later if you want
  },
  {
    id: "mediateir_variant",
    label: "Mediateir – Variant",
    source: require("../../assets/audio/BlueBloods.mp4"),
  },
];

const armors = [
  {
    name: "Mediateir",
    copyright: "William Cummings",
    image: require("../../assets/Armor/Azure3.jpg"),
    clickable: true,
  },
  {
    name: "Legacy",
    copyright: "William Cummings",
    image: require("../../assets/Armor/AzureLegacy.jpg"),
    clickable: true,
  },
  {
    name: "Mediateir",
    copyright: "William Cummings",
    image: require("../../assets/Armor/Azure.jpg"),
    clickable: true,
  },
  {
    name: "Midigator",
    copyright: "William Cummings",
    image: require("../../assets/Armor/Azure2.jpg"),
    clickable: true,
  },
  {
    name: "",
    image: require("../../assets/Armor/AzuresSymbol.jpg"),
    clickable: true,
  },
];

const Azure = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // dimension handling
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
          { isLooping: true, volume: 0.9 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Azure track", e);
        Alert.alert("Audio Error", "Could not play Mediateir's theme.");
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
      <View style={styles.transparentOverlay} />
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
      {/* 🎧 MUSIC BAR – azure / aqua / silver */}
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
        {/* HEADER – glass block like the others, Azure palette */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Mediateir</Text>
              <Text style={styles.subtitle}>
                Shield of Order • Arbiter of Zion
              </Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION – same structure as the others */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mediateir Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* About block preserved exactly as you had it (still commented) */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Azure Briggs, known as Midigator, is a pillar of order and protection, the oldest Briggs sibling and a crucial member of the Titans within the Parliament of Justice. Her presence is commanding yet calming, a blend of strategic precision and unwavering justice that marks her as a guardian of balance. Behind her sleek, Order-inspired armor, Azure is disciplined, empathetic, and fiercely loyal to her brother Ben, her husband James, and her cousins among the Titans (Spencer, Jared, Jennifer, William, and Emma). She sees herself as the enforcer of harmony in Zion City, drawing strength from her family’s values and her role as a mediator. Off the battlefield, she’s a planner and a peacemaker, often mediating disputes among her cousins or reinforcing their defenses, but her drive for order sometimes makes her inflexible.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Azure grew up in a structured household on the edge of Zion City’s Terrestrial sector, alongside her younger brother Ben, in a family that prized order, strength, and justice. The Briggs clan was known for their tactical minds and protective instincts, and Azure inherited a knack for strategy and defense from her parents. While Ben leaned toward agility and combat, Azure was inspired by tales of knights and lawkeepers, as well as The Order from Fortnite, whose authority and structure resonated with her.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors began to fracture, Azure’s village faced threats from the chaotic Telestial and Outer Darkness sectors. During a pivotal defense, she discovered her ability to organize and protect, rallying her family and neighbors to hold the line. This moment birthed Midigator, and her armor evolved to reflect her role as a guardian, drawing on The Order’s design to symbolize justice and stability. Joining the Titans, she stood with Ben, the McNeil siblings (Spencer, Jared, Jennifer), and the Cummings siblings (William, Emma), using her strategy to safeguard their mission.          </Text>
          <Text style={styles.aboutText}>
          As one of the oldest cousins, Azure felt the strain of Spencer’s fallen leadership and Jared’s rising ambition, but she also saw an opportunity to restore balance. Her Order-inspired armor became a symbol of stability, but her fear of losing control—especially over her brother Ben and the Titans—sometimes clouds her judgment. Married to James, a gentle and supportive partner, Azure finds strength in his empathy, but her role as a Titan pushes her to maintain order at all costs. Her connection to the broader family—leaders like Todd (Cummings), strategists like Lee (Jensen), and healers like Jennifer (McNeil)—grounds her, but she struggles with the chaos of modern Zion City.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Azure’s suit and innate leadership grant her a range of powers focused on defense, strategy, and support, reflecting her Order inspiration:          </Text>
          <Text style={styles.aboutText}>
          Strategic Command: Can analyze battlefields and coordinate her family and teammates with precision, boosting their effectiveness and morale. Her tactical mind allows her to anticipate threats and devise plans on the fly.          </Text>
          <Text style={styles.aboutText}>
          Protective Barriers: Her armor can generate energy shields, inspired by The Order’s defensive capabilities, to shield allies from harm or create safe zones during combat.          </Text>
          <Text style={styles.aboutText}>
          Enhanced Durability: The suit is reinforced with a lightweight alloy that absorbs impacts and disperses energy, making Azure a resilient frontline defender.          </Text>
          <Text style={styles.aboutText}>
          Justice Aura: Can project an aura of authority and calm, dispelling fear and confusion among allies, drawing on her crusader-like honor to rally her family.          </Text>
          <Text style={styles.aboutText}>
          Orderly Strike: Can deliver precise, powerful attacks that disrupt enemy formations, using her armor’s design to maintain control over chaotic situations.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Azure is the order and defense of the Titans, a counterbalance to Ben’s agility, Spencer’s power, and William’s stealth. She’s disciplined, just, and deeply loyal, but her rigidity can sometimes clash with the more flexible approaches of her cousins. Her relationship with Ben is protective and collaborative—he’s her shield, and she provides the structure he needs to focus his impulsiveness. With the McNeil siblings, she respects Spencer’s strength but worries about his fall, admires Jared’s drive, and trusts Jennifer’s healing. With William and Emma (Cummings), she shares a strategic bond, often coordinating with William’s tech and Emma’s flight.          </Text>
          <Text style={styles.aboutText}>
          As the oldest Briggs sibling, Azure looks up to Ben but also challenges him to balance justice with compassion, drawing strength from his agility while offering her own stability. Her cousins—Spencer, Jared, Jennifer, William, and Emma—rely on her for strategic guidance and protection, while she draws inspiration from their diverse strengths. Married to James, she finds a partner who softens her rigidity with his empathy, and their bond helps her see the value of flexibility.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, Azure works closely with leaders like Todd (Cummings) and defenders like Samantha (Jensen), using her order to stabilize the group. Her ultimate goal is to restore harmony to Zion City, proving that justice and structure can protect their future, while ensuring her brother and cousins thrive. She sees herself as a cornerstone for the Titans, but her fear of chaos—especially in her family—drives her to push her limits.          </Text>

        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#040b12", // deep navy with a hint of teal
  },
  scrollContainer: {
    paddingBottom: 24,
  },

  // 🎧 MUSIC BAR – azure / aqua / silver
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(5, 18, 30, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(130, 200, 255, 0.75)",
    shadowColor: "#4fc3f7",
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
    borderColor: "rgba(120, 210, 255, 0.9)", // aqua border
    backgroundColor: "rgba(8, 30, 50, 0.96)", // deep aqua glass
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e5f6ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(6, 22, 36, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(160, 215, 255, 0.85)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#b3e5ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#f2f9ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 172, 237, 0.96)", // bright azure
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(200, 235, 255, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(4, 35, 56, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(150, 210, 245, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#e8f5ff",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#e3f2fd",
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
    backgroundColor: "rgba(4, 26, 44, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(150, 210, 245, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: "#b3e5ff",
    fontWeight: "bold",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(4, 20, 34, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(160, 220, 255, 0.85)",
    shadowColor: "#4fc3f7",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4fc3f7", // azure blue
    textAlign: "center",
    textShadowColor: "#b3e5ff",
    textShadowRadius: 20,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#cfd8dc", // silver/grey
    textAlign: "center",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // SECTION WRAPPER
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(3, 17, 28, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(150, 210, 245, 0.8)",
    shadowColor: "#4fc3f7",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e3f2fd",
    textAlign: "center",
    textShadowColor: "#81d4fa",
    textShadowRadius: 18,
    letterSpacing: 0.8,
  },
  sectionDivider: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(130, 200, 255, 0.95)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },

  // ARMOR CARDS
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 10,
    backgroundColor: "rgba(2, 12, 20, 0.9)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 3,
    borderColor: "#4fc3f7", // azure
    shadowColor: "#00bcd4", // aqua
    shadowOpacity: 0.85,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  notClickable: {
    opacity: 0.7,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "#e3f2fd",
    fontWeight: "bold",
    textShadowColor: "#000814",
    textShadowRadius: 6,
  },
  disabledText: {
    fontSize: 12,
    color: "#ff8a8a",
    position: "absolute",
    bottom: 30,
    left: 10,
  },

  // ABOUT (for when you uncomment)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(3, 20, 32, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(150, 210, 245, 0.8)",
    shadowColor: "#4fc3f7",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e3f2fd",
    textAlign: "center",
    textShadowColor: "#81d4fa",
    textShadowRadius: 18,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#cfd8dc",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Azure;
