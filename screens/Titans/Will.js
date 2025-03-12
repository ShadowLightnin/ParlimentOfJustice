import React from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Will = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header Stays Fixed at the Top */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Night Hawk</Text>

        {/* Comment Button (Top Right) */}
        <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate("Comments")}>
          <Text style={styles.commentButtonText}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Armor Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/Armor/NightHawkPlaceHolder.jpg")} 
            style={styles.armorImage} 
          />
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
    backgroundColor: "#0a0a0a", // ✅ Solid cohesive background
  },
  headerContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10, // ✅ Stays on top
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
    flex: 1, // ✅ Keeps title centered
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
  scrollContainer: {
    paddingTop: SCREEN_HEIGHT * 0.12, // ✅ Prevents title overlap
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20, // ✅ Padding on the sides
    backgroundColor: "#111", // ✅ Dark background behind image
    paddingVertical: 30, // ✅ Spacing around the image
    borderRadius: 20, // ✅ Rounded edges
  },
  armorImage: {
    width: SCREEN_WIDTH * 0.9, // ✅ Centered with padding
    height: SCREEN_HEIGHT * 0.6, // ✅ Larger Image
    resizeMode: "contain",
  },
  aboutSection: {
    marginTop: 40, // ✅ Spacing between image & text
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
