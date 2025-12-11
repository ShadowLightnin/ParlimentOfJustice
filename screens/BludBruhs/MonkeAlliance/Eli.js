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

// 🎧 Shadow Hunter tracks (swap these to your real files)
const TRACKS = [
  {
    id: "shadow_main",
    label: "Shadow Hunter Theme",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 update to real file
  },
  {
    id: "shadow_trail",
    label: "Night Trail Loop",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 can reuse or change
  },
];

const armors = [
  {
    name: "Shadow Hunter",
    image: require("../../../assets/Armor/Eli.jpg"),
    clickable: true,
  },
];

const Eli = () => {
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
        console.error("Failed to play Shadow Hunter track", e);
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
      {/* 🎧 MUSIC BAR – Shadow Hunter: stealth / hunter vibe */}
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
        {/* HEADER – glass panel with tagline */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Shadow Hunter</Text>
              <Text style={styles.subtitle}>Stealth • Tracking • Resolve</Text>
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
          Eli Chase, known as Shadow Hunter, is a silent and relentless stalker, a crucial scout in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s treacherous terrain. His presence is subtle yet unyielding, a blend of stealth and razor-sharp senses that makes him a phantom on the battlefield. Behind his dark, matte-finish armor, Eli is focused, determined, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing their agility as a trail he can follow and protect. He tracks threats with unmatched precision, a hunter born of dedication. Off the battlefield, he’s a quiet observer and a planner, often mapping routes or honing his senses, but his single-minded focus can sometimes isolate him from the team’s lighter moments.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Eli grew up on the edges of Zion City’s Terrestrial sector, in a family of trackers and survivalists who thrived in the wilds. From a young age, he honed his senses and stealth, learning to hunt and navigate by instinct, a skill that proved vital when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Eli’s tracking kept the group ahead of unseen dangers as Sam fell to Erevos’s corruption, his enhanced senses picking up the subtle shifts that saved lives amidst the chaos.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Eli returned to Zion City, living as a shadow, refining his skills in solitude. When Sam resurfaced—corrupted and alive—Eli joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his stealth to scout their foes. His tracking synced with Sam’s lightning and Zeke’s teleportation, but Sam’s dark surge clashed with Eli’s dedication to a cleaner path. When the Bludbruhs split, Eli sided with Zeke, rejecting Sam’s shadow for a nimble, principled one, forming The Monkie Alliance with Ammon, Alex, Tom, Damon, Elijah, and Ethan. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—ignited a Civil War-style feud, later mended through Parliament ties, but Eli remains wary of Thunder Born’s volatile energy, trusting only his own silent hunt.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Eli’s armor and hunter instincts grant him a range of powers focused on stealth, tracking, and precision, reflecting his Shadow Hunter persona:
          </Text>
          <Text style={styles.aboutText}>
          Stealth: Moves unseen and unheard, blending into shadows or environments with advanced camouflage, a skill enhanced by his armor and Melcornia’s lessons.
          </Text>
          <Text style={styles.aboutText}>
          Tracking: Follows trails with uncanny accuracy, detecting scents, sounds, or subtle signs, making him the team’s eyes in the dark or chaos.
          </Text>
          <Text style={styles.aboutText}>
          Enhanced Senses: Perceives beyond normal limits—sight, hearing, smell—spotting threats or allies from afar, a trait sharpened by his natural gifts and armor tech.
          </Text>
          <Text style={styles.aboutText}>
          Dedication: Channels unwavering focus into boosted endurance or precision, pushing through fatigue or honing strikes, reflecting his relentless resolve.
          </Text>
          <Text style={styles.aboutText}>
          Shadow Strike: Delivers silent, precise attacks from stealth, enhanced by his senses, a hunter’s blow that ties his skills to Monkie Alliance’s agility.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Eli is the silence and vigilance of The Monkie Alliance, complementing Zeke’s precision with his stealth and Ethan’s lightning with his tracking. He’s reserved, steadfast, and deeply loyal to his team, seeing them as a pack he guards from the shadows. His relationship with Zeke is one of quiet trust—he follows Zeke’s lead with hunter’s instinct—while with Ammon, he pairs stealth with charm, and with Tom “Thunder Whisperer,” he syncs tracking with sound for pinpoint strikes.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Eli followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a subtler, dedicated one. His stealth tracked Thunder Born in their Civil War-style feud, and when the Parliament intervened, he stood by Ammon’s side, sharing a cautious view of Thunder Born and the Titans after Will’s neutrality stirred doubts. His Melcornia past forged his senses, and his role guides the team against their rivals. In Zion City, he connects with the Titans’ stealth experts like William and James “Shadowmind,” sharing their subtlety, but his team prioritizes independence. His ultimate goal is to hunt Zion City’s threats with Monkie Alliance, proving stealth and dedication can prevail, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Eli sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and precision. His tracking shadowed Thunder Born in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric volatility but committed to Zeke’s vision, keeping tensions alive yet restrained.
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
    backgroundColor: "#030607",
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  // 🎧 MUSIC BAR – dark forest / hunter green accent
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(1, 5, 8, 0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 180, 120, 0.9)",
    shadowColor: "#00ffb3",
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
    borderColor: "rgba(0, 200, 130, 0.95)",
    backgroundColor: "rgba(2, 12, 10, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e9fff6",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(3, 18, 16, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 200, 130, 0.85)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#7cf7c8",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e9fff6",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 200, 130, 0.98)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(200, 255, 230, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(1, 10, 9, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 200, 130, 0.85)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#00140b",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#e9fff6",
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
    backgroundColor: "rgba(2, 12, 10, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 180, 120, 0.8)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e9fff6",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(3, 14, 12, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(0, 200, 130, 0.9)",
    shadowColor: "#00ffb3",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e9fff6",
    textAlign: "center",
    textShadowColor: "#00ffb3",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#7cf7c8",
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
    borderColor: "rgba(0, 200, 130, 0.9)",
    shadowColor: "#00ffb3",
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

  // ABOUT (unchanged structure, still commented in JSX)
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

export default Eli;
