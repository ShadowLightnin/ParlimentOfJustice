import React from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ElderPyrrhusScreen = () => {
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
            <Text style={styles.title}>Elder Pyrrhus</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/ElderPyrrhus.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            • Nemesis: Spencer McNeil "Annihilus”

            </Text>
            <Text style={styles.aboutText}>
            • Backstory: A former tribal leader cast out for his brutal interpretation of strength, Elder Pyrrhus believes only the ruthless survive. He scorned modern society, retreating into the wilderness where he honed his powers through a brutal connection with ancient mountain spirits. These spirits grant him immense strength and the power to manipulate fire, making him nearly invulnerable in battle. When he hears of Spencer’s Annihilus persona, Elder Pyrrhus sees a potential challenger for his title as the ultimate warrior. His fiery skull helmet represents his intent to incinerate Spencer’s ideals of heroism, proving that true power lies in destruction without restraint.

            </Text>
            <Text style={styles.aboutText}>

            </Text>
            <Text style={styles.aboutText}>

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
  
export default ElderPyrrhusScreen;
