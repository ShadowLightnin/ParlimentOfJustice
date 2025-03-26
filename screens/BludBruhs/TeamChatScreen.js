import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatRoom from "../../components/ChatRoom";

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Background images array
const backgroundImages = [
  require("../../assets/BackGround/Bludbruh2.jpg"),
  require("../../assets/BackGround/Monke.jpg"),
  require("../../assets/BackGround/RangerSquad.jpg"),
];

const TeamChatScreen = () => {
  const navigation = useNavigation();

  // Animation state
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [bgIndex, setBgIndex] = useState(0);

  // Background transition logic
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 10, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]).start();

      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Animated Background */}
      <Animated.Image
        source={backgroundImages[bgIndex]}
        style={[styles.background, { opacity: fadeAnim }]}
        resizeMode="cover"
      />

      {/* Transparent Overlay to Prevent Image Save */}
      <View style={styles.transparentOverlay} />

      {/* Chat Content */}
      <View style={styles.container}>
        {/* 🟢 Header as a Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.header}>Thunder Born Chat</Text>
          <Text style={styles.header}>+ Monke</Text>
        </TouchableOpacity>

        <ChatRoom chatId="ThunderBornTeamChat" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 0.4, // Slightly faded for readability
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent overlay to prevent saving
    zIndex: 1,
    pointerEvents: 'box-none' // ✅ Blocks saving but allows UI interactions
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
    width: "100%",
    height: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a5994",
    textAlign: "center",
    paddingVertical: 2, // Add padding for easier clicking
    zIndex: 2, // Ensures the text is above the background
  },
});

export default TeamChatScreen;
