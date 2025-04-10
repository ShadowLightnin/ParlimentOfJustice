import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Landing = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Start at normal size
  const translateXAnim = useRef(new Animated.Value(0)).current; // For horizontal movement
  const translateYAnim = useRef(new Animated.Value(0)).current; // For vertical movement
  const rotateAnim = useRef(new Animated.Value(0)).current; // For rotation (angle)

  useEffect(() => {
    // 🚀 Animate zoom-in effect with angle and position
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 4, // Reduced zoom to prevent going off-screen (adjust as needed)
        duration: 4000, // Slightly shorter duration to transition earlier
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: -SCREEN_WIDTH * 0.2, // Move right towards bottom left (corrected)
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: SCREEN_HEIGHT * 0.2, // Move down towards bottom
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 45, // Rotate 45 degrees for angle
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        navigation.replace("MontroseManorTab"); // Transition when animation completes
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Full Screen Background Image (Only Melcornia3) */}
      <Animated.Image
        source={require("../../../assets/Space/Melcornia2.jpg")}
        style={[
          styles.backgroundImage,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: translateXAnim },
              { translateY: translateYAnim },
              { rotate: rotateAnim.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }) },
            ],
          },
        ]}
      />

      {/* Transparent Touch-Blocking Overlay */}
      <View style={styles.transparentOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Prevents elements from overflowing
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ensures full screen coverage
    zIndex: -1, // Behind overlay
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the whole screen
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
    zIndex: 0, // Above background
  },
});

export default Landing;