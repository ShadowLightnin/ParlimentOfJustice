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

// 🎧 Pixel Maverick tracks (swap to your real files)
const TRACKS = [
  {
    id: "pixel_main",
    label: "Pixel Maverick Theme",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 update path/name
  },
  {
    id: "pixel_glitch",
    label: "Glitchstream Loop",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 can reuse or change
  },
];

const armors = [
  {
    name: "Pixel Maverick",
    image: require("../../../assets/Armor/Damon2.jpg"),
    clickable: true,
  },
  {
    name: "Pixel Maverick",
    image: require("../../../assets/Armor/Damon_cleanup.jpg"),
    clickable: true,
  },
];

const Damon = () => {
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
        console.error("Failed to play Pixel Maverick track", e);
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
      {/* 🎧 MUSIC BAR – Pixel Maverick: glitch / neon vibe */}
      {/* <View style={styles.musicControls}>
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
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER – glass panel with tag line */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Pixel Maverick</Text>
              <Text style={styles.subtitle}>Chaos • Memes • Glitch</Text>
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
          Damon, known as Pixel Maverick, is a mischievous and unpredictable disruptor, a vibrant glitch in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s chaotic digital sprawl. His presence is erratic and infectious, a mix of playful chaos and memetic flair that makes him a wild card for his team. Behind his shifting, digital-themed armor, Damon is witty, irreverent, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing their agility as a canvas for his randomness. He wields humor and confusion like weapons, turning battles into a game. Off the battlefield, he’s a jokester and a tinkerer, often crafting memes or tweaking his suit, but his chaotic antics can sometimes test his team’s patience.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Damon grew up in Zion City’s Telestial sector, in a tech-savvy family obsessed with digital culture and humor. From a young age, he was drawn to memes and randomness, a passion that took root when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, Eli, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Damon’s exposure to a glitchy, chaotic energy—sparked by Sam’s corruption by Erevos—awoke his memetic powers, letting him twist reality with humor and disorder as the group fought to survive.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Damon returned to Zion City, embracing his digital chaos in the city’s underbelly. When Sam resurfaced—corrupted and alive—Damon joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his randomness to throw foes off balance. His antics synced with Sam’s lightning and Zeke’s teleportation, but Sam’s dark surge clashed with Damon’s lighter chaos. When the Bludbruhs split, Damon sided with Zeke, rejecting Sam’s shadow for a playful, defiant path, forming The Monkie Alliance with Ammon, Alex, Eli, Tom, Elijah, and Ethan. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—flared into a Civil War-style feud, later mended through Parliament ties, but Damon remains skeptical of Thunder Born’s serious tone, preferring his pixelated pranks.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Damon’s armor and chaotic nature grant him a range of powers focused on disruption, influence, and unpredictability, reflecting his Pixel Maverick persona:
          </Text>
          <Text style={styles.aboutText}>
          Memetic Manipulation: Alters perceptions with meme-like illusions or effects, confusing foes or boosting allies’ morale, a skill born from Melcornia’s glitchy energy.
          </Text>
          <Text style={styles.aboutText}>
          Humor Inducement: Infuses humor into situations, disarming enemies with laughter or rallying teammates, a playful power that shifts the mood of battles.
          </Text>
          <Text style={styles.aboutText}>
          Randomness Projection: Unleashes chaotic, unpredictable bursts—shifting visuals, sounds, or objects—disrupting order, a digital chaos tied to his armor’s shifting patterns.
          </Text>
          <Text style={styles.aboutText}>
          Pixel Shift: Briefly glitches his position or form, evading attacks or surprising foes, a subtle nod to his Monkie agility and digital theme.
          </Text>
          <Text style={styles.aboutText}>
          Chaos Boost: Amplifies his team’s unpredictability (e.g., Elijah’s chaos, Zeke’s teleport), reflecting his role as a disruptor and Monkie wildcard.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Damon is the chaos and levity of The Monkie Alliance, complementing Zeke’s precision with his randomness and Ammon’s charm with his humor. He’s cheeky, creative, and deeply loyal to his team, seeing them as a game he keeps lively. His relationship with Zeke is one of playful trust—he spices up Zeke’s plans with chaos—while with Tom “Thunder Whisperer,” he pairs sound with visuals, and with Elijah “Chaos Wither,” he amplifies disorder with glee.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Damon followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a lighter, chaotic one. His randomness clashed with Thunder Born in their Civil War-style feud, and when the Parliament intervened, he backed Ammon’s stance, sharing a playful skepticism of Thunder Born and the Titans’ seriousness. His Melcornia past forged his powers, and his role disrupts foes for the team. In Zion City, he connects with the Titans’ wildcards like Emma and Ethan, sharing their flair, but his team prioritizes independence. His ultimate goal is to glitch Zion City’s threats with Monkie Alliance, proving chaos and humor can win, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Damon sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and chaos. His pixel tricks baffled Thunder Born in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric edge but committed to Zeke’s vision, keeping tensions alive with a smirk.
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
    backgroundColor: "rgba(5, 4, 12, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 0, 144, 0.9)",
    shadowColor: "#ff4dff",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 144, 0.95)",
    backgroundColor: "rgba(10, 5, 24, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#ffeaff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(12, 6, 30, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 144, 0.85)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ff9df5",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#ffeaff",
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
    backgroundColor: "rgba(10, 5, 24, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 144, 0.85)",
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
    color: "#ffeaff",
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
    backgroundColor: "rgba(10, 5, 24, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 144, 0.8)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#ffeaff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(8, 6, 22, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 144, 0.85)",
    shadowColor: "#ff4dff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ffeaff",
    textAlign: "center",
    textShadowColor: "#ff4dff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ff9df5",
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
    borderColor: "rgba(255, 0, 144, 0.85)",
    shadowColor: "#ff4dff",
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

  // ABOUT (same structure as your original)
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

export default Damon;
