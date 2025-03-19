import React from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const StormshadeScreen = () => {
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
            <Text style={styles.title}>Stormshade</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/Stormshade.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            A former ally turned enemy, Varak was a powerful 
            psychic who could manipulate shadows and storms. 
            Left isolated in a hostile dimension, he honed his 
            skills and gained control over both shadow and electric 
            energy, making him a deadly threat to the Bludbruhs. 
            Varak views the Bludbruhs’ power as an affront to his 
            control and wants to dominate them, seeing them as 
            potential soldiers in his growing dark empire.            
            </Text>
            <Text style={styles.aboutText}>
            • Abilities and Gear:

            </Text>
            <Text style={styles.aboutText}>
            • Shadow and Storm Manipulation: Can create electrical storms within shadows, summoning bolts of dark lightning that paralyze and drain energy.

            </Text>
            <Text style={styles.aboutText}>
            • Mind Control: Possesses powerful telepathic skills, able to dominate weaker minds or distract powerful ones like Sam.

            </Text>
            <Text style={styles.aboutText}>
            • Invisibility and Cloaking: Disappears into shadows and can instantly phase out of sight.

            </Text>  
            <Text style={styles.aboutText}>
            • Shadow Blade: A weapon forged from darkness itself, able to cut through most known armor types.

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
  
export default StormshadeScreen;
