import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Landing = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Start at normal size

  useEffect(() => {
    // 🚀 Animate zoom-in effect
    Animated.timing(scaleAnim, {
      toValue: 8, // Double the size
      duration: 11000, // 11 seconds
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("MontroseManorTab"); // 🌌 Transition after zoom
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Background zoom */}
      <Animated.Image
        source={require("../../../assets/Space/Space.jpg")} // Add your background image here
        style={[styles.backgroundImage, { transform: [{ scale: scaleAnim }] }]}
      />
      {/* Planet zoom */}
      <Animated.Image
        source={require("../../../assets/Space/ExoPlanet2.jpg")}
        style={[styles.planetImage, { transform: [{ scale: scaleAnim }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Prevents background from overflowing outside of the screen
  },
  backgroundImage: {
    position: "absolute", // To ensure the background is behind everything else
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ensure the background covers the screen
  },
  planetImage: {
    width: 300, // Same as MontroseManorScreen
    height: 300,
    resizeMode: "contain",
  },
});

export default Landing;
