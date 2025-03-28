import React, { useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  ImageBackground,
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const EvilSam = () => {
  const navigation = useNavigation();
  const flashAnim = useRef(new Animated.Value(1)).current;
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.8 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6;


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

  // 🌌 Planet Click Handler → Leads to Warp Screen
  const handlePlanetPress = () => {
    navigation.navigate("WarpScreen"); // 🔄 Navigate to WarpScreen
  };

  return (
    <ImageBackground
    source={require("../../../assets/BackGround/Enlightened.jpg")}
    style={styles.background}
  >
      <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: "VillainsTab" }]  // ✅ Clean navigation flow
            })}
        >
            <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>
          <Text style={styles.title}>Void Walker (Evil Edition)</Text>

        {/* 🌍 Planet Icon (Clickable) */}
        {/* <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}> */}
          <Animated.Image 
            source={require("../../../assets/Space/ExoPlanet.jpg")}
            style={[styles.planetImage, { opacity: flashAnim }]}
          />
        {/* </TouchableOpacity> */}
        </View>

        {/* Armor Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../../assets/Armor/SamPlaceHolder2.jpg")} 
            style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
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
  commentButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
  },
  commentButtonText: {
    fontSize: 22,
    color: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  //   backgroundColor: "#111",
    paddingVertical: 30,
    borderRadius: 20,
  },
  armorImage: {
    resizeMode: "contain",
  },
  planetContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'transparent' // ✅ Fully transparent background
  },
  planetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.8  // ✅ Slight transparency for a cool effect
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

export default EvilSam;
