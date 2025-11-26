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

const Jared = () => {
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
    { name: "Spector", copyright: "William Cummings", image: require("../../assets/Armor/Jared3.jpg"), clickable: true },
    { name: "Legacy", copyright: "William Cummings", image: require("../../assets/Armor/JaredLegacy.jpg"), clickable: true },
    { name: "Spector", copyright: "William Cummings", image: require("../../assets/Armor/Jared2.jpg"), clickable: true },
    { name: "Spector", copyright: "William Cummings", image: require("../../assets/Armor/Jared.jpg"), clickable: true },
    { name: "Proto", copyright: "William Cummings", image: require("../../assets/Armor/JaredProto.jpg"), clickable: true },
    { name: "", image: require("../../assets/Armor/JaredsSymbol.jpg"), clickable: true },
  ];

  const kids = [
    { name: "Gracie", image: require("../../assets/Armor/Gracie.jpg"), clickable: true },
  ];

  const renderArmorCard = (armor, index) => (
    <TouchableOpacity
      key={`${armor.name}-${armor.copyright || index}`}
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name || 'Unnamed'} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        {armor.copyright ? `© ${armor.name || 'Unknown'}; ${armor.copyright}` : (armor.name)}
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
        © {kid.name || 'Unknown'}
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
          <Text style={styles.title}>Spector</Text>
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
            Jared McNeil, known as Spector, is a whirlwind of energy and determination, the second oldest McNeil sibling and a key member of the Titans within the Parliament of Justice. With a lean, athletic build, Jared is the embodiment of speed and precision, a stark contrast to his older brother Spencer’s raw power and nostalgia. Behind his sleek, Red Hood-inspired helmet, Jared is sharp-witted, confident, and fiercely loyal to his family, especially his siblings Spencer and Jennifer, and his cousins Ben, Azure, Will, and Emma. While he respects Spencer’s leadership, he feels the weight of his brother’s fall and sees himself as the one to carry their legacy forward. Jared is married to Kelsie, and their partnership fuels his drive to protect Zion City and prove he can lead when the time comes. Off the battlefield, he’s a strategist and a motivator, always pushing his family to adapt to the modern world while honoring their roots.
          </Text>
          <Text style={styles.aboutText}>
            Backstory
          </Text>
          <Text style={styles.aboutText}>
            Jared grew up in the shadow of his older brother Spencer, in the same remote village on Zion City’s Terrestrial sector edge. As the second oldest McNeil sibling, he was always the quicker, more agile counterpart to Spencer’s brute strength and Jennifer’s compassion. While Spencer taught him the value of honor and tradition, Jared was fascinated by the heroes of modern myth—figures like Batman and Captain America, whose speed, strategy, and shields inspired his own path.
          </Text>
          <Text style={styles.aboutText}>
            When the sectors of Zion City began to crumble, Jared’s super speed emerged during a desperate escape from raiders, allowing him to outrun danger and save his younger sister Jennifer. This moment cemented his role as a protector, but also highlighted his differences from Spencer, whose methods were more rooted in destruction than evasion. As the Titans formed, Jared became Spencer’s right hand, using his speed to scout, strike, and coordinate, but he always felt the pressure of living up to his brother’s legacy.
          </Text>
          <Text style={styles.aboutText}>
            The turning point came when Spencer’s confidence waned, and Jared began to see himself as a potential successor. Their bond, while strong, is now strained by this unspoken rivalry—Spencer sees Jared’s modernity as a threat to tradition, while Jared believes progress is the only way to save Zion City. Married to Kelsie, who shares his vision of a balanced future, Jared draws strength from her support and their shared goal of protecting their family and city. His armor, a fusion of Arkham Knight stealth and Captain America heroism, reflects his dual nature: a guardian who moves faster than anyone can react.
          </Text>
          <Text style={styles.aboutText}>
            Abilities
          </Text>
          <Text style={styles.aboutText}>
            Jared’s suit and innate agility grant him the following powers, tailored to his role as a swift leader and protector:
          </Text>
          <Text style={styles.aboutText}>
            Super Speed: Can move, react, and think at incredible velocities, allowing him to outpace any threat, deliver rapid strikes, and cover vast distances in seconds. His speed is both a weapon and a shield, letting him evade attacks and protect his family.
          </Text>
          <Text style={styles.aboutText}>
            Enhanced Reflexes: His mind and body are perfectly synchronized for high-speed combat, enabling him to dodge, parry, and counter with surgical precision.
          </Text>
          <Text style={styles.aboutText}>
            Tactical Acumen: Years of working alongside Spencer and the Titans have honed his ability to analyze battlefields and devise strategies on the fly, making him a natural leader in chaotic situations.
          </Text>
          <Text style={styles.aboutText}>
            Shield Mastery: His Captain America-like shield is not just defensive—it can be thrown with pinpoint accuracy at high speeds, ricochet off multiple targets, and return to his hand, thanks to his speed-enhanced control.
          </Text>
          <Text style={styles.aboutText}>
            Energy Burst (Via Armor): The armor’s crusader visor can emit short-range energy pulses, disorienting enemies and creating openings for his attacks.
          </Text>
          <Text style={styles.aboutText}>
            Inspirational Presence: His ability to uplift his siblings and cousins, especially Jared, whom he mentors as his successor, remains his greatest asset.
          </Text>
          <Text style={styles.aboutText}>
            Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
            Jared is the speed and strategy of the Titans, a counterbalance to Spencer’s power and Jennifer’s healing. He’s confident, sometimes to a fault, but his loyalty to his family is unshakable. As Spencer’s brother, he feels a mix of admiration and frustration—admiring his brother’s strength but frustrated by his refusal to adapt. Jared sees himself as the bridge between tradition and progress, a role he believes will make him the next leader of the Titans.
          </Text>
          <Text style={styles.aboutText}>
            His relationship with Spencer is complex: he respects his brother’s past leadership but believes he’s lost his way, a belief that both motivates and burdens him. With Jennifer, he shares a protective bond, often shielding her with her speed during battles. His cousins—Ben and Azure (Briggs), Will and Emma (Cummings)—look to him for tactical guidance, while he draws inspiration from their unique strengths. Married to Kelsie, Jared finds a partner who shares his vision, and her influence pushes him to balance his ambition with compassion.
          </Text>
          <Text style={styles.aboutText}>
            In the broader Parliament of Justice, Jared works closely with the extended family—coordinating with Todd (Cummings) on leadership, sparring with Samantha (Jensen) for strength training, and strategizing with Lee (Jensen) on marksmanship. His ultimate goal is to prove he can lead the Titans and Zion City into a new era, honoring Spencer’s legacy while forging his own path.
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

export default Jared;