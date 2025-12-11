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

// 🎧 Swiftmind tracks (update sources to your real files)
const TRACKS = [
  {
    id: "swiftmind_main",
    label: "Swiftmind Theme",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 update path/name
  },
  {
    id: "swiftmind_alt",
    label: "Monkie Tactician Loop",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 can reuse or swap
  },
];

const armors = [
  {
    name: "Swiftmind",
    image: require("../../../assets/Armor/AlexM2.jpg"),
    clickable: true,
  },
  {
    name: "Swiftmind",
    image: require("../../../assets/Armor/AlexM.jpg"),
    clickable: true,
  },
];

const AlexM = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // 🎶 audio state
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
        console.error("Failed to play Swiftmind track", e);
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

  // Stop audio when leaving screen
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
      {/* 🎧 MUSIC BAR – Swiftmind: speed + teal/blue glass */}
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
        {/* HEADER – glassy logic-bar */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Swiftmind</Text>
              <Text style={styles.subtitle}>Speed • Strategy • Precision</Text>
            </View>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH * 0.7 + 20}
            decelerationRate="fast"
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Alex M, known as Swiftmind, is a brilliant and lightning-quick strategist, a vital intellect in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s unpredictable chaos. His presence is sharp and dynamic, a blend of superhuman speed and razor-sharp wit that makes him a mastermind on the battlefield. Behind his yet-to-be-detailed armor, Alex is analytical, empathetic, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Tom “Thunder Whisperer,” Ethan “Bolt Watcher,” Eli “Shadow Hunter,” Damon “Pixel Maverick,” and Elijah “Chaos Wither”—seeing their agility as a puzzle he can solve and enhance. He processes and reacts with unmatched precision, a whirlwind of mind and motion. Off the battlefield, he’s a thinker and a planner, often mapping strategies or observing his team, but his rapid pace can sometimes leave others struggling to keep up.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Alex M grew up in Zion City’s Terrestrial sector, in a family of scholars and athletes who prized intellect and agility. From a young age, he excelled in both mind and body, a prodigy whose speed and smarts shone when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, Eli, Damon, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Alex’s quick reflexes and heightened senses saved the group from traps as Sam fell to Erevos’s corruption, his photographic memory locking in every detail of their escape. The ordeal supercharged his abilities, blending speed with super intelligence.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Alex returned to Zion City, honing his gifts in quiet study and training. When Sam resurfaced—corrupted and alive—Alex joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his strategic mind to guide their fight. His speed synced with Sam’s lightning and Zeke’s teleportation, but Sam’s dark surge clashed with Alex’s clarity. When the Bludbruhs split, Alex sided with Zeke, rejecting Sam’s shadow for a path of agility and intellect, forming The Monkie Alliance with Ammon, Tom, Ethan, Eli, Damon, and Elijah. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—erupted into a Civil War-style feud, later mended through Parliament ties, but Alex remains cautious of Thunder Born’s raw power, trusting his own swift precision.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Alex’s innate talents and agile nature grant him a range of powers focused on speed, intellect, and coordination, reflecting his Swiftmind persona:
          </Text>
          <Text style={styles.aboutText}>
          Enhanced Speed: Moves and thinks at superhuman velocity, outpacing foes or allies, a skill born from Melcornia’s chaos and refined with control.
          </Text>
          <Text style={styles.aboutText}>
          Super Intelligence: Processes complex data and strategies instantly, solving problems or predicting outcomes, making him the team’s brain trust.
          </Text>
          <Text style={styles.aboutText}>
          Photographic Memory: Recalls every detail with perfect clarity, from maps to enemy moves, a power that anchors his planning and precision.
          </Text>
          <Text style={styles.aboutText}>
          Quick Reflexes: Reacts with split-second accuracy, dodging or striking with finesse, tying his speed to his senses.
          </Text>
          <Text style={styles.aboutText}>
          Empathy: Reads emotions and intentions, boosting team morale or outsmarting foes, a subtle strength that complements Ammon’s charm.
          </Text>
          <Text style={styles.aboutText}>
          Strategic Thinker: Crafts plans with uncanny foresight, enhancing Zeke’s leadership or countering threats, a trait honed by his intellect.
          </Text>
          <Text style={styles.aboutText}>
          Heightened Senses: Perceives subtle cues—sight, sound, motion—spotting dangers or opportunities, syncing with Eli’s tracking.
          </Text>
          <Text style={styles.aboutText}>
          Precise Control: Executes actions with pinpoint accuracy, from strikes to maneuvers, reflecting his Monkie agility and mental mastery.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Alex is the speed and strategy of The Monkie Alliance, complementing Zeke’s precision with his intellect and Ethan’s lightning with his pace. He’s sharp, compassionate, and deeply loyal to his team, seeing them as a system he optimizes. His relationship with Zeke is one of mutual respect—he refines Zeke’s plans with foresight—while with Ammon, he pairs empathy with strategy, and with Damon “Pixel Maverick,” he balances chaos with order.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Alex followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a smarter, swifter one. His strategies countered Thunder Born in their Civil War-style feud, and when the Parliament intervened, he supported Ammon’s stance, sharing a cautious view of Thunder Born and the Titans after Will’s neutrality stirred doubts. His Melcornia past forged his powers, and his role sharpens the team against their rivals. In Zion City, he connects with the Titans’ thinkers like Jared and William, sharing their mental edge, but his team prioritizes independence. His ultimate goal is to outthink Zion City’s threats with Monkie Alliance, proving speed and intellect can triumph, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Alex sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and wit. His swift plans outmaneuvered Thunder Born in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s raw energy but committed to Zeke’s vision, keeping tensions alive yet calculated.
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
    backgroundColor: "#05060a",
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  // 🎧 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(3, 8, 20, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 210, 255, 0.9)",
    shadowColor: "#00f0ff",
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
    borderColor: "rgba(0, 210, 255, 0.95)",
    backgroundColor: "rgba(8, 16, 34, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e7f8ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(6, 14, 30, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(0, 210, 255, 0.85)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#7fdcff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e7f8ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 255, 170, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(180, 255, 230, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(8, 16, 34, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 210, 255, 0.85)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#001c11",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#e7f8ff",
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
    backgroundColor: "rgba(8, 16, 34, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 210, 255, 0.8)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e7f8ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(5, 10, 26, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 210, 255, 0.85)",
    shadowColor: "#00e0ff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e7f8ff",
    textAlign: "center",
    textShadowColor: "#00e0ff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#7fdcff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // IMAGE STRIP
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },

  // CARDS
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 210, 255, 0.85)",
    shadowColor: "#00e0ff",
    shadowOpacity: 0.7,
    shadowRadius: 18,
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
    color: "white",
    fontWeight: "bold",
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

  // ABOUT (for later, still matches your original)
  aboutSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 15,
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00b3ff",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default AlexM;
