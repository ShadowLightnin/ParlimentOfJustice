import React from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ShadeWeaverScreen = () => {
  const navigation = useNavigation();
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.6;

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Villains.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Shade Weaver</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/ShadeWeaver.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
            {/* Transparent Overlay for Image Protection */}
            <View style={styles.transparentOverlay} />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            • Nemesis: Kelsie Tidwell "Shutter Dancer"

            </Text>
            <Text style={styles.aboutText}>
            • Backstory: Formerly a famous street dancer and acrobat named Lydia Noir, Shade Weaver grew up in the spotlight, adored for her artistry with light and shadow. However, a terrible accident left her disfigured, and she discovered her shadow manipulation abilities in the recovery period. Consumed by bitterness, she learned to control darkness, seeing it as her true ally after the world “rejected” her. Shade Weaver despises Kelsie, whose light-based powers embody everything Lydia once loved but believes betrayed her. She sees herself as a reminder of Kelsie’s fears, aiming to prove that light is fleeting and only darkness is constant.

            </Text>
            <Text style={styles.aboutText}>
            • Abilities:
• Umbrakinesis: Controls and manipulates darkness to obscure light.
• Shadow Cloak: Becomes intangible and can blend perfectly into shadows, making her nearly invisible.
• Dark Pulse: Emits waves of darkness that dispel light, negating Kelsie's illusions and blinding bursts.

            </Text>
            <Text style={styles.aboutText}>
            • Weapon: Dual shadowed daggers that dissipate into mist, allowing her to strike from unexpected angles.

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
    color: "#ff3131",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#111",
    paddingVertical: 30,
    borderRadius: 20,
    position: "relative", // Required for overlay
  },
  armorImage: {
    resizeMode: "contain",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent for visual but clickable
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
    color: "#ff3131",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ShadeWeaverScreen;
