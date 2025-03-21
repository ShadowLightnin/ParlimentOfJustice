import React from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Sam = () => {
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
          <Text style={styles.title}>Void Walker</Text>

          {/* Comment Button (Top Right) */}
          <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate("Comments")}>
            <Text style={styles.commentButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Armor Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/Armor/SamPlaceHolder.jpg")} 
            style={styles.armorImage} 
          />
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Early life: Once a young naive teenager that eventually 
          embarked on an adventure to another world in a dark mansion 
          realized his true potential and destiny.
          </Text>
          <Text style={styles.aboutText}>
          Recent Past: The mansion corrupted his mind and gave him 
          strange powers over darkness and electricity. Later after 
          seeing his masters ideals as evil he joined the Parliament of Justice 
          and created the BludBruhs faction. While forgoing his dark past he still 
          held on to the powers he was taught. And a love for Chroma who he met when
          he was still a follower of Erevos. Chroma was still corrupted in the shroud 
          of the evil ones.          
          </Text>
          <Text style={styles.aboutText}>
          Present: Still extremely conflicted, he caused a rift within the 
          BludBruhs causing many to leave him to join a new faction, The Monke 
          Alliance. A large bounty was on Sam once he left the evil Enlightened.            
          </Text>
          <Text style={styles.aboutText}>
          Motives: Wants to use dark powers he learned from the Enlightened 
          but the Monke Alliance is against it.          
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

export default Sam;
