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

const Jennifer = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [currentSound, setCurrentSound] = useState(null);

  // Audio handling
  // useEffect(() => {
  //   const playKintsugiSong = async () => {
  //     if (currentSound) {
  //       await currentSound.stopAsync();
  //       await currentSound.unloadAsync();
  //     }

  //     const { sound } = await Audio.Sound.createAsync(
  //       require("../../assets/audio/KintsugiTribute.mp3"),
  //       { shouldPlay: true, isLooping: false, volume: 1.0 }
  //     );
  //     setCurrentSound(sound);
  //     await sound.playAsync();
  //   };

  //   playKintsugiSong();

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
    { name: "Kintsugi", image: require("../../assets/Armor/Jennifer2.jpg"), clickable: true },
    { name: "Kintsugi", image: require("../../assets/Armor/Jennifer.jpg"), clickable: true },
    { name: "Kintsugi", image: require("../../assets/Armor/Jennifer3.jpg"), clickable: true },
    { name: "Kintsugi", image: require("../../assets/Armor/Jennifer4.jpg"), clickable: true },
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
          <Text style={styles.title}>Kintsugi</Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH * 0.7 + 20}
            decelerationRate="fast"
            contentOffset={{ x: (SCREEN_WIDTH - (SCREEN_WIDTH * 0.7)) / 2 - 10, y: 0 }}
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

        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Jennifer McNeil, known as Kintsugi, is the middle child of the McNeil siblings and a vital member of the Titans within the Parliament of Justice, a woman who has been shattered by loss but reborn stronger through her pain. At 5'8", her presence is both delicate and resolute, her cracked yet golden-mended armor a testament to her resilience. Behind her serene demeanor lies a soul that has fallen from grace, much like her brother Spencer, but where he struggles with nostalgia, Jennifer finds strength in acceptance and healing. She’s married to Myran, whose technological prowess complements her own abilities, and she’s deeply devoted to her brothers, Spencer and Jared, as well as her cousins Ben, Azure, Will, and Emma. Jennifer prefers to mend rather than destroy, drawing inspiration from the beauty of imperfection, but her fallen state leaves her questioning her own worth. Off the battlefield, she’s a nurturer, often found tending to her family’s emotional wounds or crafting art that reflects her journey.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Jennifer grew up in the same rugged village as her brothers Spencer and Jared, the middle sibling in a family defined by strength and faith. While Spencer led with power and Jared with speed, Jennifer was the heart of the family, her compassion and creativity setting her apart. She was inspired by stories of redemption and renewal, particularly the idea of Kintsugi—turning brokenness into something beautiful with gold. This philosophy became her lifeline when tragedy struck.
          </Text>
          <Text style={styles.aboutText}>
            During a devastating raid on their village from Zion City’s Outer Darkness sector, Jennifer witnessed the destruction of everything she held dear—homes burned, families scattered, and her brothers pushed to their limits. In the chaos, she discovered her ability to heal, but the trauma left her spiritually and emotionally broken. Her armor, once pristine, cracked under the weight of her grief, but she refused to let it define her. Drawing on her faith and the support of her brothers and cousins, she mended her armor with gold, embracing her flaws as part of her strength.
          </Text>
          <Text style={styles.aboutText}>
            As a Titan, Jennifer stood alongside Spencer and Jared, using her healing to protect their family, including the Briggs (Ben and Azure), Cummings (Will and Emma), and other oldest cousins. But as Zion City’s corruption grew, so did her sense of failure. She felt responsible for not preventing Spencer’s fall or easing Jared’s burden, and her own confidence wavered. Married to Myran, a techno-savvy ally, Jennifer found a partner who helped her see the beauty in her brokenness, but her fallen state—mirrored by Spencer’s—continues to haunt her. Her Kintsugi armor became a symbol of hope, but also a reminder of how far she’s fallen from the healer she once was.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Jennifer’s suit and innate compassion grant her a range of powers focused on healing, protection, and resilience, reflecting her Kintsugi theme:
          </Text>
          <Text style={styles.aboutText}>
            Healing Touch: Can mend physical and emotional wounds, restoring health and morale to allies. Her touch leaves a golden glow, symbolizing renewal, but it drains her when she overextends herself.
          </Text>
          <Text style={styles.aboutText}>
            Golden Resilience: Her cracked, gold-mended armor absorbs damage and redistributes it as protective energy, making her surprisingly durable despite her fragility. The gold seams glow brighter under stress, enhancing her defenses.
          </Text>
          <Text style={styles.aboutText}>
            Empathic Connection: Can sense the pain and needs of others, allowing her to prioritize healing where it’s most needed, but this also makes her vulnerable to their despair.
          </Text>
          <Text style={styles.aboutText}>
            Light Projection: Can emit soft, golden light to soothe allies, dispel darkness (literal and metaphorical), and disorient enemies, drawing from The Imagined’s creative energy.
          </Text>
          <Text style={styles.aboutText}>
            Restorative Aura: Creates a field around herself that accelerates recovery for her family and teammates, but it weakens if her own resolve falters.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Jennifer is the heart of the Titans, a healer and mediator who tries to mend the fractures within her family and team. Like Spencer, she’s fallen from grace, but where he clings to the past, she embraces her brokenness as a source of strength. Her relationship with Spencer is tender but tense—he sees her as a reminder of what he’s lost, while she sees him as a project to heal. With Jared, she’s protective, worried about the pressure he faces as Spencer’s successor, but she also admires his drive.
          </Text>
          <Text style={styles.aboutText}>
            As the middle sibling, Jennifer feels a responsibility to her cousins—Ben and Azure (Briggs), Will and Emma (Cummings)—and the broader family, often acting as their emotional anchor. Her marriage to Myran strengthens her, as he helps her see the beauty in her flaws, but her fallen state leaves her questioning whether she can truly lead or heal as she once did. Her children, Lila and Hope, fuel her resolve, their memory and promise guiding her to protect and nurture her family.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, Jennifer works closely with healers like Angela (Cummings) and Emily (Jensen), drawing on their shared nurturing instincts, while her Kintsugi armor inspires hope in allies like Todd (Cummings) and Mary (McNeil). Her ultimate goal is to restore balance to Zion City and her family, proving that even the most broken can shine with gold, just as her love for Lila and Hope shines eternal.
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

export default Jennifer;