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

// 🎧 Enderstrike / Monkie Alliance tracks
// 🔧 Update the require() paths to your real audio files for Zeke
const TRACKS = [
  {
    id: "enderstrike_main",
    label: "Enderstrike Theme",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "enderstrike_alt",
    label: "Monkie Alliance Loop",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  { name: "Enderstrike", image: require("../../../assets/Armor/Zeke.jpg"), clickable: true },
];

const Zeke = () => {
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
        console.error("Failed to play Enderstrike track", e);
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

  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={armor.name}
      style={[
        styles.card(isDesktop, windowWidth),
        armor.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
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
      {/* 🎧 MUSIC BAR – Ender / purple void + Monkie energy */}
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
        {/* HEADER – glassy like the others */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerGlass}>
              <Text style={styles.title}>Enderstrike</Text>
              <Text style={styles.subtitle}>Blink • Rift • Alliance</Text>
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
          Zeke Workman, known as Enderstrike, is a cunning and resolute leader, the driving force behind The Monkie Alliance, a faction born from the ashes of the Bludbruhs’ schism in Zion City’s fractured world. His presence is sharp and unpredictable, a mix of strategic brilliance and otherworldly power that makes him a formidable commander. Behind his yet-to-be-detailed armor, Zeke is determined, principled, and fiercely loyal to his Monkie Alliance team—Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing them as a brotherhood forged in defiance of Sam’s dark path. He wields Ender-inspired abilities with precision, a legacy of his Melcornia past. Off the battlefield, he’s a tactician and a mediator, often rallying his team or brooding over past rifts, but his rivalry with Sam “Striker” keeps tensions simmering beneath his cool exterior.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Zeke grew up in Zion City’s Terrestrial sector, raised in a family that valued resilience and ingenuity. As a young man, he was drawn to strategy and survival, traits that shone when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Zeke encountered an Ender-like entity—a shadowy, teleporting force—that imbued him with strange powers as Sam fell to Erevos’s corruption. Witnessing Sam’s family die and his descent into darkness, Zeke vowed to protect the group, using his newfound abilities to escape.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Zeke returned to Zion City, honing his Ender powers in isolation. When Sam resurfaced—alive and corrupted—Zeke joined the Bludbruhs with Cole, Joseph, James, and Tanner, hoping to guide Sam back to light. But Sam’s reliance on dark powers clashed with Zeke’s principles, igniting a rift akin to Captain America: Civil War. Sam’s dark surge fractured the Bludbruhs, and Zeke led a splinter group—himself, Ammon, Alex, Eli, Tom, Damon, Elijah, and Ethan—to form The Monkie Alliance, rejecting Sam’s shadow for a path of agility and defiance (the “Monkie” name a playful jab at their nimble, rebellious spirit). Cole, Joseph, James, and Tanner stayed with Sam, birthing Thunder Born, and a bitter rivalry ensued.          </Text>
          <Text style={styles.aboutText}>
          Over time, Zeke and Sam mended their rift through uneasy truces with the Parliament of Justice, but trust remains shaky. Zeke’s Monkie Alliance stands as a counterpoint to Thunder Born, their Civil War-style feud simmering beneath a fragile alliance, with Zeke ever-watchful of Sam’s darkness.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Zeke’s armor and Ender-inspired powers grant him a range of abilities focused on mobility, deception, and leadership, reflecting his Monkie Alliance role:          </Text>
          <Text style={styles.aboutText}>
          Ender Teleportation: Teleports short distances in a blink, leaving a faint purple shimmer, ideal for evasion or surprise attacks, a skill born from Melcornia’s entity.          </Text>
          <Text style={styles.aboutText}>
          Ender Mimicry: Mimics traits of foes or allies temporarily (e.g., speed, strength), adapting to threats, a tactical edge honed by his strategic mind.          </Text>
          <Text style={styles.aboutText}>
          Ender Summoning: Calls forth shadowy, Ender-like duplicates to distract or fight, controllable minions that echo his leadership over Monkie Alliance.          </Text>
          <Text style={styles.aboutText}>
          Ender Blast: Unleashes a concentrated burst of dark energy, damaging foes or disrupting tech, a powerful strike tying his powers to his past.          </Text>
          <Text style={styles.aboutText}>
          Alliance Command: Boosts his team’s coordination and morale with a leader’s aura, reflecting his role as Monkie Alliance’s captain and his defiance of Sam.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Zeke is the agility and vision of The Monkie Alliance, countering Sam’s volatility with his precision and leadership. He’s calculating, resolute, and deeply loyal to his team, seeing them as a family he’ll protect at all costs. His rivalry with Sam is intense but layered—once brothers-in-arms, now wary allies, their Civil War-style feud mended but shaky. With Ammon “Quick Wit,” he shares a bond of charm and strategy; with Alex “Swiftmind,” a synergy of speed and intellect; and with Eli, Tom, Damon, Elijah, and Ethan, a leader’s trust in their diverse strengths.          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Zeke led the split from the Bludbruhs over Sam’s dark powers, forming a faction that values agility and defiance over shadow. His Melcornia past forged his resolve, and his clash with Thunder Born (when Titans face “Evil Sam”) tests his leadership. In Zion City, he connects with the Titans’ tacticians like Jared and William, sharing their strategic bent, but his team prioritizes independence over grand unity. His ultimate goal is to lead Monkie Alliance to secure Zion City’s future, proving that agility and principle can outshine darkness, while keeping his shaky truce with Sam intact.          </Text>
          <Text style={styles.aboutText}>
          Zeke’s rift with Sam split the Bludbruhs when Sam’s dark surge—rooted in Erevos’s corruption—clashed with Zeke’s rejection of shadow. Leading Ammon, Alex, Eli, Tom, Damon, Elijah, and Ethan away, Zeke formed The Monkie Alliance as a defiant stand against Sam’s path, while Sam, Cole, Joseph, James, and Tanner became Thunder Born. Their Captain America: Civil War-style rivalry erupted in skirmishes, only mending through Parliament mediation, but tensions linger, with Zeke ever-vigilant of Sam’s potential relapse.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#050308", // deep void purple-black
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  // 🎧 MUSIC BAR – void purple + neon accents
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(6, 3, 12, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(145, 90, 255, 0.8)",
    shadowColor: "#8e5bff",
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
    borderColor: "rgba(210, 180, 255, 0.95)",
    backgroundColor: "rgba(20, 10, 38, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#f7f0ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(16, 8, 34, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(190, 150, 255, 0.9)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#d7c3ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#f7f0ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(190, 150, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 255, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(24, 10, 40, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(190, 150, 255, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#1b102a",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#f7f0ff",
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
    backgroundColor: "rgba(18, 10, 34, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(190, 150, 255, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#f7f0ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(10, 6, 26, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(190, 150, 255, 0.85)",
    shadowColor: "#8e5bff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f7f0ff",
    textAlign: "center",
    textShadowColor: "#8e5bff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#d7c3ff",
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

  // CARD
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    backgroundColor: "rgba(6, 4, 16, 0.96)",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(190, 150, 255, 0.9)",
    shadowColor: "#8e5bff",
    shadowOpacity: 0.75,
    shadowRadius: 20,
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

  // ABOUT (for when you uncomment later)
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

export default Zeke;
