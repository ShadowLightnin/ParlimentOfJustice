import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Myran = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [currentSound, setCurrentSound] = useState(null);

  // Audio handling
  // useEffect(() => {
  //   const playTechnoGuardSong = async () => {
  //     if (currentSound) {
  //       await currentSound.stopAsync();
  //       await currentSound.unloadAsync();
  //     }

  //     const { sound } = await Audio.Sound.createAsync(
  //       require("../../assets/audio/TechnoGuardTribute.mp3"),
  //       { shouldPlay: true, isLooping: false, volume: 1.0 }
  //     );
  //     setCurrentSound(sound);
  //     await sound.playAsync();
  //   };

  //   playTechnoGuardSong();

  //   return () => {
  //     if (currentSound) {
  //       currentSound.stopAsync();
  //       currentSound.unloadAsync();
  //     }
  //   };
  // }, []);

  // Responsive width handling
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Stop audio before navigating back
  const handleBackPress = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
    }
    navigation.goBack();
  };

  const isDesktop = windowWidth >= 768;

  const armors = [
    { name: "Cyber", image: require("../../assets/Armor/Myran.jpg"), clickable: true },
  ];

  const kids = [
    { name: "Lucas", image: require("../../assets/Armor/Lucas2.jpg"), clickable: true },
  ];

  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={`${armor.name}-${armor.image}`}
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || 'Unknown'}; William Cummings
      </Text>
      {!armor.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  const renderKidCard = (kid) => (
    <TouchableOpacity
      key={`${kid.name}-${kid.image}`}
      style={[styles.kidCard(isDesktop, windowWidth), kid.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => kid.clickable && console.log(`${kid.name} clicked`)}
      disabled={!kid.clickable}
    >
      <Image source={kid.image} style={styles.kidImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.kidCardName}>
        © {kid.name || 'Unknown'}; William Cummings
      </Text>
      {!kid.clickable && <Text style={styles.kidDisabledText}> </Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Cyber</Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH * 0.7 + 20}
            decelerationRate="fast"
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        <View style={styles.kidsContainer}>
          <Text style={styles.kidsHeader}>First Born</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.35 + 20}
            decelerationRate="fast"
          >
            {kids.map(renderKidCard)}
          </ScrollView>
        </View>

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Myran Webb, known as Techno Guard, is a brilliant innovator and steadfast protector, the husband of Jennifer McNeil “Kintsugi” and a vital member of The Eclipse, the Titans’ significant others within the Parliament of Justice. His presence is both cerebral and commanding, a fusion of technological mastery and unshakable loyalty that makes him a cornerstone for his wife and her family. Behind his high-tech armor, Myran is analytical, supportive, and deeply committed to Jennifer, seeing her brokenness as a strength he amplifies with his own ingenuity. He extends this devotion to the Titans—Spencer, Jared, William, Emma, Ben, and Azure—and their partners, using his gadgets and intellect to safeguard their mission. Off the battlefield, he’s a thinker and a tinkerer, often found upgrading his tech or strategizing with Jennifer, but his reliance on technology sometimes blinds him to simpler solutions.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Myran grew up in Zion City’s Terrestrial sector, in a family of engineers and inventors who thrived on the edge of the Celestial sector’s advancements. From a young age, he was fascinated by technology’s potential to solve problems, inspired by futuristic heroes and the promise of a better world. His natural talent for data analysis and gadgetry set him apart, but it was his encounter with Jennifer McNeil that shaped his path.
          </Text>
          <Text style={styles.aboutText}>
            Myran met Jennifer during a chaotic raid from the Outer Darkness sector, where her healing saved his life after he was injured defending civilians. Her Kintsugi armor—cracked yet mended with gold—captivated him, and he saw in her a beauty born from resilience. As they grew closer, Myran developed his Techno Guard armor to complement her abilities, using his techno-telekinesis to protect her and her family. Their marriage became a partnership of heart and mind, with Myran’s tech enhancing Jennifer’s healing and her compassion grounding his intellect.
          </Text>
          <Text style={styles.aboutText}>
            Joining The Eclipse, Myran aligned with the significant others of the Titans—Kelsie (Jared’s wife), James (Azure’s husband), and Aileen (William’s girlfriend)—to support their mission. He felt the weight of Jennifer’s fallen state and Spencer’s lost leadership, but saw an opportunity to bolster the Titans with his innovations. His connection to the broader Parliament of Justice—strategists like William and defenders like Ben—strengthens him, but he struggles with the chaos of Zion City’s lower sectors, relying on his tech to impose order.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Myran’s suit and technological prowess grant him a range of powers focused on control, defense, and support, reflecting his role as a sentinel:
          </Text>
          <Text style={styles.aboutText}>
            Techno-Telekinesis: Can manipulate technology with his mind, controlling gadgets, drones, and machinery within a limited range. This allows him to disarm enemies, redirect projectiles, or enhance allies’ equipment on the fly.
          </Text>
          <Text style={styles.aboutText}>
            Data Analysis: Processes information at superhuman speed, interpreting battlefield data, enemy patterns, and ally statuses to formulate strategies instantly, making him a tactical linchpin.
          </Text>
          <Text style={styles.aboutText}>
            Techno-Shielding: Generates energy shields from his armor, powered by nanotech, to protect himself and others. These shields can be shaped or expanded, often used to guard Jennifer during her healing.
          </Text>
          <Text style={styles.aboutText}>
            Holographic Projections: Creates realistic illusions or decoys to distract enemies or deceive them, drawing on his HUD to craft visuals that support the Titans’ plans.
          </Text>
          <Text style={styles.aboutText}>
            Energy Emission: Projects energy blasts from his gauntlets or emitters, used for offense or propulsion, balancing his defensive focus with combat utility.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Myran is the intellect and tech support of The Eclipse, complementing Jennifer’s healing with his defensive and strategic abilities. He’s methodical, supportive, and deeply in love with Jennifer, seeing her Kintsugi nature as a perfect match for his own precision. His relationship with Jennifer is one of mutual reliance—he bolsters her resilience with tech, while she softens his analytical edge with empathy. His children, Lila and Hope, inspire his creations, their memory and promise driving him to safeguard his family’s future.
          </Text>
          <Text style={styles.aboutText}>
            Among The Eclipse, Myran collaborates with Kelsie’s agility, James’s calm, and Aileen’s strength, forming a cohesive support unit for the Titans. He respects Spencer’s power but shares Jared’s view on progress, often working with William (Night Hawk) on tech upgrades. His cousins-in-law—Ben, Azure, Emma—rely on his shields and holograms, while he draws inspiration from their diversity.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, Myran bridges the Titans and their allies, coordinating with tech-savvy members like William and strategists like Todd (Cummings). His ultimate goal is to protect Zion City’s future alongside Jennifer, proving that technology and heart can mend a fractured world, while ensuring his wife and their children’s legacy—Lila’s memory and Hope’s promise—shine eternal.
          </Text>
        </View> */}
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
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
    paddingLeft: 15,
  },
  kidsContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
  },
  kidsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00b3ff",
    textAlign: "center",
    marginBottom: 10,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  kidCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.15 : SCREEN_WIDTH * 0.45,
    height: isDesktop ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.35,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: "#00b3ff",
  },
  notClickable: {
    opacity: 0.8,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  kidImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  kidCardName: {
    position: "absolute",
    bottom: 5,
    left: 5,
    fontSize: 12,
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
  kidDisabledText: {
    fontSize: 10,
    color: "#ff4444",
    position: "absolute",
    bottom: 15,
    left: 5,
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

export default Myran;