import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const characters = [
  { name: "Sable", image: require("../../../assets/Villains/Sable.jpg"), clickable: true },
  { name: "Sable Shadow", image: require("../../../assets/Villains/Sable2.jpg"), clickable: true },
];

const SableScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [sound, setSound] = useState(null);

  // Dynamic window sizing
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Audio playback and interruption
  useEffect(() => {
    let isMounted = true;

    const playSableTheme = async () => {
      try {
        // Interrupt other audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          interruptsOtherAudio: true, // Stop other audio (e.g., BlackHoleBomb.mp4)
          shouldDuckOthers: true, // Lower volume of other audio if interruption fails
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });
        console.log("Audio mode set to interrupt other audio at:", new Date().toISOString());

        // Load and play Sable's theme
        const { sound: sableSound } = await Audio.Sound.createAsync(
          require("../../../assets/audio/sableEvilish.m4a"), // Placeholder path; replace with actual file
          { shouldPlay: true, isLooping: true, volume: 0.7 }
        );
        if (isMounted) {
          setSound(sableSound);
          await sableSound.playAsync();
          console.log("sableTheme.m4a started playing at:", new Date().toISOString());
        }
      } catch (error) {
        console.error("Audio loading error:", error.message);
        // Optional: Alert.alert("Audio Error", "Failed to load Sable's theme: " + error.message);
      }
    };

    playSableTheme();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (sound) {
        sound.stopAsync().catch(err => console.error("Error stopping sound on unmount:", err));
        sound.unloadAsync().catch(err => console.error("Error unloading sound on unmount:", err));
        setSound(null);
        console.log("sableTheme.m4a stopped on unmount at:", new Date().toISOString());
      }
    };
  }, []);

  const isDesktop = windowWidth >= 768;

  const handleBackPress = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        console.log("sableTheme.m4a stopped via back button at:", new Date().toISOString());
      } catch (error) {
        console.error("Error stopping sound in handleBackPress:", error);
      }
    }
    navigation.goBack();
  };

  const renderCharacterCard = (character) => (
    <TouchableOpacity
      key={character.name}
      style={[styles.card(isDesktop, windowWidth), character.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
    >
      <Image
        source={character.image}
        style={styles.armorImage}
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {character.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Sable the Assassin</Text>
          </View>

          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={windowWidth * 0.7 + 20}
              decelerationRate="fast"
            >
              {characters.map(renderCharacterCard)}
            </ScrollView>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              • Nemesis: Sam Woodwell “Void Walker”
            </Text>
            <Text style={styles.aboutText}>
              Sable is a merciless warrior with an arsenal of deadly, shadow-infused weaponry. Her ability to slip through dimensions allows her to be anywhere and nowhere, striking down threats to Erevos’s plans without leaving a trace.
            </Text>
            <Text style={styles.aboutText}>
              She is deeply in love with Void Walker (Sam), which has led to a personal and bitter rivalry with Chrona, who also harbors feelings for him. Despite Erevos assigning her to eliminate Sam for betraying the Enlightened, she has repeatedly failed or hesitated — torn between duty and emotion. Instead of executing him, she often settles for mortally wounding him or letting him go.
            </Text>
            <Text style={styles.aboutText}>
              Among the Enlightened, Sable is considered one of Erevos’s deadliest lieutenants and serves as his most deadly and affective spy and informant.
            </Text>
            <Text style={styles.aboutText}>
              She was once Erevos’s top infiltrator during the Shadow Purges, a mission that wiped out dozens of rising metahuman factions before they could become threats. Her name is whispered in fear by resistance cells.
            </Text>
            <Text style={styles.aboutText}>
              Her preferred weapons are twin void-forged blades that phase through armor and disrupt neural pathways, leaving enemies conscious but paralyzed.
            </Text>
            <Text style={styles.aboutText}>
              Sable’s armor adapts to shadows, rendering her nearly invisible in darkened environments. When moving, she emits no sound—only the shimmer of displaced air.
            </Text>
            <Text style={styles.aboutText}>
              Despite her loyalty to Erevos, she often questions the cost of obedience. Each mission that pits her against Sam drives deeper fractures into her soul.
            </Text>
            <Text style={styles.aboutText}>
              She and Obelisk frequently operate together, with Obelisk serving as the brute enforcer while Sable handles the surgical precision of espionage and assassination.
            </Text>
            <Text style={styles.aboutText}>
              Sable’s codename among the Enlightened is “The Final Whisper”—because when she appears, there is no sound, no escape, and no warning.
            </Text>
            <Text style={styles.aboutText}>
              Sable was once a war orphan taken in by Erevos during one of his earliest purges. She grew up in his shadow, trained by his assassins, and eventually earned his personal trust and mentorship.
            </Text>
            <Text style={styles.aboutText}>
              She believes Erevos saved her from a meaningless, brutal life. Her loyalty is born from gratitude, purpose, and belief that his vision, however cruel, will bring lasting order to the galaxy.
            </Text>
            <Text style={styles.aboutText}>
              Sable is furious at Sam’s defection. She sees it as a personal betrayal—not just of Erevos, but of everything they survived together. She cannot understand why he would throw it all away.
            </Text>
            <Text style={styles.aboutText}>
              Her emotional conflict with Sam—caught between vengeance, heartbreak, and lingering love—is one of the few vulnerabilities she cannot cloak in shadow.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D4AF37",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
  },
  aboutSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 15,
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D4AF37",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SableScreen;