import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

const Landing = () => {
  const navigation = useNavigation();
  const videoRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("MontroseManorTab"); // 🌌 Navigate to MontroseManor after video
    }, 11000); // Delay for warp effect
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../../../assets/Landing.mp4")} 
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false} // Only play once
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
  },
  video: {
    width: "100%",
    height: "100%",
  }
});

export default Landing;
