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

// 🎧 Wolff / Thunder Born tracks
const TRACKS = [
  {
    id: "wolff_main",
    label: "Wolff Theme",
    // 🔧 Update this path if your file is named differently
    source: require("../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "wolff_howl",
    label: "Thunder Howl Loop",
    source: require("../../assets/audio/goodWalker.m4a"),
  },
];

const armors = [
  { name: "Wolff", image: require("../../assets/Armor/TannerBb.jpg"), clickable: true },
];

const TannerBb = () => {
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
        console.error("Failed to play Wolff track", e);
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
      {/* 🎧 MUSIC BAR – primal Thunder Born / Wolff vibe */}
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
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerGlass}>
              <Text style={styles.title}>Wolff</Text>
              <Text style={styles.subtitle}>Howl • Hunt • Thunder</Text>
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
          Tanner - Wolff is a primal and ferocious warrior, a vital force within the Thunder Born, reborn from the ashes of the Bludbruhs in Zion City’s tumultuous world. His presence is wild and intimidating, a blend of animalistic strength and unyielding tenacity that makes him a fearsome ally. Behind his wolf-themed armor, Tanner is gruff, instinctive, and fiercely loyal to his Thunder Born comrades—Sam “Striker,” Cole “Cruiser,” Joseph “Techoman,” and James “Shadowmind”—seeing their unit as a pack he’d defend to the death. He thrives on raw power, drawing from his inner beast and the rugged spirit of survival. Off the battlefield, he’s a loner and a hunter, often prowling the wilds or sharpening his skills, but his savage nature can sometimes strain his bonds with the more tactical members of the group.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Tanner grew up on the fringes of Zion City’s Terrestrial sector, in a rugged community where survival meant embracing the wild. Raised among hunters and storytellers, he idolized wolves—symbols of strength, loyalty, and ferocity—and honed his physical prowess from a young age. His life took a drastic turn when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Zeke, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Tanner witnessed Sam’s corruption by Erevos and the loss of Sam’s family, an event that awakened his own primal instincts as he fought to protect the group.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead after Melcornia, Tanner returned to Zion City hardened, living on the edge of society and refining his combat skills. When Sam resurfaced—alive and wielding dark powers—Tanner rejoined him, Cole, Joseph, and James to form the Bludbruhs, bringing his raw strength to their fight against Zion City’s chaos. His wolf-like ferocity complemented Sam’s lightning, Cole’s combat, and Joseph’s tech, but Sam’s growing darkness tested their unity. When the Bludbruhs fractured, some split for the Monkie Alliance, but Tanner stayed, his loyalty to the pack outweighing his unease with Sam’s powers. He embraced the Thunder Born rebranding, seeing it as a howl of renewal, aligning his savage spirit with their electric resolve.          </Text>
          <Text style={styles.aboutText}>
          Abilities          </Text>
          <Text style={styles.aboutText}>
          Tanner’s armor and primal nature grant him a range of powers focused on strength, ferocity, and survival, reflecting his wolf theme and Thunder Born identity:          </Text>
          <Text style={styles.aboutText}>
          Beast Strength: Possesses enhanced physical power, capable of tearing through obstacles or foes with claw-like strikes, a trait born from his wolf-inspired instincts.          </Text>
          <Text style={styles.aboutText}>
          Feral Agility: Moves with lupine speed and reflexes, dodging attacks or lunging at targets, making him a relentless hunter in combat.          </Text>
          <Text style={styles.aboutText}>
          Thunder Howl: Emits a sonic roar infused with electrical energy, stunning enemies or rallying allies, a nod to his Thunder Born synergy with Sam’s lightning.          </Text>
          <Text style={styles.aboutText}>
          Predator Senses: Tracks targets with heightened smell, hearing, and night vision, honed by his wild upbringing and Melcornia’s harsh lessons.          </Text>
          <Text style={styles.aboutText}>
          Pack Bond: Boosts his strength and resilience when fighting alongside his team, reflecting his loyalty to Sam, Cole, Joseph, and James as his pack.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Tanner is the muscle and ferocity of the Thunder Born, complementing Sam’s volatility with his raw power, Cole’s discipline with his wildness, and Joseph’s tech with his brute force. He’s gruff, protective, and deeply loyal to his pack, seeing their unit as a family worth fighting for. His relationship with Sam is one of primal respect—he admires Sam’s strength but growls at his darkness—while with Cole, it’s a soldierly bond, syncing his fury with Cole’s precision. With Joseph, he’s gruffly appreciative, relying on tech upgrades, and with James “Shadowmind,” he shares a hunter’s kinship, blending stealth with savagery.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, Tanner stood firm during the Bludbruhs’ rift, choosing to stay with Sam, Cole, Joseph, and James over splitting to the Monkie Alliance, driven by pack loyalty. His Melcornia past forged his resilience, and his presence bolsters the team when the Titans face “Evil Sam.” In Zion City, he connects with the Titans’ fighters like Ben Briggs and Jared, sharing their combat drive, but his squad focuses on survival over heroics. His ultimate goal is to protect Zion City as part of his pack, proving that primal strength and loyalty can thunder through any storm.          </Text>
          <Text style={styles.aboutText}>
          Tanner stayed with Sam when the Bludbruhs dissolved, rejecting the Monkie Alliance split over Sam’s dark powers. He embraced the Thunder Born name as a howl of renewal, shedding the “Bludbruhs” blood-taint for a title that echoes his thunder howl and the group’s electric rebirth, reinforcing his bond with Sam, Cole, Joseph, and James.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#050608", // dark, feral Thunder Born base
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  // 🎧 MUSIC BAR – deep charcoal + electric violet/amber
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(8, 6, 12, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 170, 80, 0.7)", // hint of wolf/amber
    shadowColor: "#b266ff",
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
    borderColor: "rgba(230, 200, 255, 0.95)",
    backgroundColor: "rgba(20, 10, 32, 0.9)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#fdf3ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(16, 8, 26, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(200, 150, 255, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#e0c9ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fdf3ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(200, 150, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(250, 235, 255, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(22, 10, 34, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(200, 150, 255, 0.9)",
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
    color: "#fdf3ff",
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
    backgroundColor: "rgba(18, 10, 30, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(200, 150, 255, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#fdf3ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(10, 6, 20, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(200, 150, 255, 0.8)",
    shadowColor: "#b266ff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fdf3ff",
    textAlign: "center",
    textShadowColor: "#b266ff",
    textShadowRadius: 22,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#e0c9ff",
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
    backgroundColor: "rgba(6, 4, 14, 0.96)",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(200, 150, 255, 0.9)",
    shadowColor: "#b266ff",
    shadowOpacity: 0.75,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  }),
  clickable: {
    // visual state handled by border/shadow already
  },
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

  // ABOUT (kept for when you uncomment later)
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

export default TannerBb;
