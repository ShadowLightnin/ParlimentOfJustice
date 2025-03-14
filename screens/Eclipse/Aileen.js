import React from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Aileen = () => {
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
          <Text style={styles.title}>Ariata</Text>

          {/* Comment Button (Top Right) */}
          <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate("Comments")}>
            <Text style={styles.commentButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Armor Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/Armor/AileenPlaceHolder2.jpg")} 
            style={styles.armorImage} 
          />
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Aileen is an amazing, wonderful and caring person. Always looking out for those and helping whenever she can.
            She is very patient and understanding. She has a deep love for her family and loved ones, and for me.
            She is always there for me and everyone else, and tries her best to help and make things easier for others.
            She is a loving and patient woman, and I am proud of her. She is always there for me and I feel safe 
            and loved in return. She is my best friend and someone who I love so much and so deeply and want to always be with 
            and spend the rest of my life with her.
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
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20, // ✅ Added spacing for smooth scrolling
    backgroundColor: "#0a0a0a", // ✅ Keeps the header cohesive
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
    color: "#000000",
    textAlign: "center",
    flex: 1, // ✅ Keeps title centered
    textShadowColor: 'gold',
    textShadowRadius: 25,
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
    color: "#000000",
    textAlign: "center",
    textShadowColor: 'gold',
    textShadowRadius: 25,
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Aileen;
