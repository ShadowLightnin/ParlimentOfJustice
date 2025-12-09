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

const TRACKS = [
  {
    id: "bolt_watcher_main",
    label: "Bolt Watcher Theme",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 update to your real file
  },
  {
    id: "bolt_watcher_alt",
    label: "Monkie Charge Loop",
    source: require("../../../assets/audio/goodWalker.m4a"), // 🔧 can reuse or swap
  },
];

const armors = [
  {
    name: "Bolt Watcher",
    image: require("../../../assets/Armor/Ethan2.jpg"),
    clickable: true,
  },
  {
    name: "Bolt Watcher",
    image: require("../../../assets/Armor/Ethan.jpg"),
    clickable: true,
  },
];

const EthanT = () => {
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
        console.error("Failed to play Bolt Watcher track", e);
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
      {/* 🎧 MUSIC BAR – electric blue / yellow bolt */}
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
        {/* HEADER – glassy bolt bar */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Bolt Watcher</Text>
              <Text style={styles.subtitle}>Speed • Lightning • Sightlines</Text>
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
          Ethan Tuffs, known as Bolt Watcher, is a swift and electrifying sentinel, a dynamic spark in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s volatile expanse. His presence is charged and alert, a blend of lightning-fast agility and keen awareness that makes him a vital scout and striker for his team. Behind his electric-blue armor, Ethan is vigilant, energetic, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” and Elijah “Chaos Wither”—seeing their agility as a current he can ride. He wields lightning with precision, turning energy into action. Off the battlefield, he’s a restless observer and a tinkerer, often scanning the horizon or tweaking his gear, but his high-voltage nature can sometimes make him impulsive.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ethan grew up in Zion City’s Terrestrial sector, in a family of runners and watchers who thrived on speed and vigilance. From a young age, he was drawn to storms and energy, a fascination that ignited when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Ethan’s agility caught a stray bolt of energy from Sam’s corruption by Erevos, awakening his lightning control as he darted to safety. His enhanced perception guided the group through the chaos, dodging threats as Sam fell.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Ethan returned to Zion City, channeling his powers into a life of scouting and survival. When Sam resurfaced—corrupted and alive—Ethan joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his lightning to complement their fight. His speed synced with Sam’s electricity and Zeke’s teleportation, but Sam’s dark surge clashed with Ethan’s instinct for freedom. When the Bludbruhs split, Ethan sided with Zeke, rejecting Sam’s shadow for a path of agility and energy, forming The Monkie Alliance with Ammon, Alex, Eli, Tom, Damon, and Elijah. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—erupted into a Civil War-style feud, later mended through Parliament ties, but Ethan remains cautious of Thunder Born’s electric echoes, favoring his own controlled bolts.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ethan’s armor and electric affinity grant him a range of powers focused on speed, energy, and awareness, reflecting his Bolt Watcher persona:
          </Text>
          <Text style={styles.aboutText}>
          Enhanced Perception: Sees and reacts to threats with heightened senses, spotting dangers or opportunities others miss, a skill honed by Melcornia’s chaos.
          </Text>
          <Text style={styles.aboutText}>
          Lightning Control: Generates and directs bolts of electricity, striking foes or powering allies’ gear, a power born from that stray energy and refined with agility.
          </Text>
          <Text style={styles.aboutText}>
          Superhuman Agility: Moves with lightning-fast reflexes and speed, darting across battlefields or evading attacks, making him a blur of blue energy.
          </Text>
          <Text style={styles.aboutText}>
          Bolt Surge: Channels a concentrated lightning burst, stunning or damaging enemies, a precise strike that ties his powers to his Thunder Born rivals yet stands apart.
          </Text>
          <Text style={styles.aboutText}>
          Energy Relay: Conducts his lightning to boost teammates’ actions (e.g., Zeke’s teleport, Tom’s sound), reflecting his role as a team enhancer and his Monkie synergy.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Ethan is the speed and energy of The Monkie Alliance, complementing Zeke’s precision with his agility and Tom’s resonance with his lightning. He’s alert, spirited, and deeply loyal to his team, seeing them as a circuit he keeps charged. His relationship with Zeke is one of trust—he follows Zeke’s lead with electric zeal—while with Ammon, he pairs energy with healing, and with Tom “Thunder Whisperer,” he syncs lightning with sound for devastating combos.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Ethan followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a freer, energetic one. His lightning clashed with Thunder Born’s in their Civil War-style feud, and when the Parliament intervened, he stood by Ammon’s side, sharing a cautious view of Thunder Born and the Titans after Will’s neutrality muddied trust. His Melcornia past forged his powers, and his role energizes the team against their rivals. In Zion City, he connects with the Titans’ speedsters like Jared and Emma, sharing their pace, but his team prioritizes independence. His ultimate goal is to electrify Zion City’s future with Monkie Alliance, proving speed and energy can outpace chaos, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Ethan sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and lightning. His bolts rivaled Sam’s electricity in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric resonance but committed to Zeke’s vision, keeping tensions alive yet tempered.
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

  // 🎧 MUSIC BAR – electric glass
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(3, 8, 20, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 200, 255, 0.9)",
    shadowColor: "#00d4ff",
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
    backgroundColor: "rgba(255, 230, 0, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 248, 170, 0.95)",
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
    color: "#2a2300",
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
    shadowColor: "#00d4ff",
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
    textShadowColor: "#00d4ff",
    textShadowRadius: 20,
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
    shadowColor: "#00d4ff",
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

export default EthanT;
