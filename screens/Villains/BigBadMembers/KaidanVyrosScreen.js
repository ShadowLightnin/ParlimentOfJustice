import React from "react";
import { 
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const KaidanVyrosScreen = () => {
  const navigation = useNavigation();
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.6;

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/BigBad.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Kaidan Vyros</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/KaidanVyros.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            Once an elite soldier in a rival faction, 
            Kaidan Vyros was betrayed by his own leaders and 
            left to die on a hostile planet filled with colossal 
            monsters. Surviving in isolation, he adapted, hunting creatures 
            far more dangerous than any human. His armor is now fused with 
            alien scales and energy-absorbing plating, giving him monstrous 
            strength and a near-psychic bond with beasts he’s tamed. Now, he 
            seeks to turn his survival instincts and creature-taming abilities 
            against the Spartans who embody everything he once believed in but 
            now despises.            
            </Text>
            <Text style={styles.aboutText}>
            • Abilities and Gear:

            </Text>
            <Text style={styles.aboutText}>
            • Monstrous Armor: A blend of Halo armor and Monster Hunter beast plating that can withstand extreme damage and emit a fear-inducing energy.

            </Text>
            <Text style={styles.aboutText}>
            • Beast Summoning: Can call upon otherworldly creatures, like a dark, mutated Hydra that attacks in sync with him.

            </Text>
            <Text style={styles.aboutText}>
            • Crushing Strength: Enhanced strength rivaling even the strongest Spartans, allowing him to overpower foes.

            </Text>  
            <Text style={styles.aboutText}>
            • Energy Pulse Cannon: Wielding a shoulder-mounted cannon that fires concentrated energy pulses, capable of shattering defenses.

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
    },
    armorImage: {
      resizeMode: "contain",
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
  
export default KaidanVyrosScreen;
