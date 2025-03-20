import React from "react";
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ObsidianScreen = () => {
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
            <Text style={styles.title}>Obsidian</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/Obsidian.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            The Titan’s Big Bad
            </Text> 
            <Text style={styles.aboutText}>
            Known once as the ancient conqueror King Ordax, 
            Obsidian Thrall was resurrected by cosmic forces 
            after his kingdom was lost to time. Now, he wields 
            powers granted by an otherworldly darkness, allowing 
            him to manipulate the minds and fears of his enemies. 
            Obsessed with power and the corruption of ideals, 
            he sees the Titans’ sense of duty as foolish idealism. 
            He travels across dimensions, seeking to “liberate” warriors 
            from their codes and morals, converting them into his “thralls.” 
            His ultimate goal is to make the Titans question their own beliefs, 
            forcing them to confront the darkness within themselves.
            </Text>
            <Text style={styles.aboutText}>
            • Powers and Abilities:

            </Text>
            <Text style={styles.aboutText}>
            • Shadow Manipulation: Can summon and control darkness to envelop his enemies or distort reality.

            </Text>
            <Text style={styles.aboutText}>
            • Fear Induction: Forces his foes to face their deepest fears, using illusions that seem frighteningly real.

            </Text>
            <Text style={styles.aboutText}>
            • Mind Control: Turns others into his loyal thralls, erasing their memories and sense of self.

            </Text>  
            <Text style={styles.aboutText}>
            • Ancient Weaponry: Wields a cursed scythe imbued with dark energy that siphons strength from those it cuts, feeding his powers.

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
      color: "purple",
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
      color: "purple",
      textAlign: "center",
    },
    aboutText: {
      fontSize: 16,
      color: "#fff",
      textAlign: "center",
      marginTop: 10,
    },
  });
  
export default ObsidianScreen;
