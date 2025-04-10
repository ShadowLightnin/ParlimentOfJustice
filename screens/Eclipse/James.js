import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const James = () => {
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
    { name: "Gentle Hand", image: require("../../assets/Armor/JamesPlaceHolder.jpg"), clickable: true },
  ];

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
          <Text style={styles.title}>Gentle Hand</Text>
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

        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          James Connell, known as Gentle Guardian, is a beacon of calm and compassion, the husband of Azure Briggs “Midigator” and a vital member of The Eclipse within the Parliament of Justice. His presence is soothing yet resolute, a blend of empathy and protection that makes him a stabilizing force for his wife and her family. Behind his flexible armor, James is patient, understanding, and fiercely devoted to Azure, seeing her drive for order as a strength he complements with his own gentleness. He extends this care to the Titans—Spencer, Jared, Jennifer, William, Emma, and Ben—and their partners in The Eclipse, using his abilities to heal and shield them. Off the battlefield, he’s a mediator and a listener, often resolving disputes or comforting his family, but his deep empathy can sometimes leave him vulnerable to their pain.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          James grew up in Zion City’s Terrestrial sector, in a family known for their peacekeeping and community-building efforts. From a young age, he was drawn to helping others, inspired by stories of healers and guardians who brought peace to chaos. His natural empathy and ability to sense emotions set him apart, but it was his encounter with Azure Briggs that defined his purpose.          </Text>
          <Text style={styles.aboutText}>
          James met Azure during a tense standoff in the Telestial sector, where her strategic order clashed with a mob’s rage. Stepping in, James used his calming presence to diffuse the situation, revealing his latent healing and shielding powers. Azure’s disciplined strength captivated him, and he crafted his Gentle Guardian suit to support her, using his empathy to balance her rigidity. Their marriage became a partnership of structure and softness, with James’s compassion grounding Azure’s justice.          </Text>
          <Text style={styles.aboutText}>
          Joining The Eclipse, James aligned with the significant others of the Titans—Myran (Jennifer’s husband), Kelsie (Jared’s wife), and Aileen (William’s girlfriend)—to bolster their mission. He felt the strain of Spencer’s fallen leadership and Azure’s burden to maintain order, but saw an opportunity to heal their wounds and unite them. His connection to the broader Parliament of Justice—healers like Jennifer and strategists like William—strengthens him, but he struggles with the violence of Zion City’s lower sectors, relying on his shields and aura to protect his loved ones.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          James’s suit and innate empathy grant him a range of powers focused on healing, protection, and support, reflecting his guardian role:          </Text>
          <Text style={styles.aboutText}>
          Empathetic Aura: Projects a calming field that soothes allies, reduces stress, and restores emotional balance, making him a morale booster in tense situations.          </Text>
          <Text style={styles.aboutText}>
          Healing Touch: Can heal physical injuries and emotional wounds with a gentle touch, channeling energy through his hands to mend his family and teammates, though it takes focus and drains him over time.          </Text>
          <Text style={styles.aboutText}>
          Protective Shield: Generates energy barriers to shield himself and others from harm, drawing on his suit’s design to create flexible, mobile defenses that adapt to threats.          </Text>
          <Text style={styles.aboutText}>
          Telepathic Connection: Can communicate mentally with teammates, sharing thoughts, emotions, or strategies silently, enhancing coordination with Azure and the Titans.          </Text>
          <Text style={styles.aboutText}>
          Conflict Resolution: Uses his empathy and aura to ease tensions and settle disputes, diffusing conflicts within the team or with enemies, a skill honed by his peacemaking nature.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          James is the calm and support of The Eclipse, complementing Azure’s order with his healing and protective abilities. He’s patient, compassionate, and deeply in love with Azure, seeing her justice as a foundation he softens with his empathy. His relationship with Azure is one of mutual balance—he shields her rigidity, while she gives him purpose and direction.          </Text>
          <Text style={styles.aboutText}>
          Among The Eclipse, James collaborates with Myran’s tech, Kelsie’s agility, and Aileen’s strength, forming a cohesive support unit for the Titans. He respects Spencer’s strength but shares Azure’s focus on stability, often using his telepathy to ease tensions within the group. His cousins-in-law—Jennifer, Jared, William, Emma, and Ben—rely on his shields and healing, while he draws strength from their resilience.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, James connects with healers like Jennifer and mediators like Angela (Cummings), using his aura to support their efforts. His ultimate goal is to bring peace to Zion City alongside Azure, proving that compassion and order can heal a fractured world, while ensuring his wife and her family thrive.          </Text>
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
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    paddingLeft: 15,
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

export default James;