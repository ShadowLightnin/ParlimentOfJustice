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

// 🎧 Thunder Whisperer / sonic-electric tracks
// 🔧 update these requires to your real audio files
const TRACKS = [
  {
    id: "thunder_whisperer_main",
    label: "Thunder Whisperer Theme",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "thunder_whisperer_alt",
    label: "Monkie Resonance Loop",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  {
    name: "Thunder Whisperer",
    image: require("../../../assets/Armor/TomC3.jpg"),
    clickable: true,
  },
];

const TomBb = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // responsive width
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
        console.error("Failed to play Thunder Whisperer track", e);
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

  // stop audio when leaving this screen
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
      {/* 🎧 MUSIC BAR – sonic / thunder glass */}
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
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerGlass}>
              <Text style={styles.title}>Thunder Whisperer</Text>
              <Text style={styles.subtitle}>Sound • Harmony • Shockwaves</Text>
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
          Tom Cochran, known as Thunder Whisperer, is a resonant and subtle maestro, a key harmonizer in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s chaotic sprawl. His presence is calm yet powerful, a blend of sonic control and understated strength that makes him a vital support for his team. Behind his sleek, sound-enhancing armor, Tom is thoughtful, steady, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing their agility as a rhythm he amplifies. He thrives on manipulating sound, turning whispers into thunder. Off the battlefield, he’s a listener and a tinkerer, often fine-tuning his gear or soothing tensions, but his quiet demeanor can mask his full potential.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Tom grew up in Zion City’s Terrestrial sector, in a family of musicians and craftsmen who valued harmony and precision. His knack for sound and mechanics led him to join Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Tom’s exposure to its eerie acoustics awakened his sonic powers as Sam fell to Erevos. Using sound to disorient threats, he helped the group escape, forging a bond with them.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Tom returned to Zion City, refining his abilities in solitude. When Sam resurfaced—corrupted and alive—Tom joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, syncing his sonic control with their efforts. But Sam’s dark surge clashed with Tom’s need for balance, and he followed Zeke in the rift, forming The Monkie Alliance with Ammon, Alex, Eli, Damon, Elijah, and Ethan. The Thunder Born rivalry flared, and Tom’s sound powers softened its edges when the Parliament intervened, though he remains wary of Sam’s lingering chaos, aligning his thunder with Monkie’s defiance.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Tom’s armor and sonic gifts grant him a range of powers focused on sound, support, and disruption, reflecting his Thunder Whisperer role:
          </Text>
          <Text style={styles.aboutText}>
          Sonic Control: Manipulates sound waves, amplifying whispers into deafening roars or focusing them into precise strikes, a skill born from Melcornia’s echoes.
          </Text>
          <Text style={styles.aboutText}>
          Sound Absorption: Dampens or absorbs ambient noise, silencing threats or shielding allies, enhanced by his armor’s materials.
          </Text>
          <Text style={styles.aboutText}>
          Harmonic Resonance: Creates vibrations that heal allies or destabilize foes, syncing with Monkie Alliance’s rhythm and his own balance.
          </Text>
          <Text style={styles.aboutText}>
          Thunder Pulse: Releases a concentrated sonic blast, stunning or disorienting enemies, tying his powers to the faction’s electric vibe.
          </Text>
          <Text style={styles.aboutText}>
          Auditory Insight: Detects subtle sounds or vibrations, enhancing his awareness, a trait honed by his quiet nature.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Tom is the rhythm and support of The Monkie Alliance, complementing Zeke’s precision with his sonic finesse and Ammon’s charm with his calm. He’s steady, insightful, and deeply loyal to his team, seeing them as a symphony he keeps in tune. His relationship with Zeke is one of trust—he aligns his sound with Zeke’s leadership—while with Ammon, he pairs healing with resonance, and with Elijah “Chaos Wither,” he balances chaos with order.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Tom followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a harmonious one. His sonic control aided their feud with Thunder Born, and when the Parliament intervened, he supported Ammon’s efforts despite the fallout with Will, sharing a cautious view of Titans and Thunder Born alike. His Melcornia past forged his powers, and his role stabilizes the team against their rivals. In Zion City, he connects with the Titans’ subtle players like William and Emma, sharing their finesse, but his team prioritizes independence. His ultimate goal is to resonate Zion City’s future with Monkie Alliance, proving sound can harmonize chaos, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Tom sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and harmony. His sonic pulses clashed with Thunder Born’s lightning in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric edge but committed to Zeke’s vision, keeping tensions alive yet controlled.
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
    backgroundColor: "#05050a",
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  // 🎧 MUSIC BAR – deep purple + electric blue
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(6, 4, 18, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(130, 200, 255, 0.9)",
    shadowColor: "#6bd2ff",
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
    borderColor: "rgba(150, 210, 255, 0.95)",
    backgroundColor: "rgba(10, 16, 34, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e7f3ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(14, 18, 40, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(160, 215, 255, 0.9)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#9fd5ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e7f3ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(90, 220, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(180, 240, 255, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(10, 16, 34, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(140, 210, 255, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#001822",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#e7f3ff",
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
    backgroundColor: "rgba(10, 16, 34, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(140, 210, 255, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e7f3ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(8, 12, 30, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(140, 210, 255, 0.85)",
    shadowColor: "#6bd2ff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e7f3ff",
    textAlign: "center",
    textShadowColor: "#6bd2ff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#9fd5ff",
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
    borderRadius: 15,
    overflow: "hidden",
    elevation: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(150, 210, 255, 0.9)",
    shadowColor: "#6bd2ff",
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

  // ABOUT (for later)
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

export default TomBb;
