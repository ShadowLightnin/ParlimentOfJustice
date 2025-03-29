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
let backgroundSound = null; // Explicitly initialize as null
const MUSIC_LOOP = false; // Set this to true if you want music to loop

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
    // Cleanup only on full unmount, not focus loss
    return () => {
      console.log("Sam component fully unmounting at:", new Date().toISOString());
      // Do not stop music here - let it persist to WarpScreen
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
    navigation.pop();
  };

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

          {/* 🌍 Planet Icon (Clickable) */}
          <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}>
            <Animated.Image 
              source={require("../../assets/Space/ExoPlanet2.jpg")}
              style={[styles.planetImage, { opacity: flashAnim }]}
            />
          </TouchableOpacity>
        </View>

        {/* Armor Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/Armor/SamPlaceHolder.jpg")} 
            style={styles.armorImage} 
          />
          <View style={styles.transparentOverlay} />
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Early life: Once a young naive teenager that eventually 
            embarked on an adventure to another world in a dark mansion 
            realized his true potential and destiny.
          </Text>
          <Text style={styles.aboutText}>
            Recent Past: The mansion corrupted his mind and gave him 
            strange powers over darkness and electricity. Later after 
            seeing his master's ideals as evil, he joined the Parliament of Justice 
            and created the BludBruhs faction. While forgoing his dark past, he still 
            held on to the powers he was taught — and a love for Chroma, whom he met when
            he was still a follower of Erevos.
          </Text>
        </View>
      </ScrollView>

      {/* Warp Popup */}
      {isPopupVisible && (
        <Animated.View style={[styles.popup, { transform: [{ translateY: popupAnim }] }]}>
          <Text style={styles.popupText}>Would you like to warp to Montrose?</Text>
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

// Styles remain unchanged
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
    marginVertical: 20,
    backgroundColor: 'transparent'
  },
  planetImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    opacity: 0.8
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#111",
    paddingVertical: 30,
    borderRadius: 20,
    position: 'relative',
  },
  armorImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.6,
    resizeMode: "contain",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, 
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