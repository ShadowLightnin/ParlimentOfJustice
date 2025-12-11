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

// 🎧 Cole / Cruiser music array
const TRACKS = [
  {
    id: "cruiser_main",
    label: "Cruiser Theme",
    source: require("../../assets/audio/cole.m4a"),
  },
  {
    id: "cruiser_alt",
    label: "Thunder Squad Loop",
    source: require("../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  {
    name: "Cruiser",
    image: require("../../assets/Armor/ColeR.jpg"),
    clickable: true,
  },
  {
    name: "Bruiser",
    image: require("../../assets/Armor/ColeR2.jpg"),
    clickable: true,
  },
  {
    name: "Pruiser",
    image: require("../../assets/Armor/ColeR3.jpg"),
    clickable: true,
  },
];

const Cole = () => {
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
        console.error("Failed to play Cruiser track", e);
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

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – marine blue / steel / glassy like the others */}
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
        {/* HEADER – glassy like Kintsugi/Myran/James */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Cruiser</Text>
              <Text style={styles.subtitle}>Friend • Kind • Courageous</Text>
            </View>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cruiser Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* ABOUT SECTION – your existing lore stays commented like the others */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Cole Robinson, known as Cruiser, is a battle-hardened and steadfast warrior, a core member of the Thunder Born, reborn from the fractured Bludbruhs within Zion City’s volatile landscape. His presence is disciplined and reassuring, a mix of marine grit and unshakable resolve that makes him a rock for his team. Behind his futuristic tactical armor, Cole is pragmatic, loyal, and deeply committed to his girlfriend Kinnley (also called Harmony), whose presence keeps him grounded amidst chaos. He once stood alongside Sam “Striker,” Joseph “Techoman,” James “Shadowmind,” and Tanner - Wolff in the Bludbruhs, but now anchors the Thunder Born with a focus on survival and duty. Off the battlefield, he’s a protector and a planner, often training or strategizing with his squad, but his rigid loyalty can sometimes blind him to Sam’s darker struggles.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Cole grew up in Zion City’s Terrestrial sector, raised in a family with a proud military tradition. As a young man, he trained as a marine, excelling in combat and survival skills, inspired by the high-stakes action of Call of Duty and real-world tales of valor. His life took a sharp turn when he joined Sam, Will (later “Night Hawk”), Joseph, James, Tanner, Zeke, Elijah, Tom, and others on an ill-fated adventure to the planet Melcornia, before the Parliament of Justice or Titans existed. In that dark mansion, Cole witnessed Sam’s family die and his descent into Erevos’s corruption, a trauma that bonded the group even as it sowed seeds of division.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead after Melcornia, Cole returned to Zion City hardened, focusing on protecting his home. He met Kinnley/Harmony, a calming influence who became his anchor, and their relationship gave him purpose. Years later, when Sam resurfaced—alive and wielding dark powers—Cole reunited with him to form the Bludbruhs, a faction aimed at fighting Zion City’s threats. Alongside Joseph, James, and Tanner, Cole brought his combat expertise to bear, but Sam’s growing reliance on his corrupted abilities strained their brotherhood. When Sam’s dark surge fractured the group, Tanner and others left for the Monkie Alliance, rejecting the shadow. Cole stayed, loyal to Sam’s potential for good, and embraced the Thunder Born rebranding—a name reflecting their renewed focus on strength and resilience, free of the Bludbruhs’ tainted past.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Cole’s armor and marine training grant him a range of powers focused on combat, endurance, and support, reflecting his Call of Duty-inspired tactical edge:          </Text>
          <Text style={styles.aboutText}>
          Combat Mastery: Excels in hand-to-hand and firearms combat, wielding weapons with precision and adapting to any fight, a skill honed by years as a marine and gaming instincts.          </Text>
          <Text style={styles.aboutText}>
          Tactical Resilience: Endures harsh conditions and prolonged battles, shrugging off injuries with a marine’s toughness, making him a frontline anchor for his team.          </Text>
          <Text style={styles.aboutText}>
          Shock Charge: Deploys short-range electrical bursts from his armor, stunning enemies or disrupting tech, a nod to his Thunder Born identity and synergy with Sam’s lightning.          </Text>
          <Text style={styles.aboutText}>
          Battlefield Awareness: Reads combat situations with heightened perception, spotting threats and coordinating allies, a trait drawn from his military roots and Call of Duty gameplay.          </Text>
          <Text style={styles.aboutText}>
          Protective Instinct: Boosts nearby allies’ morale and defense when shielding them, reflecting his loyalty to Kinnley/Harmony and his squad, a natural extension of his guardian role.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Cole is the steel and stability of the Thunder Born, grounding Sam’s volatility with his combat prowess and loyalty. He’s stoic, dependable, and deeply tied to Kinnley/Harmony, whose harmony balances his warrior edge. His relationship with Sam is one of brotherhood tempered by caution—he trusts Sam’s intent but fears his dark powers, a tension that survived the Bludbruhs’ end.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, Cole stood by Sam during the rift that sent Tanner, and possibly others, to the Monkie Alliance, choosing loyalty over ideology. With Joseph “Techoman,” he shares a practical bond, syncing his combat with Joseph’s tech, and with James “Shadowmind,” he aligns on stealth tactics. His Melcornia past ties him to the group’s origins, and his clash with the Titans (when they face “Evil Sam”) reveals his resolve to protect Sam’s redemption.          </Text>
          <Text style={styles.aboutText}>
          In Zion City, Cole connects with the Titans’ fighters like Jared and Ben Briggs, sharing their combat focus, but his Thunder Born squad prioritizes survival over grand heroics. His ultimate goal is to safeguard Zion City and Kinnley/Harmony, proving that grit and teamwork can weather any storm, while keeping Sam on the path to good.          </Text>
          <Text style={styles.aboutText}>
          Cole stayed with Sam when the Bludbruhs dissolved, rejecting the Monkie Alliance’s split over Sam’s dark powers. The rebranding to Thunder Born came after Sam’s rift—Cole saw it as a chance to shed the blood-soaked “Bludbruhs” name, tied to Sam’s corrupted Melcornia past, and embrace a new identity of strength and renewal, reflecting their shared resilience and electrical synergy.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#05060a", // deep navy / cruiser night
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR — electric blue / steel glass
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

  // GENERIC SECTION
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

  // ARMOR CARDS
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

  // ABOUT (kept in case you re-enable)
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

export default Cole;
