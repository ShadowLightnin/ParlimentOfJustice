import React from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const LumielScreen = () => {
  const navigation = useNavigation();
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.6;

  return (
    <ImageBackground
      source={require("../../../assets/Armor/LumielAngel.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Lumiel</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Armor/LumielPhantom.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
            {/* Transparent Overlay for Image Protection */}
            <View style={styles.transparentOverlay} />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            “No, I am a physical memory of what I once was, I am the life blood of the Mansion you see before you.”
            </Text>
            <Text style={styles.aboutText}>
            “It is my duty to protect all mortals in Melcornia. I created the Mansion as a sanctuary for a lost family that was stranded here long ago. The Mansion would protect them from the creatures on this planet. Until the demons came and stole the Mansion from me and defiled it. I was once an angel of light, but the grief and sadness of my failure to protect the Montrose family withered away my magnificence."
            </Text>
            <Text style={styles.aboutText}>
            “My name was in a tongue mortals would not understand. In your tongue it would sound something like… Lumiel.”
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
    color: "#585656",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    position: 'relative', // Required for overlay positioning
  },
  armorImage: {
    resizeMode: "contain",
    opacity: 0.5,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Ensures overlay is on top without blocking buttons
  },
  aboutSection: {
    marginTop: 40,
    padding: 20,
    borderRadius: 15,
  },
  aboutHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#585656",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LumielScreen;
