import React, { useState, useEffect } from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Array of Sable-related images (replace with your actual image paths)
const sableImages = [
  { name: "Sable", image: require("../../../assets/Villains/Sable.jpg"), clickable: true },
  { name: "Sable Shadow", image: require("../../../assets/Villains/Sable2.jpg"), clickable: true }, // Example placeholder
  // Add more images here as needed
];

const SableScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  // Update window width on resize
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

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
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background(windowWidth, SCREEN_HEIGHT)}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Sable the Assassin</Text>
          </View>

          <View style={styles.imageContainer}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={true}
            >
              {sableImages.map(renderImageCard)}
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
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: (width, height) => ({
    width: width,
    height: height,
    resizeMode: "cover",
  }),
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
    // backgroundColor: "#111",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.4 : windowWidth * 0.7, // 40% on desktop, 70% on mobile
    height: isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.6, // Slightly taller on mobile
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
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