import React, { useRef, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated 
} from "react-native";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🎵 Background Music from MP4 - Global management
let backgroundSound = null;
const MUSIC_LOOP = false;

const playBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
      console.log("Existing music stopped before replay at:", new Date().toISOString());
    } catch (error) {
      console.error("Error stopping existing music:", error);
    }
  }
  
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/Sam.mp4'),
      { shouldPlay: true, isLooping: MUSIC_LOOP, volume: 1.0 }
    );
    backgroundSound = sound;
    await sound.playAsync();
    console.log("Music started playing at:", new Date().toISOString());
  } catch (error) {
    console.error("Error playing background music:", error);
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      console.log("Attempting to stop music at:", new Date().toISOString());
      await backgroundSound.setVolumeAsync(0.0);
      await backgroundSound.pauseAsync();
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      console.log("Music fully stopped, unloaded, and audio mode reset at:", new Date().toISOString());
    } catch (error) {
      console.error("Error stopping background music:", error);
    }
  } else {
    console.log("No music to stop at:", new Date().toISOString());
  }
};

const Sam = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const flashAnim = useRef(new Animated.Value(1)).current;
  const popupAnim = useRef(new Animated.Value(-100)).current;
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [fromBludBruhsHome, setFromBludBruhsHome] = useState(false);
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // Check navigation params to determine source
  useEffect(() => {
    const params = route.params || {};
    console.log("Route params on mount:", params);
    if (params.from === "BludBruhsHome") {
      setFromBludBruhsHome(true);
      setHasShownPopup(false);
      console.log("Set fromBludBruhsHome to true at:", new Date().toISOString());
    } else {
      setFromBludBruhsHome(false);
      console.log("Set fromBludBruhsHome to false at:", new Date().toISOString());
    }
  }, [route.params]);

  // ⚡ Flashing Animation Effect for Planet
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 🎵 Audio Control - Play on mount, no cleanup on focus loss
  useEffect(() => {
    if (isFocused) {
      playBackgroundMusic();
    }
    return () => {
      console.log("Sam component fully unmounting at:", new Date().toISOString());
    };
  }, [isFocused]);

  // Popup Timing - Separate from audio
  useEffect(() => {
    console.log("Popup useEffect - isFocused:", isFocused, "fromBludBruhsHome:", fromBludBruhsHome, "hasShownPopup:", hasShownPopup);
    if (isFocused && fromBludBruhsHome && !hasShownPopup) {
      const showPopup = () => {
        console.log("Showing popup at:", new Date().toISOString());
        setIsPopupVisible(true);
        Animated.timing(popupAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        const autoCloseTimer = setTimeout(() => {
          Animated.timing(popupAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setIsPopupVisible(false));
          setHasShownPopup(true);
          console.log("Popup closed, hasShownPopup set to true at:", new Date().toISOString());
        }, 3000);

        return () => clearTimeout(autoCloseTimer);
      };

      console.log("Scheduling popup in 26.5s at:", new Date().toISOString());
      const timer = setTimeout(showPopup, 26500);
      return () => clearTimeout(timer);
    }
  }, [isFocused, fromBludBruhsHome, hasShownPopup]);

  // Responsive width handling
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // 🌌 Planet Click Handler → Leads to WarpScreen (No audio stop)
  const handlePlanetPress = () => {
    console.log("Navigating to WarpScreen without stopping music at:", new Date().toISOString());
    navigation.navigate("WarpScreen", { from: "Sam" });
  };

  // ✅ Confirm Warp to WarpScreen (No audio stop)
  const confirmWarp = () => {
    Animated.timing(popupAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsPopupVisible(false);
      console.log("Navigating to WarpScreen without stopping music at:", new Date().toISOString());
      navigation.navigate("WarpScreen", { from: "Sam" });
    });
  };

  // ❌ Cancel Warp
  const cancelWarp = () => {
    Animated.timing(popupAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsPopupVisible(false);
    });
  };

  // 🔙 Back Button Handler - Explicitly stop music
  const handleBackPress = async () => {
    console.log("Back button pressed at:", new Date().toISOString());
    await stopBackgroundMusic();
    navigation.navigate("BludBruhsHome");
  };

  const isDesktop = windowWidth >= 768;

  const armors = [
    { name: "Void Walker", copyright: "William Cummings", image: require("../../assets/Armor/Sam.jpg"), clickable: true },
    { name: "Void Walker", copyright: "Samuel Woodwell", image: require("../../assets/Armor/Sam4.jpg"), clickable: true },
    { name: "Void Walker", copyright: "Samuel Woodwell", image: require("../../assets/Armor/Sam7.jpg"), clickable: true },
    { name: "Void Walker", copyright: "Samuel Woodwell", image: require("../../assets/Armor/Sam3.jpg"), clickable: true },
    { name: "Void Walker", copyright: "Samuel Woodwell", image: require("../../assets/Armor/Sam5.jpg"), clickable: true },
    { name: "Legacy", copyright: "William Cummings", image: require("../../assets/Armor/SamLegacy.jpg"), clickable: true },
  ];

  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={`${armor.name}-${armor.copyright}`} // Unique key using name and copyright
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || 'Unknown'}; {armor.copyright}
      </Text>
      {!armor.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Void Walker</Text>
          <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}>
            <Animated.Image 
              source={require("../../assets/Space/ExoPlanet2.jpg")}
              style={[styles.planetImage, { opacity: flashAnim }]}
            />
          </TouchableOpacity>
        </View>

        {/* Armor Cards */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.7 + 20}
            decelerationRate="fast"
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Sam Woodwell, known as Striker, is a tempest of power and turmoil, the conflicted leader of the Thunder Born, a faction born from the ashes of the Bludbruhs within Zion City’s evolving landscape. His presence is electric and commanding, a volatile mix of dark mastery and raw energy that makes him both a force and a liability. Behind his metallic Jedi robes and floating skull helmet, Sam is intense, driven, and torn between his past corruption and present redemption, his heart anchored by a lingering love for Chroma, a figure still shrouded in evil. He’s tied to his former Bludbruhs—Cole “Cruiser,” Joseph “Techoman,” James “Shadowmind,” and Tanner - Wolff—but his rift with them marks a new chapter. Off the battlefield, he’s a brooding strategist, wrestling with his demons, but his dark powers often alienate those he seeks to protect.           </Text>
           <Text style={styles.aboutText}>
           Backstory           </Text>
           <Text style={styles.aboutText}>
           Sam’s journey began as a naive teenager in Zion City’s Terrestrial sector, a dreamer who stumbled into a life-altering adventure. Alongside Will (later “Night Hawk”), Joseph, James, Cole, Tanner, Zeke, Elijah, Tom, and others, he ventured to the planet Melcornia, a pre-Parliament expedition that tested their mettle. In a dark mansion on that alien world, Sam’s family was killed by an unknown figure, shattering his innocence. A sinister entity, Erevos, promised justice and revenge, corrupting Sam’s mind with strange powers over darkness and electricity. The mansion amplified his grief into a weapon, and he embraced Erevos’s teachings, unaware of their evil.           </Text>
           <Text style={styles.aboutText}>
           The Melcornia crew returned fractured, believing Sam dead, but he survived, twisted by Erevos and the Enlightened faction. Years later, after seeing Erevos’s ideals as malevolent, Sam broke free, retaining his dark powers and a love for Chroma, a corrupted ally he met under Erevos’s sway. Seeking redemption, he joined the nascent Parliament of Justice and formed the Bludbruhs with Cole, Joseph, James, and Tanner, a brotherhood forged to fight Zion City’s chaos. But Sam’s inner conflict—his reliance on dark powers versus his desire for good—caused a rift. Many, including Tanner, left for the Monkie Alliance, rejecting his methods. With a bounty from the Enlightened on his head, Sam rebranded the remnants as Thunder Born, a name reflecting his electrical might and a fresh start from the Bludbruhs’ tainted legacy.           </Text>
          <Text style={styles.aboutText}>
          When the Titans formed, Will and his team were the first to face “Evil Sam,” unaware of his survival until that clash, setting the stage for a reckoning between his past and present.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Sam’s armor and corrupted powers grant him a range of abilities blending electricity, telekinesis, and influence, shaped by his Melcornia ordeal:          </Text>
          <Text style={styles.aboutText}>
          Electrical Manipulation: Controls and generates lightning-like energy, striking foes or powering his surroundings, a gift from the mansion’s corruption amplified by his will.          </Text>
          <Text style={styles.aboutText}>
          Telekinesis: Lifts and moves objects or people with his mind, a dark skill honed by Erevos, used for both combat and utility, reflecting his mental strength.          </Text>
          <Text style={styles.aboutText}>
          Mind Influence: Subtly sways thoughts or emotions, a lingering taint from the Enlightened, effective for persuasion or control, though he resists its full potential.          </Text>
          <Text style={styles.aboutText}>
          Dark Surge: Combines electricity and shadow into a devastating burst, a remnant of his dark past, capable of overwhelming enemies but taxing his resolve.          </Text>
          <Text style={styles.aboutText}>
          Storm Presence: Projects an aura of crackling energy, intimidating foes and inspiring allies, a natural extension of his Thunder Born identity.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Sam is the storm and soul of the Thunder Born, a leader whose electrical might and dark past define his fractured path. He’s brooding, determined, and deeply conflicted, torn between the powers Erevos gave him and the redemption he seeks with the Parliament. His love for Chroma fuels his hope, but her corruption mirrors his own struggle.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born (formerly Bludbruhs), Sam’s rift with Zeke, Elijah, Tom, and Ammon marks a turning point—his dark surge clashed with their ideals, birthing the Monkie Alliance as they split. With Cole, he shared combat trust; with Joseph, tech synergy; with James, shadow tactics; and with Tanner, primal strength. Now, as Thunder Born, he leads a smaller, loyal remnant, redefining their purpose. His clash with Will and the Titans reveals his survival, setting up a redemption arc or rivalry.          </Text>
          <Text style={styles.aboutText}>
          In Zion City, Sam’s bounty from the Enlightened makes him a target, but his Thunder Born faction aims to harness his powers for good. His ultimate goal is to avenge his family, free Chroma, and prove his dark legacy can thunder into something heroic.          </Text>
          <Text style={styles.aboutText}>
          The Bludbruhs ended when Sam’s reliance on his dark powers—taught by Erevos and the Enlightened—fractured the group. After joining the Parliament of Justice, Sam tried to suppress his past, but a mission gone wrong unleashed his dark surge, alienating his team. Zeke, Elijah, and others left for the Monkie Alliance, seeking a path free of shadow. Sam, left with a loyal few, embraced his electrical core over his dark roots, renaming the faction Thunder Born—a rebirth symbolizing his lightning might and a break from the blood-soaked “Bludbruhs” name tied to his corrupted past.          </Text>
        </View>
      </ScrollView>

      {/* Warp Popup */}
      {isPopupVisible && (
        <Animated.View style={[styles.popup, { transform: [{ translateY: popupAnim }] }]}>
          <Text style={styles.popupText}>Would you like to warp to Melcornia?</Text>
          <View style={styles.popupButtons}>
            <TouchableOpacity style={styles.popupButton} onPress={confirmWarp}>
              <Text style={styles.popupButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupButton} onPress={cancelWarp}>
              <Text style={styles.popupButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
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
    backgroundColor: "#0a0a0a",
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
    color: "#00b3ff",
    textAlign: "center",
    flex: 1,
  },
  planetContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  planetImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    opacity: 0.8,
  },
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
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
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
    color: "#00b3ff",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  popup: {
    position: 'absolute',
    top: 0,
    left: SCREEN_WIDTH * 0.1,
    right: SCREEN_WIDTH * 0.1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 16,
    color: '#00b3ff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  popupButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  popupButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Sam;