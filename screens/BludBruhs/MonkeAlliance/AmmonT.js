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

// 🎧 Quick Wit / Monkie Alliance tracks
// 🔧 Point these to your real Ammon / Monkie audio files
const TRACKS = [
  {
    id: "quick_wit_main",
    label: "Quick Wit Theme",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "quick_wit_alt",
    label: "Monkie Alliance Light Loop",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  {
    name: "Quick Wit",
    image: require("../../../assets/Armor/AmmonT.jpg"),
    clickable: true,
  },
];

const AmmonT = () => {
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
        console.error("Failed to play Quick Wit track", e);
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
      {/* 🎧 MUSIC BAR – warm gold + teal for the charming healer */}
      <View className="music-bar" style={styles.musicControls}>
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
        {/* HEADER – soft glass, charismatic vibe */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerGlass}>
              <Text style={styles.title}>Quick Wit</Text>
              <Text style={styles.subtitle}>Charm • Healing • Stealth</Text>
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
          Ammon Thomson, known as Quick Wit, is a suave and resourceful healer, a vital pillar of The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s chaotic sprawl. His presence is warm yet elusive, a blend of charm and stealth that makes him a soothing yet slippery ally. Behind his yet-to-be-detailed armor, Ammon is empathetic, clever, and deeply loyal to his Monkie Alliance team—Zeke, Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—and his spouse, whose support anchors him. He thrives on witty banter and healing, lifting spirits amidst strife. Off the battlefield, he’s a nurturer and a strategist, often tending to his team or plotting with a smile, but his falling out with Will “Night Hawk” over the Titans’ role lingers as a sore spot.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ammon grew up in Zion City’s Terrestrial sector, raised in a family that valued compassion and cunning. His natural empathy and quick tongue made him a peacemaker, traits that shone when he joined Sam, Will, Cole, Joseph, James, Tanner, Zeke, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Ammon’s healing touch emerged as he soothed the group’s wounds after Sam’s family died and Erevos corrupted Sam, while his stealth kept him out of the fray. The experience bonded him to his crew, especially Will, his early confidant.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Ammon returned to Zion City, marrying his spouse and honing his skills in quiet service. When Sam resurfaced—corrupted and alive—Ammon joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his charm and healing to bolster their fight. But Sam’s dark surge clashed with Ammon’s ideals, and he sided with Zeke in the rift, forming The Monkie Alliance with Alex, Eli, Tom, Damon, Elijah, and Ethan. The split ignited a Civil War-style feud with Thunder Born (Sam, Cole, Joseph, James, and Tanner), escalating until the Parliament intervened. During this clash, Ammon misunderstood the Titans’ neutrality—led by Will—as support for Sam, leading to a bitter falling out with his old friend. Though the rivalry mended over time, Ammon’s trust in Will and the Titans remains shaky, strained by that betrayal.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ammon’s innate gifts and subtle armor grant him a range of abilities focused on support, stealth, and influence, reflecting his Quick Wit persona:          </Text>
          <Text style={styles.aboutText}>
          Empathy: Senses and soothes emotions, calming allies or reading foes, a skill that strengthens his team’s resolve and informs his strategies.          </Text>
          <Text style={styles.aboutText}>
          Charm: Wields a magnetic charisma, persuading or disarming others with ease, often paired with witty banter to lighten tense moments.          </Text>
          <Text style={styles.aboutText}>
          Husbandry: Nurtures and bonds with animals or allies, boosting their morale or coordination, a trait tied to his caring nature and married life.          </Text>
          <Text style={styles.aboutText}>
          Stealth: Moves silently and unseen, slipping through danger or aiding allies covertly, enhanced by his armor’s design.          </Text>
          <Text style={styles.aboutText}>
          Healing Touch: Mends wounds and restores energy with a gentle touch, a power born from Melcornia and vital to Monkie Alliance’s endurance.          </Text>
          <Text style={styles.aboutText}>
          Witty Banter: Distracts or taunts foes with sharp quips, throwing them off balance, a playful yet effective combat tool.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          Ammon is the heart and guile of The Monkie Alliance, complementing Zeke’s precision with his charm and Elijah’s chaos with his healing. He’s witty, compassionate, and deeply loyal to his team and spouse, seeing them as a family he’ll mend and defend. His relationship with Zeke is one of trust—he supports Zeke’s leadership with empathy—while with Alex “Swiftmind,” he pairs charm with intellect, and with Elijah, he tempers chaos with calm.          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Ammon followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a lighter, agile one. His falling out with Will came when the Parliament stopped the Thunder Born-Monkie feud—Ammon saw Will’s Titan neutrality as siding with Sam, shattering their bond. Though mended, the rift leaves Ammon wary of Titans like Will, Jared, and Spencer. His Melcornia past forged his resilience, and his role bolsters the team against Thunder Born. In Zion City, he connects with the Titans’ healers like Jennifer, sharing their compassion, but his team prioritizes independence. His ultimate goal is to heal Zion City with Monkie Alliance, proving charm and stealth can triumph, while navigating his shaky truce with Will and Sam.          </Text>
          <Text style={styles.aboutText}>
          Ammon sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to defy Thunder Born’s shadow. During their Civil War-style feud, the Parliament’s intervention halted the fighting, but Ammon misread the Titans’ neutrality—led by Will—as support for Sam, sparking a heated falling out. Their bond mended over time, but Ammon’s trust remains fragile, coloring his view of Thunder Born and the Titans.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#050607", // soft dark, a bit warmer
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  // 🎧 MUSIC BAR – warm gold + teal glass
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(10, 8, 16, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 210, 120, 0.9)",
    shadowColor: "#ffd978",
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
    borderColor: "rgba(255, 235, 180, 0.95)",
    backgroundColor: "rgba(26, 18, 32, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#fff9e8",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(22, 16, 34, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 225, 170, 0.9)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffeaa0",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fff9e8",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 210, 190, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(160, 255, 240, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(26, 18, 32, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 225, 170, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#002422",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#fff9e8",
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
    backgroundColor: "rgba(22, 16, 34, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 225, 170, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#fff9e8",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(16, 12, 26, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 225, 170, 0.85)",
    shadowColor: "#ffd978",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff9e8",
    textAlign: "center",
    textShadowColor: "#ffd978",
    textShadowRadius: 20,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffeaa0",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // IMAGE STRIP
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    paddingLeft: 15,
  },

  // CARD
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    backgroundColor: "rgba(10, 8, 16, 0.96)",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 225, 170, 0.9)",
    shadowColor: "#ffd978",
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
  },
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
  },

  // ABOUT (for when you un-comment later)
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

export default AmmonT;
