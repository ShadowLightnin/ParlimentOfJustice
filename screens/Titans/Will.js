import React, { useState, useEffect } from "react";
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const armors = [
  { name: "True Night Hawk", image: require("../../assets/NightHawkWillBeBorn.jpg"), clickable: true },
  { name: "Night Hawk", image: require("../../assets/Armor/NightHawkPlaceHolder.jpg"), clickable: true },
  { name: "Lightning Leopard", image: require("../../assets/Armor/WillPlaceHolder.jpg"), clickable: true },
  { name: "Defender 1", image: require("../../assets/Armor/Defender1PlaceHolder.jpg"), clickable: true },
  { name: "Defender 2", image: require("../../assets/Armor/Defender2PlaceHolder.jpg"), clickable: true },
  { name: "Shadow Storm", image: require("../../assets/Armor/ShadowStormPlaceHolder.jpg"), clickable: true },
  { name: "Celestial", image: require("../../assets/Armor/CelestialPlaceHolder.jpg"), clickable: true },
  { name: "Sentinel", image: require("../../assets/Armor/SentinelPlaceHolder.jpg"), clickable: true },
  { name: "Wrath", image: require("../../assets/Armor/WrathPlaceHolder.jpg"), clickable: true },
];

const Will = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // Update window width on resize
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Determine if it's desktop or mobile based on width (e.g., 768px as breakpoint)
  const isDesktop = windowWidth >= 768;

  // Render each armor card
  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={armor.name}
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Night Hawk</Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          William Cummings, known as Night Hawk, is a master of shadows and strategy, the older Cummings sibling and a cornerstone of the Titans within the Parliament of Justice. His lean, agile frame hides a mind as sharp as his claws and a heart loyal to his family. Behind his sleek, ever-changing helmets, William is a tech genius and stealth expert, always two steps ahead of his enemies and ready to adapt to any situation. He’s in a relationship with Aileen, whose strength complements his tactical mind, and he shares an unbreakable bond with his sister Emma. As one of the oldest cousins, William bridges the gap between tradition (like Spencer’s ideals) and innovation, using his suits to protect his cousins—Spencer, Jared, Jennifer (McNeil), Ben, Azure (Briggs), and the rest. Off the battlefield, he’s a problem-solver, often tinkering with gadgets or strategizing with his family, but his drive to stay invisible and untouchable sometimes isolates him.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          William grew up in a tech-savvy household on the edge of Zion City’s Terrestrial sector, alongside his younger sister Emma. The Cummings family valued both physical prowess and intellectual innovation, and William inherited a knack for mechanics from his parents. While Emma gravitated toward mechanical flight and flair, William focused on stealth and precision, inspired by heroes like Batman and Nightwing, whose shadows and symbols spoke to him.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors began to fracture, William’s village faced threats from the Telestial and Outer Darkness sectors. During a nighttime raid, he discovered his ability to blend into shadows, using scavenged tech to create his first suit. This moment birthed Night Hawk, and he soon joined the Titans, working closely with the McNeil siblings (Spencer, Jared, Jennifer) and Briggs cousins (Ben, Azure). His suits evolved over time, each reflecting a new challenge: the Defender suits for raw power, the Night Hawk for stealth, and the Celestial and Sentinel for versatility.          </Text>
          <Text style={styles.aboutText}>
          As the oldest Cummings sibling, William took on a protective role for Emma and the broader family, but he also felt the pressure of Spencer’s fallen leadership and Jared’s rising ambition. His relationship with Spencer is one of mutual respect but subtle tension—Spencer admires William’s adaptability but fears his reliance on technology, while William sees Spencer’s nostalgia as a weakness. With Jared, he’s a rival and ally, matching speed with strategy, and with Jennifer, he shares a deep trust, often relying on her healing to recover from his stealth missions.          </Text>
          <Text style={styles.aboutText}>
          In a relationship with Aileen, William finds balance, her cultural strength grounding his high-tech approach. Together, they face Zion City’s chaos, but William’s fear of failure—especially toward his sister and cousins—drives him to push his suits and abilities to their limits.          
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          William’s suits and innate skills make him a versatile operative, with a focus on stealth, technology, and combat:          </Text>
          <Text style={styles.aboutText}>
          Stealth Mastery: Can turn invisible using his Night Hawk, Celestial, and Sentinel suits, blending into shadows or environments for reconnaissance or ambushes. His infrared, radar, and sonar capabilities (via helmet spikes) make him a perfect scout.          </Text>
          <Text style={styles.aboutText}>
          Technological Adaptability: Each suit is equipped with advanced systems—flight (Defender 2.0, Shadow Storm), color-changing camouflage, and weaponized features (gauntlet spikes, claws). He can switch modes mid-battle, adapting to any threat.          </Text>
          <Text style={styles.aboutText}>
          Combat Prowess: Armed with Batman-inspired gauntlet spikes and Wolverine-like claws, William excels in close-quarters combat, striking fast and retreating before enemies can react.          </Text>
          <Text style={styles.aboutText}>
          Tactical Intelligence: His suits’ HUDs and data analysis allow him to strategize in real time, coordinating with the Titans and extended family for maximum efficiency.          </Text>
          <Text style={styles.aboutText}>
          Energy Projection (Via Suits): Certain suits (Celestial, Sentinel, Wrath) can emit energy blasts or create force fields, drawing on their glowing visors and design motifs.          </Text>
          <Text style={styles.aboutText}>
          Armor Description          </Text>
          <Text style={styles.aboutText}>
          William’s armor is a showcase of versatility and style, with each suit tailored to a specific role. Here’s a detailed breakdown:          </Text>
          <Text style={styles.aboutText}>
          Night Hawk Suit:          </Text>
          <Text style={styles.aboutText}>
          Helmet: A refined version of Defender 2.0, splitting from a V visor to a Y/T visor for better visibility and intimidation. Two spikes on the helmet have three light rings (radar, sonar, infrared) that pulse in sync with his stealth mode. Colors shift from gunmetal grey and dark green to white and blue, with a Hawk symbol (Nightwing-inspired) on the chest.          </Text>
          <Text style={styles.aboutText}>
          Body Armor: Sleek and lightweight, prioritizing agility over bulk. Includes Batman’s gauntlet spikes and Wolverine’s claws for combat, and a stealth coating that turns it invisible.          </Text>
          <Text style={styles.aboutText}>
          Additional Features: A compact power core in the chest fuels color changes and invisibility.         </Text>
          <Text style={styles.aboutText}>
          Defender Suit 1.0:          </Text>
          <Text style={styles.aboutText}>
          Body styled after Iron Man Mark 85, gunmetal grey instead of red, dark green instead of gold. Helmet styled after Arkham Knight and Final Stage Omega from Fortnite, with true omega spikes. Armor gaps held by carbon fiber chainmail, making it rugged yet flexible.          </Text>
          <Text style={styles.aboutText}>
          Defender Suit 2.0:          </Text>
          <Text style={styles.aboutText}>
          Like 1.0 but with a Mark 46 body and Mark 85 texture, fully filled for flight like Iron Man. Blends Mark 45, 46, and 85 styles, with enhanced durability and speed. Used for aerial assaults and heavy combat.          </Text>
          <Text style={styles.aboutText}>
          Shadow Storm Suit:          </Text>
          <Text style={styles.aboutText}>
          Like Defender 2.0 but with a bat symbol instead of an arc reactor and a retractable bat cape for gliding or intimidation. Black with dark grey accents, ideal for stealth and psychological warfare.          </Text>
          <Text style={styles.aboutText}>
          Celestial Suit:          </Text>
          <Text style={styles.aboutText}>
          Like Night Hawk but all white with golden swirls, symbolizing purity and power. Visor glows gold, enhancing night vision and energy projection. Lighter and more ceremonial, used for leadership or morale-boosting missions.          </Text>
          <Text style={styles.aboutText}>
          Sentinel Suit:          </Text>
          <Text style={styles.aboutText}>
          Like Night Hawk but all white with dark green as dark grey and gold accents, visor indented and glowing blue. Designed for defense, with reinforced plating and a shield generator for protecting allies.          </Text>
          <Text style={styles.aboutText}>
          Wrath Suit:          </Text>
          <Text style={styles.aboutText}>
          Like Defender 2.0 but bigger, bulkier, black, broken-looking, and war-weathered, glowing fire red. Used for overwhelming force, reflecting William’s darker moments or desperate battles.          </Text>          
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          William is the tactician and shadow of the Titans, balancing Spencer’s power, Jared’s speed, and Jennifer’s healing with his own stealth and tech. He’s pragmatic but carries a fear of failure, especially toward his sister Emma and the family. His relationship with Spencer is respectful but tense—William sees Spencer’s fall as a cautionary tale, while Spencer worries William’s tech obsession distances him from their roots. With Jared, he’s a rival in strategy, often outsmarting his speed with preparation, and with Jennifer, he’s protective, relying on her to heal his physical and emotional scars.          </Text>
          <Text style={styles.aboutText}>
          As Emma’s older brother, William is her guardian and mentor, pushing her to refine her mechanical wings while learning from her creativity. His cousins—Ben and Azure (Briggs), the McNeil siblings—rely on his adaptability, while he draws inspiration from their strengths. In a relationship with Aileen, he finds a partner who challenges his isolation, and her cultural strength helps him connect with the family’s traditions.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, William coordinates with tech-savvy cousins like Myran (Jennifer’s husband) and strategists like Todd (Cummings) and Lee (Jensen’s). His ultimate goal is to protect Zion City’s future, proving that technology and tradition can coexist, while ensuring his family—especially Emma—thrives.          </Text>
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
    color: "#2a6d5d",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    width: "100%", // Use full width for responsiveness
    paddingVertical: 20,
    backgroundColor: "#111",
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9, // 30% of screen width on desktop, 70% on mobile
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7, // Taller on desktop
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: '#2a6d5d',
    borderWidth: 2,
    shadowColor: '#089272',
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
  disabledText: {
    fontSize: 12,
    color: "#2a6d5d",
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
    color: "#2a6d5d",
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