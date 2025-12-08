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

// 🎧 Emma / Kintsunera music array
const TRACKS = [
  {
    id: "kintsunera_main",
    label: "Kintsunera Theme",
    source: require("../../assets/audio/BlueBloods.mp4"),
  },
  {
    id: "kintsunera_variant",
    label: "Kintsunera – Variant",
    source: require("../../assets/audio/BlueBloods.mp4"),
  },
];

const armors = [
  {
    name: "Kintsunera Prime",
    image: require("../../assets/Armor/EmmaLegacy.jpg"),
    clickable: true,
  },
  {
    name: "Kintsunera",
    image: require("../../assets/Armor/Emma.jpg"),
    clickable: true,
  },
  {
    name: "Kintsunera",
    image: require("../../assets/Armor/Emma2.jpg"),
    clickable: true,
  },
  {
    name: "Symbol",
    image: require("../../assets/Armor/EmmasSymbol.jpg"),
    clickable: true,
  },
];

const Emma = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // dimension handling
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
          { isLooping: true, volume: 0.9 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Emma track", e);
        Alert.alert("Audio Error", "Could not play Emma's theme.");
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
        © {armor.name || "Kintsunera"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const handleBackPress = async () => {
    await unloadSound();
    setIsPlaying(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – flamingo themed */}
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
        {/* HEADER – glass block like Jennifer */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Kintsunera</Text>
              <Text style={styles.subtitle}>
                Angel of Innovation • Flamingo Wing
              </Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION – same structure as Jennifer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kintsunera Armory</Text>
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
          Emma Cummings, known as Kinsunera, is a radiant force of hope and innovation, the younger Cummings sibling and a vital member of the Titans within the Parliament of Justice. Her presence is both inspiring and dynamic, a blend of angelic grace and mechanical precision that sets her apart among her cousins. Behind her vibrant armor, Emma is creative, empathetic, and fiercely protective of her family, especially her brother William. She sees herself as a beacon for the Titans, bringing light to the darkness of Zion City, and her mechanical angel wings symbolize her desire to rise above the chaos. Off the battlefield, she’s a dreamer and a tinkerer, often working with William on new tech or sketching designs that blend beauty with function, but her optimism hides a fear of failing those she loves.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Emma grew up alongside her older brother William in a tech-savvy household on the edge of Zion City’s Terrestrial sector, where innovation and resilience were family traits. While William gravitated toward stealth and strategy, Emma was drawn to flight and flair, inspired by stories of angels and futuristic heroes like The Paradigm. Her childhood was marked by curiosity and creativity, but also by the growing threats from the Telestial and Outer Darkness sectors.          </Text>
          <Text style={styles.aboutText}>
          During a critical moment in their village’s defense, Emma’s mechanical ingenuity shone through when she rigged a set of scavenged parts into makeshift wings, allowing her to evade attackers and scout from above. This moment birthed Kinsunera, and her armor evolved to reflect her vision of hope and protection. Joining the Titans, she stood with William, the McNeil siblings (Spencer, Jared, Jennifer), and the Briggs cousins (Ben, Azure), using her wings and energy to support their missions.          </Text>
          <Text style={styles.aboutText}>
          As one of the oldest cousins, Emma felt the weight of Spencer’s fallen leadership and Jared’s rising ambition, but she also saw an opportunity to bridge their divides. Her Paradigm-inspired armor, with its fading colors and flamingo accents, became a symbol of resilience, but her fear of not living up to her family’s expectations sometimes clouds her confidence. Her connection to the broader family—nurturers like Jennifer, strategists like Todd (Cummings), and healers like Emily (Jensen)—strengthens her, but she worries about the future of Zion City and her role in it.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Emma’s suit and innate creativity grant her a range of powers focused on mobility, support, and inspiration, reflecting her Paradigm inspiration:          </Text>
          <Text style={styles.aboutText}>
          Mechanical Flight: Her mechanical angel wings allow for agile flight, reconnaissance, and rapid repositioning in battle. They can also emit energy pulses to distract or disorient enemies.          </Text>
          <Text style={styles.aboutText}>
          Energy Manipulation: Can project bursts of blue, white, and pink energy, drawing from her armor’s color scheme, to shield allies or damage foes. These bursts are both offensive and defensive, symbolizing her dual role as protector and warrior.          </Text>
          <Text style={styles.aboutText}>
          Empathic Boost: Can inspire and uplift her family and teammates, enhancing their morale and coordination, much like her flamingo accents suggest joy and unity.          </Text>
          <Text style={styles.aboutText}>
          Adaptive Technology: Her armor and wings are equipped with modular tech that can adapt to different situations, such as reinforcing shields or boosting speed, a trait she shares with William but applies with more flair.          </Text>
          <Text style={styles.aboutText}>
          Light Display: Can create dazzling light shows or illusions using her armor’s fading colors, confusing enemies or signaling allies, a nod to The Paradigm’s creative energy.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          Emma is the light and innovation of the Titans, a counterbalance to William’s shadows, Spencer’s power, and Jared’s speed. She’s optimistic, creative, and deeply loyal, but her fear of failure—especially toward her brother and cousins—drives her to push her limits. Her relationship with William is protective and collaborative—he’s her mentor and shield, while she inspires him with her vision. With the McNeil siblings, she admires Jennifer’s healing but worries about Spencer’s fall and Jared’s pressure, often trying to lift their spirits.          </Text>
          <Text style={styles.aboutText}>
          As Emma’s younger sister, she looks up to William but also challenges him to embrace hope over caution. Her cousins—Ben and Azure (Briggs), the McNeil siblings—rely on her for aerial support and morale, while she draws strength from their diversity. In a broader sense, Emma connects with creatives like Ava (McNeil) and strategists like Lee (Jensen), using her wings to scout and her energy to inspire.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, Emma works to bridge the gap between tradition and progress, often mediating between Spencer’s nostalgia and Jared’s modernity. Her ultimate goal is to ensure Zion City’s future is bright, proving that hope and technology can heal even the deepest wounds.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: { flex: 1, backgroundColor: "#12030f" },
  scrollContainer: { paddingBottom: 30 },

  // 🎧 MUSIC BAR – flamingo colors
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(40, 5, 25, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 165, 200, 0.7)",
    shadowColor: "#ff8fb8",
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
    borderColor: "rgba(255, 190, 220, 0.9)",
    backgroundColor: "rgba(70, 10, 40, 0.96)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#ffe6f4",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(50, 5, 30, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 220, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffd2ec",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fff5fb",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(255, 105, 180, 0.96)", // hot pink
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 225, 240, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(90, 10, 50, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 220, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#fff5fb",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#ffe4ef",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER (matching Jennifer structure)
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
    backgroundColor: "rgba(40, 5, 25, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 182, 193, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: "#ffb6c1",
    fontWeight: "bold",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(50, 5, 30, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 210, 0.85)",
    shadowColor: "#ff8fb8",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ff8fb8",
    textAlign: "center",
    textShadowColor: "#ffb6c1",
    textShadowRadius: 20,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffd2ec",
    textAlign: "center",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // SECTION WRAPPER (like Jennifer)
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(25, 5, 18, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 210, 0.7)",
    shadowColor: "#ff8fb8",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffeaf2",
    textAlign: "center",
    textShadowColor: "#ff9abf",
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
    backgroundColor: "rgba(255, 180, 210, 0.9)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },

  // ARMOR CARDS
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 10,
    backgroundColor: "rgba(20, 5, 20, 0.9)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 3,
    borderColor: "#ff8fb8",
    shadowColor: "#ff7f50",
    shadowOpacity: 0.85,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  notClickable: { opacity: 0.7 },
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 12,
    left: 12,
    fontSize: 16,
    color: "#ffeaf2",
    fontWeight: "bold",
    textShadowColor: "#8b004b",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },

  // ABOUT (for when you uncomment)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(35, 5, 22, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 210, 0.7)",
    shadowColor: "#ff8fb8",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffeaf2",
    textAlign: "center",
    textShadowColor: "#ff9abf",
    textShadowRadius: 18,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#ffe2f0",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Emma;
