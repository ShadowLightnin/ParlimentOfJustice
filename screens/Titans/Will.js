import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, AppState, Platform 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Will = () => {
  const navigation = useNavigation();
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") return; // Fix for desktop crash

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 3000); // Remove blur after 3s
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

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

        {/* Armor Image with Blur Protection */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/Armor/WillPlaceHolder.jpg")} 
            style={styles.armorImage} 
          />
          {isBlurred && Platform.OS !== "web" && ( // Only show blur on mobile
            <BlurView intensity={90} style={styles.blurOverlay}>
              <Text style={styles.watermarkText}>Screenshot Blocked</Text>
            </BlurView>
          )}
        </View>

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
    position: "relative",
  },
  armorImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.6,
    resizeMode: "contain",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  watermarkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
