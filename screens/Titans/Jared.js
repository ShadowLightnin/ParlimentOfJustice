import React from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Jared = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header (Now Scrolls with Everything) */}
        <View style={styles.headerContainer}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Spector</Text>

          {/* Comment Button (Top Right) */}
          <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate("Comments")}>
            <Text style={styles.commentButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Armor Image with Transparent Overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/Armor/JaredPlaceHolder.jpg")} 
            style={styles.armorImage} 
          />
          {/* Transparent Overlay */}
          <View style={styles.transparentOverlay} />
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Jared is a warrior clad in the legendary Spector armor, designed for both agility and
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
    position: 'relative', // Required for overlay positioning
  },
  armorImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.6,
    resizeMode: "contain",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire image
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
    zIndex: 1, // Ensures it blocks long-press but doesn’t affect buttons
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

export default Jared;
