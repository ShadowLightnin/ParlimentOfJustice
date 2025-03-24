import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ScreenCapture from "expo-screen-capture"; // Prevents screenshots
import { useFocusEffect } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Will = () => {
  const navigation = useNavigation();
  const [watermarkVisible, setWatermarkVisible] = useState(false);

  // Prevent Screenshots & Screen Recording
  useFocusEffect(
    React.useCallback(() => {
      const preventScreenshot = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
      };
      preventScreenshot();

      // Listen for screenshot events
      const subscription = ScreenCapture.addScreenshotListener(() => {
        setWatermarkVisible(true); // Show watermark on screenshot
        setTimeout(() => setWatermarkVisible(false), 5000); // Hide after 5 seconds
      });

      return () => {
        ScreenCapture.allowScreenCaptureAsync(); // Allow screenshots when leaving screen
        subscription.remove(); // Remove listener
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Night Hawk</Text>

          <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate("Comments")}>
            <Text style={styles.commentButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Armor Image */}
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.imageContainer}>
            <Image 
              source={require("../../assets/Armor/WillPlaceHolder.jpg")} 
              style={styles.armorImage} 
              pointerEvents="none" // Stops touch interactions
            />
            {/* Transparent Touch-Blocking Overlay */}
            <View style={styles.transparentOverlay} />
            {/* Watermark appears only when screenshot is taken */}
            {watermarkVisible && <Text style={styles.watermark}>© Parliament of Justice</Text>}
          </View>
        </TouchableWithoutFeedback>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Will is a warrior clad in the legendary NightHawk armor, designed for both agility and
            resilience. His armor is a fusion of advanced technology and ancient craftsmanship,
            making him a formidable force on the battlefield.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
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
    backgroundColor: "#0a0a0a",
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
    color: "#00b3ff",
    textAlign: "center",
    flex: 1,
  },
  commentButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
  },
  commentButtonText: {
    fontSize: 22,
    color: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#111",
    paddingVertical: 30,
    borderRadius: 20,
    position: 'relative',
  },
  armorImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.6,
    resizeMode: "contain",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the whole image
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
    zIndex: 1, // Ensures it blocks long-press but doesn’t affect buttons
  },
  watermark: {
    position: "absolute",
    bottom: 20,
    right: 10,
    color: "rgba(255, 255, 255, 0.8)", // Watermark appears on screenshot
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    padding: 5,
    borderRadius: 5,
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
    color: "#00b3ff",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Will;
