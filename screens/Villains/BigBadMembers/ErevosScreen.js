import React from "react";
import { 
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ErevosScreen = () => {
  const navigation = useNavigation();
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.9 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.6;

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/BigBad.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Erevos</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/Erevos.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
            {/* Transparent Overlay for Image Protection */}
            <View style={styles.transparentOverlay} />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
             The Parliament of Justice’s Big Bad
             </Text> 
            <Text style={styles.aboutText}>
            Once a prehistoric warrior named Erevos, he gained immortality after 
            a cosmic artifact crash-landed on Earth during his early reign. With 
            an unending life and countless centuries of combat, strategy, and conquest, 
            Erevos has influenced history from the shadows, manipulating empires and 
            civilizations to serve his purpose. His ultimate goal is to mold the world 
            into a brutal hierarchy, where only the strongest survive under his rule. 
            To him, the Parliament of Justice’s notion of order and protection is unnatural, 
            as he believes only those who have earned the right should wield power.           
            </Text>
            <Text style={styles.aboutText}>
            • Powers and Abilities:

            </Text>
            <Text style={styles.aboutText}>
            • Immortality: Cannot be killed by conventional means; he regenerates from injuries and has survived countless battles.

            </Text>
            <Text style={styles.aboutText}>
            • Master Tactician: Possesses unparalleled knowledge of combat, warfare, and strategy gained from centuries of experience.

            </Text>
            <Text style={styles.aboutText}>
            • Enhanced Physique: Physical strength, speed, and agility surpassing that of any human.

            </Text>  
            <Text style={styles.aboutText}>
            • Artifact Control: Wields artifacts from ancient civilizations that grant powers, including telekinesis, energy projection, and mind control.

            </Text>  
            <Text style={styles.aboutText}>
            • Influence Network: Has secret loyalists planted across the world, from influential leaders to hidden assassins, ready to act at his command.

            </Text>  
            <Text style={styles.aboutText}>
            Erevos’s story:

            </Text>  

            <Text style={styles.aboutText}>
            Erevos the Eternal is a dark, ancient figure who has haunted the world across the millennia. Inspired by Vandal Savage from Young Justice, Erevos’s origins lie in a blend of tragedy, ambition, and insatiable desire for power, leading him to become an unstoppable adversary for the Parliament of Justice and other heroes alike.

            </Text> 
            <Text style={styles.aboutText}>
            1. Origins in the Ancient World
Thousands of years ago, Erevos was a powerful warrior and chieftain in a thriving, yet primitive society. Known by his original name, Erevan, he was respected for his unmatched strength and tactical genius. During a mysterious celestial event—a comet passing close to Earth—Erevan was struck by its cosmic energy. The impact should have been lethal, but instead, it altered his very essence, granting him immense strength, unbreakable resilience, and, most notably, immortality. As he survived this event, he took on a new name, Erevos the Eternal.

            </Text> 
            <Text style={styles.aboutText}>
            2. The Rise of a Tyrant
With his newfound powers and eternal life, Erevos quickly seized control over neighboring tribes, crushing opposition and uniting vast territories under his rule. As civilizations developed, he used his wisdom, manipulation, and charisma to influence key figures, often posing as a god, prophet, or king. He guided the rise and fall of empires, covertly orchestrating wars and alliances that reshaped history to suit his vision of a perfect world under his dominance.

            </Text> 
            <Text style={styles.aboutText}>
            3. Building an Eternal Empire
Over centuries, Erevos built secret societies and cults in every corner of the globe. These hidden factions, bound by loyalty and mystique, served as his eyes, ears, and enforcers. His agents influenced the advancement of science, alchemy, warfare, and religion, all while spreading his dark legacy and preparing humanity for the “Eternal Empire.” Erevos believed that only he, with his unparalleled wisdom and experience, was worthy of uniting and ruling humankind.

            </Text> 
            <Text style={styles.aboutText}>
            4. The Parliament of Justice
As the world advanced, Erevos’s ambition clashed with growing factions of heroes and guardians. Among them, the Parliament of Justice became his greatest threat—a coalition dedicated to protecting humanity from tyrants and dark forces. This group of heroes threatened Erevos’s plans for a unified, subjugated world. He saw them as a temporary setback in his eternal scheme, a nuisance that had to be eradicated before his final rise to power.

            </Text> 
            <Text style={styles.aboutText}>
            5. The Pursuit of Ultimate Power
Though immortal, Erevos’s powers are not boundless. To reach his true potential, he has sought relics, artifacts, and cosmic knowledge to amplify his abilities. He believes he can achieve a god-like state beyond even his present form, becoming an entity capable of controlling fate, time, and space itself. To this end, he has manipulated countless conflicts, created vast armies, and even engaged in dark rituals to siphon the strength and life-force from others, including heroes from the Parliament of Justice, whom he views as his most powerful adversaries.

            </Text> 
            <Text style={styles.aboutText}>
            6. Personal Code and Vision
Erevos is deeply convinced that humanity is doomed to chaos and self-destruction without his guidance. He sees himself as a necessary evil, a force of order meant to bring peace by any means necessary. Though ruthless, he operates by his own twisted moral code, believing that his actions are justified because they serve the greater good as he defines it. He is cold, calculating, and entirely without remorse but has an underlying tragic dimension; in his mind, he sees himself as humanity’s savior.

            </Text> 
            <Text style={styles.aboutText}>
            Powers and Abilities

            </Text> 
            <Text style={styles.aboutText}>
            • Immortality: Erevos cannot die from aging, illness, or most injuries. His cells regenerate rapidly, allowing him to heal from wounds that would be fatal to others.

            </Text> 
            <Text style={styles.aboutText}>
            • Cosmic Energy Manipulation: Residual power from his encounter with the celestial event grants him abilities akin to dark matter manipulation, including energy projection, force fields, and limited telekinesis.

            </Text> 
            <Text style={styles.aboutText}>
            • Enhanced Intelligence and Strategic Mastery: With thousands of years of experience, Erevos has accumulated knowledge of warfare, politics, science, and psychology, making him a nearly unbeatable tactician.

            </Text> 
            <Text style={styles.aboutText}>
            • Physical Augmentation: His strength, agility, and stamina far surpass normal human limits. Over time, his body has developed beyond its initial enhancements, allowing him to survive extreme environments, including the vacuum of space for brief periods.

            </Text> 
            <Text style={styles.aboutText}>
            Personality
            </Text> 
            <Text style={styles.aboutText}>
            Erevos is patient, knowing that time is always on his side. He is deeply arrogant yet possesses a charm that has seduced countless leaders and warriors throughout history to join his cause. His contempt for the Parliament of Justice is profound, as he views their resistance as an immature defiance against humanity’s destined ruler. Erevos despises what he sees as their misplaced ideals of “freedom” and “justice,” believing that the only way to create a true utopia is under his rule.

            </Text> 
            <Text style={styles.aboutText}>
            Current Agenda

            </Text> 
            <Text style={styles.aboutText}>
            Erevos has been covertly working on a plan known as The Convergence—an operation intended to siphon the powers of every hero on Earth, the Parliament included. Using an ancient artifact, the Celestial Eye, he seeks to harness these energies to amplify his own abilities, aiming to achieve a level of power that would allow him to reshape reality itself. Once accomplished, Erevos envisions a new era: a world of his design where he reigns supreme and unquestioned, an eternal god of an immortal empire.

            </Text> 
            <Text style={styles.aboutText}>
            In facing Erevos, the Parliament of Justice encounters not only a formidable enemy but a living embodiment of humanity’s potential for both greatness and corruption.

            </Text> 
            <Text style={styles.aboutText}>
            Yes, Erevos the Eternal does indeed have his own dark cabal, mirroring The Light from Young Justice, with a powerful alliance of villains who share his twisted ideals or stand to benefit from his ultimate vision. Additionally, his influence runs so deep that he’s made a pact with a cosmic-level villain akin to Darkseid—a dark overlord of the universe who values domination above all else. As if that weren’t enough, Erevos’s immortal bloodline holds a dark secret: he is the direct progenitor of all meta-powers on Earth, which adds layers to his grip on power and his claim over humanity’s future.

            </Text> 
            <Text style={styles.aboutText}>
            Erevos’s Cabal: The Light

            </Text> 
            <Text style={styles.aboutText}>
            The Light is Erevos’s secret council of powerful, morally ambiguous individuals and villains who all operate under his influence and serve his grand vision of world domination. Each member of The Light serves a specialized role, leveraging unique abilities or resources to carry out Erevos’s schemes across various sectors of society. Members are selected for their skills, loyalty to Erevos, and alignment with his worldview.

            </Text> 
            <Text style={styles.aboutText}>
            Members of The Light:

            </Text> 
            <Text style={styles.aboutText}>
            1. Noctura, the Illusionist: A master manipulator capable of bending reality and perception, Noctura has the power to influence entire populations through hallucinogenic energy. She manages psychological warfare and media manipulation, keeping the masses in a fog of confusion.

            </Text> 
            <Text style={styles.aboutText}>
            2. Sable, the Assassin: Sable is a merciless warrior with an arsenal of deadly, shadow-infused weaponry. Her ability to slip through dimensions allows her to be anywhere and nowhere, striking down threats to Erevos’s plans without leaving a trace.

            </Text> 
            <Text style={styles.aboutText}>
            3. Chrona, the Time-Bender: With control over small pockets of time, Chrona can slow, rewind, or even freeze time within a limited area. She uses her abilities to foresee potential obstacles to Erevos’s rule, manipulating events in his favor.

            </Text> 
            <Text style={styles.aboutText}>
            4. Obelisk, the Warlock: A master of ancient dark arts and mysticism, Obelisk performs rituals that enhance Erevos’s strength and manipulate supernatural forces to bend to The Light's will. He also maintains a portal to the cosmic realm.

            </Text> 
            <Text style={styles.aboutText}>
            5. Titanus, the Titan of Steel: Enhanced by experimental cybernetics and mutated DNA, Titanus is the muscle of The Light, with strength that rivals even the strongest Titans of the Parliament. His primary role is to crush resistance with brute force.

            </Text> 
            <Text style={styles.aboutText}>
            6. Red Mercury: An industrialist who serves as the public face and financial powerhouse behind many of Erevos’s schemes. Red Mercury provides The Light with money, resources, and political connections, shielding their plans from public scrutiny.

            </Text> 
            <Text style={styles.aboutText}>
            Cosmic Pact with the Dark Overlord: The Devourer
            </Text> 
            <Text style={styles.aboutText}>
            Erevos’s ambitions don’t stop at world domination; his visions extend to the cosmos itself. Through his occult studies and interdimensional journeys, Erevos crossed paths with The Devourer, a being of unimaginable darkness, known for his eternal hunger to consume worlds and impose order through conquest. The Devourer is a warlord who rules entire galaxies, maintaining power by siphoning life forces from planets he destroys.
            </Text> 
            <Text style={styles.aboutText}>
            Their pact is as mutually beneficial as it is dangerous:
            </Text> 
            <Text style={styles.aboutText}>
            • Erevos Provides: Strategic influence on Earth, turning the planet into a source of powerful meta-humans and resources that will eventually be harvested by The Devourer in exchange for his cosmic support.
            </Text> 
            <Text style={styles.aboutText}>
            • The Devourer Provides: Dark energy enhancements that amplify Erevos’s powers, with promises of assistance if Erevos ever faces rebellion from Earth’s heroes. The Devourer’s cosmic minions occasionally visit Earth to enforce Erevos’s will or seek out meta-human champions as part of a grand tournament, testing their might before the final subjugation.
            </Text> 
            <Text style={styles.aboutText}>
            Ancestor of All Meta-Powers
            </Text> 
            <Text style={styles.aboutText}>
            Erevos’s ancient bloodline is laced with the celestial energies that first granted him immortality. Over time, he realized his descendants held fragments of this cosmic power, creating a lineage that became the foundation for all meta-human abilities. Throughout history, those who developed extraordinary powers could trace their ancestry back to Erevos, even if they were unaware.
            </Text> 
            <Text style={styles.aboutText}>
            This ancestral link gives Erevos a unique influence over meta-humans, particularly when he activates an artifact known as The Ancestral Sigil, which allows him to control or dampen meta-human powers to a degree. By claiming his rightful place as the first of their kind, Erevos leverages his ancestral connection to sway meta-humans, manipulating many into believing that following him is fulfilling their destiny.
            </Text> 
            <Text style={styles.aboutText}>
            The Grand Plan: Ascendancy
            </Text> 
            <Text style={styles.aboutText}>
            Erevos’s ultimate scheme, known as Ascendancy, is designed to bring every corner of the world—and potentially beyond—under his control. With The Eclipse orchestrating events on Earth, and his alliance with The Devourer securing his place in the cosmos, Ascendancy involves:
            </Text> 
            <Text style={styles.aboutText}>
            1. Subjugation of Meta-Humans: Using The Ancestral Sigil, Erevos plans to bend all meta-humans to his will, turning them into his personal army.
            </Text> 
            <Text style={styles.aboutText}>
            2. Reshaping Earth’s Reality: With the combined resources of The Eclipse and the dark energy from The Devourer, Erevos seeks to reshape Earth into a paradise of his own vision—under his eternal rule.
            </Text> 
            <Text style={styles.aboutText}>
            3. The Final Harvest: Erevos has promised Earth to The Devourer for his cosmic hunger, envisioning a universe where Earth’s meta-human champions will fuel The Devourer’s ascension, creating an unstoppable cosmic empire with Erevos as its Eternal ruler.
            </Text> 
            <Text style={styles.aboutText}>
            Erevos the Eternal stands as a dark nexus of ancient power, cosmic ambition, and sheer ruthless will. His mastery over both Earthly and interdimensional forces, combined with his ancestral claim over meta-humanity, makes him the ultimate villain that the Parliament, Titans, and all champions of justice must unite to face, if they hope to keep Earth free from his shadow and cosmic enslavement.
            </Text> 
            <Text style={styles.aboutText}>
            The Winner-Takes-All Deal
            </Text> 
            <Text style={styles.aboutText}>
            1. Mutual Goals: Both Erevos and The Devourer have aligned interests: total domination. Erevos seeks to rule Earth and shape it into his vision, while The Devourer desires to consume it and absorb its resources, including its meta-humans. Their partnership is thus built on the premise that they will work together to achieve these goals, but only one of them can ultimately claim victory.
            </Text> 
            <Text style={styles.aboutText}>
            2. Control of Earth: If Erevos succeeds in his plans for Ascendancy and subjugates the meta-humans to his will, he will retain control over Earth, ensuring it becomes a haven for meta-beings under his dominion. Conversely, if The Devourer triumphs, he will take Earth as a cosmic feast, consuming its life force and dismantling Erevos’s ambitions.
            </Text> 
            <Text style={styles.aboutText}>
            3. The Devourer’s Cosmic Harvest: The Devourer has the power to siphon life forces from planets, including those of meta-humans. Erevos’s role is to gather and present Earth’s strongest meta-humans to The Devourer as part of the final harvest. If he fails to deliver, or if he is outmaneuvered by The Devourer, he risks losing everything he has worked to build, including his own existence.
            </Text> 
            <Text style={styles.aboutText}>
            4. Eternal Consequences: The pact has a temporal aspect; Erevos and The Devourer have set a timeline for their grand plan. If Erevos fails to secure his position or thwart the heroes of the Parliament and Titans within that timeframe, The Devourer will have the right to take Earth by force, with Erevos being treated as an expendable ally.
            </Text> 
            <Text style={styles.aboutText}>
            5. Strategic Rivalry: Their relationship is inherently volatile. As they work together, both Erevos and The Devourer are constantly watching each other’s moves, ready to exploit weaknesses. If Erevos begins to amass too much power, The Devourer might view him as a potential threat, leading to further intrigue and betrayal.
            </Text> 
            <Text style={styles.aboutText}>
            Conclusion
            </Text> 
            <Text style={styles.aboutText}>
            This winner-takes-all deal intensifies the narrative and conflict in the story. It raises the stakes for Erevos and creates an atmosphere of mistrust, ambition, and inevitable betrayal, setting the stage for dramatic confrontations with the heroes of the Parliament, the Titans, and anyone else who stands in their way. The looming threat of The Devourer’s appetite for domination adds a layer of urgency to the heroes’ mission to thwart Erevos and his dark ambitions.

            </Text> 
            <Text style={styles.aboutText}>
            Erevos the Eternal and The Devourer’s fateful meeting was a convergence of ambition and dark destiny that took place during a critical moment in Erevos’s long life. Here’s a detailed account of their first encounter:

            </Text> 
            <Text style={styles.aboutText}>
            The Meeting of Erevos and The Devourer

            </Text> 
            <Text style={styles.aboutText}>
            • Time Period: The meeting occurred during a time of great turmoil on Earth, a period marked by escalating conflicts among nations, the rise of meta-humans, and the emergence of powerful supernatural forces. This chaos created the perfect breeding ground for Erevos’s ambition and The Devourer’s hunger for domination.

            </Text> 
            <Text style={styles.aboutText}>
            • Location: The encounter took place in a hidden temple deep within an ancient mountain range, a site steeped in dark magic and forgotten knowledge. This temple was built by a long-lost civilization that had once worshipped The Devourer as a god, leaving behind inscriptions and artifacts that spoke of his insatiable hunger.

            </Text> 
            <Text style={styles.aboutText}>
            The Encounter

            </Text> 
            <Text style={styles.aboutText}>
            • Erevos’s Quest for Power: Seeking a way to enhance his own abilities and solidify his control over meta-humans, Erevos delved into ancient texts and rituals. He uncovered the existence of The Devourer—a cosmic entity capable of granting unimaginable power in exchange for service. Intrigued by the prospect of power, Erevos set out to summon this dark force.

            </Text> 
            <Text style={styles.aboutText}>
            • The Summoning Ritual: Under the light of a rare celestial alignment, Erevos performed a complex ritual in the heart of the temple. Using artifacts imbued with ancient magic and the life force of captured meta-humans, he created a portal that would bridge the mortal realm with the essence of The Devourer.

            </Text> 
            <Text style={styles.aboutText}>
            • The Appearance of The Devourer: The portal erupted in a storm of energy, and from it emerged The Devourer, a terrifying manifestation of chaos and hunger. The being’s form was constantly shifting, with tendrils of darkness swirling around him, and a voice that resonated like a thousand echoes filled the temple.

            </Text> 
            <Text style={styles.aboutText}>
            The Pact

            </Text> 
            <Text style={styles.aboutText}>
            • Mutual Recognition: Erevos and The Devourer recognized each other’s ambitions immediately. Erevos saw an opportunity to amplify his power and dominion, while The Devourer sensed the potential for a significant harvest of life forces.

            </Text> 
            <Text style={styles.aboutText}>
            • Negotiation: In a tense and foreboding exchange, Erevos proposed an alliance. He offered to gather powerful meta-humans for The Devourer’s consumption in exchange for enhanced powers to assist in his conquest of Earth. The Devourer, intrigued by Erevos’s ambition and cunning, agreed to the terms but insisted on the winner-takes-all stipulation.

            </Text> 
            <Text style={styles.aboutText}>
            • Sealing the Pact: They sealed their deal with an ancient ritual involving blood and dark magic, binding their fates together. Erevos was bestowed with new abilities—greater strength, enhanced immortality, and the ability to siphon power from those he conquered. In return, The Devourer gained access to Earth and its meta-humans as a source of sustenance.

            </Text> 
            <Text style={styles.aboutText}>
            Aftermath
            </Text> 
            <Text style={styles.aboutText}>
            • Unleashing Chaos: Following their pact, Erevos began enacting his plans, manipulating events on Earth to weaken meta-humans and governments alike. Meanwhile, The Devourer loomed in the background, waiting for the right moment to strike and consume the very world Erevos sought to control.

            </Text> 
            <Text style={styles.aboutText}>
            • An Ongoing Rivalry: Though they share a common goal, Erevos and The Devourer remain cautious of one another, always aware that betrayal could come at any moment. Their meeting marked the beginning of a dark alliance, setting the stage for conflicts that would resonate through the ages as they both pursued their grand designs.

            </Text> 
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
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
    color: "purple",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#111",
    paddingVertical: 30,
    borderRadius: 20,
    position: 'relative', // Required for overlay positioning
  },
  armorImage: {
    resizeMode: "contain",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Ensures overlay is on top without blocking buttons
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
    color: "#D4AF37", // Gold-like hue for power & significance
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ErevosScreen;