import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Array of Aileen-related images (replace with your actual image paths)
const aileenImages = [
  { name: "", image: require("../../assets/Armor/AileenPlaceHolder2.jpg"), clickable: true },
  { name: "", image: require("../../assets/Armor/AileenPlaceHolder.jpg"), clickable: true }, // Example placeholder
  { name: "", image: require("../../assets/Armor/AileenPlaceHolder3.jpg"), clickable: true }, // Example placeholder
  // Add more images here as needed
];

const Aileen = () => {
  const navigation = useNavigation();
  const flashAnim = useRef(new Animated.Value(1)).current;
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

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

  // Update window width on resize
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // 🌌 Planet Click Handler → Leads to Warp Screen
  const handlePlanetPress = () => {
    navigation.navigate("WarpScreen"); // 🔄 Navigate to WarpScreen
  };

  // Determine if it's desktop or mobile based on width (768px breakpoint)
  const isDesktop = windowWidth >= 768;

  // Render each image card
  const renderImageCard = (item) => (
    <TouchableOpacity
      key={item.name}
      style={[styles.card(isDesktop, windowWidth), item.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => item.clickable && console.log(`${item.name} clicked`)} // Replace with navigation if needed
      disabled={!item.clickable}
    >
      <Image source={item.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>{item.name}</Text>
      {!item.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "EclipseHome" }], // ✅ Clean navigation flow
              })
            }
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Ariata</Text>

          {/* 🌍 Planet Icon (Clickable) */}
          <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}>
            <Animated.Image
              source={require("../../assets/Space/Earth_hero.jpg")}
              style={[styles.planetImage, { opacity: flashAnim }]}
            />
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll for Images */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {aileenImages.map(renderImageCard)}
          </ScrollView>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Aileen is an amazing, wonderful and caring person. Always looking out for those and helping whenever she can.
            She is very patient and understanding. She has a deep love for her family and loved ones, and for me.
            She is always there for me and everyone else, and tries her best to help and make things easier for others.
            She is a loving and patient woman, and I am proud of her. She is always there for me and I feel safe 
            and loved in return. She is my best friend and someone who I love so much and so deeply and want to always be with 
            and spend the rest of my life with her.
          </Text>
        </View>
      </ScrollView>
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
    color: "#000000",
    textAlign: "center",
    flex: 1,
    textShadowColor: "gold",
    textShadowRadius: 25,
  },
  planetContainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "transparent", // ✅ Fully transparent background
  },
  planetImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    opacity: 0.8, // ✅ Slight transparency for a cool effect
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : windowWidth * 0.7, // 40% on desktop, 70% on mobile
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6, // Slightly taller on mobile
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderColor: 'gold',
    borderWidth: 2,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    shadowOpacity: 0.7,
  },
  notClickable: {
    opacity: 0.8,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
    color: "#000000",
    textAlign: "center",
    textShadowColor: "gold",
    textShadowRadius: 25,
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Aileen;