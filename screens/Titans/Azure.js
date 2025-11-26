import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Azure = () => {
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
    { name: "Mediateir", copyright: "William Cummings", image: require("../../assets/Armor/Azure3.jpg"), clickable: true },
    { name: "Legacy", copyright: "William Cummings", image: require("../../assets/Armor/AzureLegacy.jpg"), clickable: true },
    { name: "Mediateir", copyright: "William Cummings", image: require("../../assets/Armor/Azure.jpg"), clickable: true },
    { name: "Midigator", copyright: "William Cummings", image: require("../../assets/Armor/Azure2.jpg"), clickable: true },
    { name: "", image: require("../../assets/Armor/AzuresSymbol.jpg"), clickable: true },
  ];

  const renderArmorCard = (armor, index) => (
    <TouchableOpacity
      key={`${armor.name}-${armor.copyright || index}`} // Unique key using name, copyright, or index
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mediateir</Text>
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

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Azure Briggs, known as Midigator, is a pillar of order and protection, the oldest Briggs sibling and a crucial member of the Titans within the Parliament of Justice. Her presence is commanding yet calming, a blend of strategic precision and unwavering justice that marks her as a guardian of balance. Behind her sleek, Order-inspired armor, Azure is disciplined, empathetic, and fiercely loyal to her brother Ben, her husband James, and her cousins among the Titans (Spencer, Jared, Jennifer, William, and Emma). She sees herself as the enforcer of harmony in Zion City, drawing strength from her family’s values and her role as a mediator. Off the battlefield, she’s a planner and a peacemaker, often mediating disputes among her cousins or reinforcing their defenses, but her drive for order sometimes makes her inflexible.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Azure grew up in a structured household on the edge of Zion City’s Terrestrial sector, alongside her younger brother Ben, in a family that prized order, strength, and justice. The Briggs clan was known for their tactical minds and protective instincts, and Azure inherited a knack for strategy and defense from her parents. While Ben leaned toward agility and combat, Azure was inspired by tales of knights and lawkeepers, as well as The Order from Fortnite, whose authority and structure resonated with her.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors began to fracture, Azure’s village faced threats from the chaotic Telestial and Outer Darkness sectors. During a pivotal defense, she discovered her ability to organize and protect, rallying her family and neighbors to hold the line. This moment birthed Midigator, and her armor evolved to reflect her role as a guardian, drawing on The Order’s design to symbolize justice and stability. Joining the Titans, she stood with Ben, the McNeil siblings (Spencer, Jared, Jennifer), and the Cummings siblings (William, Emma), using her strategy to safeguard their mission.          </Text>
          <Text style={styles.aboutText}>
          As one of the oldest cousins, Azure felt the strain of Spencer’s fallen leadership and Jared’s rising ambition, but she also saw an opportunity to restore balance. Her Order-inspired armor became a symbol of stability, but her fear of losing control—especially over her brother Ben and the Titans—sometimes clouds her judgment. Married to James, a gentle and supportive partner, Azure finds strength in his empathy, but her role as a Titan pushes her to maintain order at all costs. Her connection to the broader family—leaders like Todd (Cummings), strategists like Lee (Jensen), and healers like Jennifer (McNeil)—grounds her, but she struggles with the chaos of modern Zion City.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Azure’s suit and innate leadership grant her a range of powers focused on defense, strategy, and support, reflecting her Order inspiration:          </Text>
          <Text style={styles.aboutText}>
          Strategic Command: Can analyze battlefields and coordinate her family and teammates with precision, boosting their effectiveness and morale. Her tactical mind allows her to anticipate threats and devise plans on the fly.          </Text>
          <Text style={styles.aboutText}>
          Protective Barriers: Her armor can generate energy shields, inspired by The Order’s defensive capabilities, to shield allies from harm or create safe zones during combat.          </Text>
          <Text style={styles.aboutText}>
          Enhanced Durability: The suit is reinforced with a lightweight alloy that absorbs impacts and disperses energy, making Azure a resilient frontline defender.          </Text>
          <Text style={styles.aboutText}>
          Justice Aura: Can project an aura of authority and calm, dispelling fear and confusion among allies, drawing on her crusader-like honor to rally her family.          </Text>
          <Text style={styles.aboutText}>
          Orderly Strike: Can deliver precise, powerful attacks that disrupt enemy formations, using her armor’s design to maintain control over chaotic situations.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Azure is the order and defense of the Titans, a counterbalance to Ben’s agility, Spencer’s power, and William’s stealth. She’s disciplined, just, and deeply loyal, but her rigidity can sometimes clash with the more flexible approaches of her cousins. Her relationship with Ben is protective and collaborative—he’s her shield, and she provides the structure he needs to focus his impulsiveness. With the McNeil siblings, she respects Spencer’s strength but worries about his fall, admires Jared’s drive, and trusts Jennifer’s healing. With William and Emma (Cummings), she shares a strategic bond, often coordinating with William’s tech and Emma’s flight.          </Text>
          <Text style={styles.aboutText}>
          As the oldest Briggs sibling, Azure looks up to Ben but also challenges him to balance justice with compassion, drawing strength from his agility while offering her own stability. Her cousins—Spencer, Jared, Jennifer, William, and Emma—rely on her for strategic guidance and protection, while she draws inspiration from their diverse strengths. Married to James, she finds a partner who softens her rigidity with his empathy, and their bond helps her see the value of flexibility.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, Azure works closely with leaders like Todd (Cummings) and defenders like Samantha (Jensen), using her order to stabilize the group. Her ultimate goal is to restore harmony to Zion City, proving that justice and structure can protect their future, while ensuring her brother and cousins thrive. She sees herself as a cornerstone for the Titans, but her fear of chaos—especially in her family—drives her to push her limits.          </Text>

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
  clickable: {
    borderWidth: 2,
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

export default Azure;