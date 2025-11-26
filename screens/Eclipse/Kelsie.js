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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Kelsie = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  const armors = [
    { name: "Shutter Dancer", image: require("../../assets/Armor/Kelsie.jpg"), clickable: true },
    { name: "Eliptic Dancer", image: require("../../assets/Armor/Kelsie2.jpg"), clickable: true },
  ];

  const kids = [
    { name: "Gracie", image: require("../../assets/Armor/Gracie.jpg"), clickable: true },
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Eliptic Dancer</Text>
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
          <Text style={styles.kidsHeader}>Children</Text>
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
            Kelsie Tidwell, known as Shutter Dancer, is a luminous blend of grace and power, the wife of Jared McNeil “Spector” and a vital member of The Eclipse within the Parliament of Justice. Her presence is both captivating and elusive, a dance of light and shadow that dazzles allies and confounds enemies. Behind her shimmering armor, Kelsie is artistic, quick-witted, and fiercely supportive of Jared, her speed-loving husband, seeing their partnership as a perfect rhythm of motion and light. She extends this loyalty to the Titans—Spencer, Jennifer, William, Emma, Ben, and Azure—and their partners in The Eclipse, using her photokinetic abilities to illuminate their path. Off the battlefield, she’s a performer and a memory-keeper, often choreographing light displays or recalling details to aid her family, but her flair for the dramatic can sometimes overshadow practical needs.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Kelsie grew up in Zion City’s Terrestrial sector, in a family of artists and performers who thrived on creativity and expression. From a young age, she was drawn to dance and light, inspired by the interplay of shadows and colors in the city’s fractured skyline. Her natural agility and photographic memory set her apart, but it was her encounter with Jared McNeil that ignited her true potential.
          </Text>
          <Text style={styles.aboutText}>
            Kelsie met Jared during a scouting mission gone wrong, where his super speed saved her from an ambush in the Telestial sector. His rapid movements sparked her imagination, and she countered with a burst of light that blinded their attackers, revealing her latent photokinetic powers. Their connection grew into love, and Kelsie crafted her Shutter Dancer suit to complement Jared’s speed, using light to enhance his strikes and cover his retreats. Their marriage became a partnership of agility and artistry, with Kelsie’s grace balancing Jared’s intensity.
          </Text>
          <Text style={styles.aboutText}>
            Joining The Eclipse, Kelsie aligned with the significant others of the Titans—Myran (Jennifer’s husband), James (Azure’s husband), and Aileen (William’s girlfriend)—to support their mission. She felt the strain of Spencer’s fallen leadership and Jared’s burden as a potential successor, but saw an opportunity to lift their spirits with her light. Her connection to the broader Parliament of Justice—strategists like William and healers like Jennifer—strengthens her, but she struggles with the darker realities of Zion City’s lower sectors, relying on her brightness to push back the shadows.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Kelsie’s suit and innate artistry grant her a range of powers focused on light, agility, and deception, reflecting her dancer’s grace:
          </Text>
          <Text style={styles.aboutText}>
            Photokinetic Dance: Can manipulate light with her movements, creating beams, flashes, or patterns to blind enemies, illuminate allies, or shape the battlefield. Her dance is both a weapon and a shield, flowing seamlessly with Jared’s speed.
          </Text>
          <Text style={styles.aboutText}>
            Flash Photography: Generates intense bursts of light to disorient or stun opponents, drawing on her suit’s wings and visor to amplify the effect, perfect for quick escapes or ambushes.
          </Text>
          <Text style={styles.aboutText}>
            Photographic Memory: Recalls every detail she’s ever seen with perfect clarity, allowing her to memorize enemy tactics, map layouts, or family plans, making her a living archive for the Titans.
          </Text>
          <Text style={styles.aboutText}>
            Illusory Dancing: Creates light-based illusions to deceive enemies or inspire allies, projecting decoys, mirages, or dazzling displays that shift perceptions in combat.
          </Text>
          <Text style={styles.aboutText}>
            Graceful Acrobatics: Moves with exceptional agility and precision, flipping, spinning, and leaping with ease, enhancing her combat and evasion alongside Jared’s speed.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Kelsie is the light and agility of The Eclipse, complementing Jared’s speed with her dynamic grace and illumination. She’s creative, spirited, and deeply in love with Jared, seeing their partnership as a dance of light and motion that keeps them in sync. Her relationship with Jared is one of mutual enhancement—he accelerates her light, while she guides his path with brilliance.
          </Text>
          <Text style={styles.aboutText}>
            Among The Eclipse, Kelsie collaborates with Myran’s tech, James’s calm, and Aileen’s strength, forming a vibrant support unit for the Titans. She admires Spencer’s strength but shares Jared’s focus on progress, often using her illusions to ease tensions within the group. Her cousins-in-law—Jennifer, William, Emma, Ben, and Azure—rely on her light for morale and cover, while she draws inspiration from their resilience.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, Kelsie connects with creatives like Emma and strategists like William, using her photographic memory to support their plans. Her ultimate goal is to illuminate Zion City’s future alongside Jared, proving that beauty and agility can overcome darkness, while ensuring her husband and his family shine.
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

export default Kelsie;