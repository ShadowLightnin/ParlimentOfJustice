import React from "react";
import { View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const UmbraNexScreen = () => {
  const navigation = useNavigation();
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.9 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.6;

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
            <Text style={styles.title}>Umbra Nex</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/UmbraNex.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
             <Text style={styles.aboutText}>
             The Eclipse’s Big Bad
             </Text> 
            <Text style={styles.aboutText}>
            Umbra Nex was a cosmic entity from a parallel 
            universe who once ruled a race of dark beings but 
            was overthrown and banished by his own creations. 
            Stranded in the Eclipse’s universe, Umbra Nex has 
            one objective: to rebuild his empire by absorbing 
            the life forces of other worlds. He sees Eclipse as 
            a flawed team and a stepping stone to proving his 
            superiority, intending to siphon their powers to 
            elevate himself to godhood. Each member of Eclipse 
            represents, in his eyes, a unique type of strength to harvest and consume.            
            </Text>
            <Text style={styles.aboutText}>
            • Powers and Abilities:

            </Text>
            <Text style={styles.aboutText}>
            • Life Force Absorption: Steals energy and powers from his victims, adding them to his own and sometimes even gaining a distorted version of their abilities.

            </Text>
            <Text style={styles.aboutText}>
            • Reality Warping: Twists the physical and metaphysical properties of his surroundings, creating mind-bending environments.

            </Text>
            <Text style={styles.aboutText}>
            • Resurrection: Can resurrect the fallen as shadow versions of themselves, loyal to him alone.

            </Text>  
            <Text style={styles.aboutText}>
            • Temporal Distortion: Alters the flow of time, trapping his enemies in time loops or accelerating his own movements.

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
  
export default UmbraNexScreen;
