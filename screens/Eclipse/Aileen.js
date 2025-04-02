import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const aileenImages = [
  { name: "©Ariata; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder2.jpg"), clickable: true },
  { name: "©Baybayin; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder.jpg"), clickable: true },
  { name: "©Luminara; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder3.jpg"), clickable: true },
  { name: "©Aileara; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder5.jpg"), clickable: true },
  { name: "©Nialla; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder6.jpg"), clickable: true },
  { name: "©Ailethra; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder9.jpg"), clickable: true },
  { name: "©Aishal; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder8.jpg"), clickable: true },
  { name: "©Seraphina; William Cummings", image: require("../../assets/Armor/AileenPlaceHolder7.jpg"), clickable: true, screen: "Aileenchat" },
  { name: "©Philippines Crusader; William Cummings", image: require("../../assets/Armor/AileensSymbol.jpg"), clickable: true },
];

const Aileen = () => {
  const navigation = useNavigation();
  const flashAnim = useRef(new Animated.Value(1)).current;
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // Dynamic window sizing
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // ⚡ Flashing Animation Effect for Planet
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanetPress = () => {
    navigation.navigate("WarpScreen");
  };

  const handleCardPress = (item) => {
    if (item.clickable) {
      if (item.name === "©Seraphina; William Cummings") {
        navigation.navigate("Aileenchat");
      } else {
        console.log(`${item.name} clicked`);
      }
    }
  };

  const isDesktop = windowWidth >= 768;

  const renderImageCard = (item) => (
    <TouchableOpacity
      key={item.name}
      style={[styles.card(isDesktop, windowWidth), item.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => handleCardPress(item)}
      disabled={!item.clickable}
    >
      <Image source={item.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>{item.name}</Text>
      {!item.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "EclipseHome" }],
              })
            }
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ariata</Text>
          <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}>
            <Animated.Image
              source={require("../../assets/Space/Earth_hero.jpg")}
              style={[styles.planetImage, { opacity: flashAnim }]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.7 + 20} // Adjusted for dynamic width
            decelerationRate="fast"
          >
            {aileenImages.map(renderImageCard)}
          </ScrollView>
        </View>

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
    color: "#000000",
    textAlign: "center",
    flex: 1,
    textShadowColor: "gold",
    textShadowRadius: 25,
  },
  planetContainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  planetImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    opacity: 0.8,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    paddingLeft: 15,
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9, // Adjusted for consistency with James
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: 'gold',
    borderWidth: 2,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    shadowOpacity: 0.7,
  },
  notClickable: {
    opacity: 0.8,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Changed to match James
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
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
    color: "#000000",
    textAlign: "center",
    textShadowColor: "gold",
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