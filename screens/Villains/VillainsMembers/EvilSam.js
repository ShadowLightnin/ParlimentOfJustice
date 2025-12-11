import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { db, auth, storage } from "../../../lib/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import SamsArmory from "../../BludBruhs/SamsArmory";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get("window");

// 🎧 Evil Sam / Void Walker (Evil) tracks – same pattern as Sam
const TRACKS = [
  {
    id: "evil_walker_main",
    label: "Evil Walker Theme",
    source: require("../../../assets/audio/evilWalker.m4a"),
  },
  // You can add more later if you want variants for Evil Sam:
  {
    id: "voidwalker_good",
    label: "Void Walker Good",
    source: require("../../../assets/audio/goodWalker.m4a"),
  },
];

const characters = [
    {
    id: "evil-sam-3",
    name: "Void Walker",
    codename: "Void Walker",
    copyright: "Samuel Woodwell",
    image: require("../../../assets/Armor/SamDark.jpg"),
    clickable: true,
    hardcoded: true,
  },
  {
    id: "evil-sam-1",
    name: "Void Walker",
    codename: "Void Walker",
    copyright: "William Cummings",
    image: require("../../../assets/Armor/Sam2.jpg"),
    clickable: true,
    hardcoded: true,
  },
  {
    id: "evil-sam-2",
    name: "Void Walker",
    codename: "Void Walker",
    copyright: "Samuel Woodwell",
    image: require("../../../assets/Armor/Sam6.jpg"),
    clickable: true,
    hardcoded: true,
  },
];

const ALLOWED_EMAILS = [
  "will@test.com",
  "c1wcummings@gmail.com",
  "samuelp.woodwell@gmail.com",
];
const RESTRICT_ACCESS = true;

const EvilSam = () => {
  const navigation = useNavigation();
  const flashAnim = useRef(new Animated.Value(1)).current;

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [armorList, setArmorList] = useState(characters);
  const [previewArmor, setPreviewArmor] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    armor: null,
  });

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser?.email &&
      ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;
  const isDesktop = windowWidth >= 768;

  // 🎧 local audio state (same pattern as Sam)
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // Dynamic window sizing
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // ⚡ Flashing Animation Effect for Planet (same vibe as Sam)
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    return () => clearInterval(interval);
  }, [flashAnim]);

  // ───────── AUDIO HELPERS (no autoplay, clean like Sam) ─────────
  const unloadSound = useCallback(async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch {}
      try {
        await sound.unloadAsync();
      } catch {}
      setSound(null);
    }
  }, [sound]);

  const loadAndPlayTrack = useCallback(
    async (index) => {
      await unloadSound();
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          TRACKS[index].source,
          { isLooping: true, volume: 1.0 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Evil Sam track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound]
  );

  const playTheme = async () => {
    if (sound) {
      try {
        await sound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Play error", e);
      }
    } else {
      await loadAndPlayTrack(trackIndex);
    }
  };

  const pauseTheme = async () => {
    if (!sound) return;
    try {
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (e) {
      console.error("Pause error", e);
    }
  };

  const cycleTrack = async (direction) => {
    const nextIndex = (trackIndex + direction + TRACKS.length) % TRACKS.length;
    setTrackIndex(nextIndex);
    if (isPlaying) {
      await loadAndPlayTrack(nextIndex);
    } else {
      await unloadSound();
    }
  };

  // Stop sound when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        unloadSound();
        setIsPlaying(false);
      };
    }, [unloadSound])
  );

  const stopAndGoBack = async () => {
    await unloadSound();
    setIsPlaying(false);
    navigation.replace("VillainsScreen", { screen: "VillainsTab" });
  };

  // 🌌 Planet Click Handler → Leads to Warp Screen
  const handlePlanetPress = async () => {
    await unloadSound();
    setIsPlaying(false);
    navigation.navigate("WarpScreen", { from: "EvilSam" });
  };

  // ───────── Firestore integration for dynamic armors ─────────
  useEffect(() => {
    const validatedArmors = characters.map((armor, index) => ({
      ...armor,
      id: armor.id || `evil-sam-armor-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    setArmorList(validatedArmors);

    const unsub = onSnapshot(
      collection(db, "evilSamArmory"),
      (snap) => {
        if (snap.empty) {
          setArmorList(validatedArmors);
          return;
        }
        const dynamicArmors = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || "#800080",
          hardcoded: false,
          copyright: "Samuel Woodwell",
        }));

        const filteredDynamic = dynamicArmors.filter(
          (dynamic) =>
            !validatedArmors.some(
              (armor) =>
                armor.id === dynamic.id ||
                armor.name === (dynamic.name || dynamic.codename) ||
                armor.codename === (dynamic.name || dynamic.codename)
            )
        );

        const combinedMap = new Map();
        [...validatedArmors, ...filteredDynamic].forEach((armor) => {
          combinedMap.set(armor.id, armor);
        });
        const combined = Array.from(combinedMap.values());
        setArmorList(combined);
      },
      (e) => {
        console.error("Firestore error:", e.code, e.message);
        Alert.alert("Error", `Failed to fetch armors: ${e.message}`);
      }
    );
    return () => unsub();
  }, []);

  const handleArmorPress = (armor) => {
    if (!armor?.clickable) {
      return;
    }
    setPreviewArmor(armor);
  };

  const confirmDelete = async (evilSamArmoryId) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert("Access Denied", "Only authorized users can delete armors.");
      return;
    }
    try {
      const armorItem = armorList.find((a) => a.id === evilSamArmoryId);
      if (armorItem.hardcoded) {
        Alert.alert("Error", "Cannot delete hardcoded armors!");
        return;
      }
      const armorRef = doc(db, "evilSamArmory", evilSamArmoryId);
      const snap = await getDoc(armorRef);
      if (!snap.exists()) {
        Alert.alert("Error", "Armor not found");
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== "placeholder") {
        let path = "";
        try {
          const urlParts = imageUrl.split("/o/");
          if (urlParts.length > 1) {
            path = decodeURIComponent(urlParts[1].split("?")[0]);
          }
          if (path) {
            await deleteObject(ref(storage, path)).catch((e) => {
              if (e.code !== "storage/object-not-found") {
                throw e;
              }
            });
          }
        } catch (e) {
          console.error("Delete image error:", e.message);
          Alert.alert(
            "Warning",
            `Failed to delete image from storage: ${e.message}. Armor will still be deleted.`
          );
        }
      }
      await deleteDoc(armorRef);
      setArmorList(armorList.filter((a) => a.id !== evilSamArmoryId));
      setDeleteModal({ visible: false, armor: null });
      Alert.alert("Success", "Armor deleted successfully!");
    } catch (e) {
      console.error("Delete armor error:", e.message);
      Alert.alert("Error", `Failed to delete armor: ${e.message}`);
    }
  };

  const cardWidth = isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9;

  const renderCharacterCard = (armor) => (
    <View
      key={armor.id || `${armor.name}-${armor.codename}`}
      style={styles.armorCont}
    >
      <TouchableOpacity
        style={[
          styles.card,
          styles.clickable(armor.borderColor || "#800080"),
          { width: cardWidth },
          {
            backgroundColor: "rgba(128, 0, 128, 0.08)",
            shadowColor: "#800080",
            shadowOpacity: 0.8,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 10 },
          },
        ]}
        onPress={() => handleArmorPress(armor)}
        disabled={!armor.clickable}
        activeOpacity={0.9}
      >
        <Image
          source={
            armor.image ||
            (armor.imageUrl && armor.imageUrl !== "placeholder"
              ? { uri: armor.imageUrl }
              : require("../../../assets/Armor/PlaceHolder.jpg"))
          }
          style={styles.armorImage}
          resizeMode="cover"
          onError={(e) =>
            console.error(
              "Image load error:",
              armor.name || armor.codename,
              e.nativeEvent.error
            )
          }
        />
        <View style={styles.transparentOverlay} />
        <Text style={[styles.cardName, { color: "#c38aff" }]}>
          © {armor.name || armor.codename || "Unknown"}; {armor.copyright}
        </Text>
        {!armor.clickable && (
          <Text style={styles.disabledText}>Not Clickable</Text>
        )}
      </TouchableOpacity>
      {!armor.hardcoded && (
        <View style={[styles.buttons, { width: cardWidth }]}>
          <TouchableOpacity
            onPress={() => setPreviewArmor({ ...armor, isEditing: true })}
            style={[styles.editButton, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setDeleteModal({
                visible: true,
                armor: {
                  id: armor.id,
                  name: armor.name || armor.codename || "Unknown",
                },
              })
            }
            style={[styles.deleteButton, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPreviewCard = (armor) => (
    <TouchableOpacity
      key={armor.id || `${armor.name}-${armor.codename}`}
      style={[
        styles.card,
        styles.clickable(armor.borderColor || "#800080"),
        { width: cardWidth },
        {
          backgroundColor: "rgba(128, 0, 128, 0.1)",
          shadowColor: "#800080",
        },
      ]}
      onPress={() => {
        setPreviewArmor(null);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={
          armor.image ||
          (armor.imageUrl && armor.imageUrl !== "placeholder"
            ? { uri: armor.imageUrl }
            : require("../../../assets/Armor/PlaceHolder.jpg"))
        }
        style={styles.armorImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={[styles.cardName, { color: "#c38aff" }]}>
        © {armor.name || armor.codename || "Unknown"}; {armor.copyright}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* 🎧 MUSIC BAR – same layout as Sam, themed purple */}
        <View
          style={[
            styles.musicControls,
            {
              borderBottomColor: "rgba(128, 0, 128, 0.8)",
              shadowColor: "#800080",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => cycleTrack(-1)}
          >
            <Text style={styles.trackButtonText}>⟵</Text>
          </TouchableOpacity>

          <View style={styles.trackInfoGlass}>
            <Text style={styles.trackLabel}>Track:</Text>
            <Text style={styles.trackTitle}>{currentTrack.label}</Text>
          </View>

          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => cycleTrack(1)}
          >
            <Text style={styles.trackButtonText}>⟶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.musicButton,
              isPlaying && styles.musicButtonDisabled,
            ]}
            onPress={playTheme}
            disabled={isPlaying}
          >
            <Text style={styles.musicButtonText}>
              {isPlaying ? "Playing" : "Play"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.musicButtonSecondary,
              !isPlaying && styles.musicButtonDisabled,
            ]}
            onPress={pauseTheme}
            disabled={!isPlaying}
          >
            <Text style={styles.musicButtonTextSecondary}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* HEADER – glass + planet, same layout as Sam but evil themed */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={stopAndGoBack}
              >
                <Text style={styles.backButtonText}>⬅️</Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.headerGlass,
                  {
                    borderColor: "rgba(128, 0, 128, 0.85)",
                    shadowColor: "#800080",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { textShadowColor: "#800080" },
                  ]}
                >
                  Void Walker
                </Text>
                <Text style={styles.subtitle}>
                  Thunder • Maw-Twisted • Pre-Parliament
                </Text>
              </View>

              <TouchableOpacity
                onPress={handlePlanetPress}
                style={styles.planetContainer}
              >
                <Animated.Image
                  source={require("../../../assets/Space/ExoPlanet.jpg")}
                  style={[styles.planetImage, { opacity: flashAnim }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ARMORY SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evil Walker Armory</Text>
            <View className="sectionDivider" style={styles.sectionDivider} />
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.imageScrollContainer}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={windowWidth * 0.7 + 20}
                decelerationRate="fast"
              >
                {armorList.map(renderCharacterCard)}
              </ScrollView>
            </View>
          </View>

          {/* ARMORY FORM */}
          <SamsArmory
            collectionPath="evilSamArmory"
            placeholderImage={require("../../../assets/Armor/PlaceHolder.jpg")}
            friend={armorList}
            setFriend={setArmorList}
            hardcodedFriend={characters}
            editingFriend={previewArmor?.isEditing ? previewArmor : null}
            setEditingFriend={setPreviewArmor}
          />

          {/* ABOUT SECTION – cleaned up, glassy like Sam */}
          <View
            style={[
              styles.aboutSection,
              {
                borderColor: "rgba(128, 0, 128, 0.85)",
                shadowColor: "#800080",
              },
            ]}
          >
            <Text
              style={[
                styles.aboutHeader,
                { textShadowColor: "#800080" },
              ]}
            >
              About Me
            </Text>
            <Text style={styles.aboutText}>
              Early life: Once a young naive teenager that eventually embarked
              on an adventure to another world in a dark mansion realized his
              true potential and destiny.
            </Text>
            <Text style={styles.aboutText}>
              Recent Past: The mansion corrupted his mind and gave him strange
              powers over darkness and electricity. Later after seeing his
              masters ideals as evil he joined the Parliament of Justice and
              created the BludBruhs faction. While forgoing his dark past he
              still held on to the powers he was taught. And a love for Chroma
              who he met when he was still a follower of Erevos. Chroma was
              still corrupted in the shroud of the evil ones.
            </Text>
            <Text style={styles.aboutText}>
              Present: Still extremely conflicted, he caused a rift within the
              BludBruhs causing many to leave him to join a new faction, The
              Monke Alliance. A large bounty was on Sam once he left the evil
              Enlightened.
            </Text>
            <Text style={styles.aboutText}>
              Motives: Wants to use dark powers he learned from the Enlightened
              but the Monke Alliance is against it.
            </Text>
            <Text style={styles.aboutText}>
              ____________________________________________________________________
            </Text>
            <Text style={styles.aboutText}>
              Sam Woodwell, shrouded as “Evil Sam” during this dark chapter, is
              a vengeful and electrifying terror, a mysterious figure stalking
              Zion City’s factions before his reveal to Will “Night Hawk” and
              the Titans. His presence is a storm of malice and power, a
              corrupted blend of darkness and lightning that leaves death in its
              wake. Behind his metallic Jedi robes and floating skull helmet,
              Sam is tormented, ruthless, and driven by a fractured love for
              Chroma and a thirst for revenge against an unknown killer from
              Melcornia. He operates alone, a shadow of his former self,
              targeting The Advanced Spartan 3 Corp, Cobros 314, Olympians,
              Legionaires, and Constellation, his kills a prelude to his Thunder
              Born era. Off the battlefield, he’s a ghost, haunted by his past
              and plotting his next strike, his mind a battlefield of conflict
              and rage.
            </Text>
            <Text style={styles.aboutText}>Backstory</Text>
            <Text style={styles.aboutText}>
              Sam’s journey began as a naive teenager in Zion City’s Terrestrial
              sector, a dreamer who joined Will, Cole, Joseph, James, Tanner,
              Zeke, Elijah, Ammon, Tom, Ethan, Eli, Damon, and others on the
              pre-Parliament adventure to Melcornia. In that dark mansion, his
              family was slaughtered by an unknown figure, and Erevos, a
              sinister entity, promised justice and revenge, corrupting Sam’s
              mind with powers over darkness and electricity. The mansion
              twisted him, and he emerged as a disciple of the Enlightened,
              embracing their evil ideals. His love for Chroma, a fellow
              corrupted soul met under Erevos’s sway, became his anchor amidst
              the chaos.
            </Text>
            <Text style={styles.aboutText}>
              Rather than dying as his crew believed, Sam survived Melcornia,
              vanishing into Zion City’s shadows. Consumed by grief and
              Erevos’s influence, he became “Evil Sam,” a mysterious figure
              wielding his powers to hunt those he blamed for his pain. Before
              revealing himself to Will and the Titans, he unleashed a killing
              spree, targeting The Advanced Spartan 3 Corp—slaughtering Cam
              “Court Chief,” Ben “Chemoshock,” and Alex “Huntsman”—for their
              disciplined strength; Cobros 314—Tanner Despain, Ethan Workman,
              Jonah Gray, Nick Larsen, Alex Wood, and Kyle P—Will’s childhood
              Scout troop, for their ties to his past; Olympians—Gary Jr.,
              Jackson, Garden, Josh, Sean, Heather C., Little Brett, Jake,
              Ailey, Aubrey, James, Kid Ryan, Ryan, Maren, Sasha, Ian, Riker,
              Dakota, Wayne, Christopher, Elizabeth, Tom—Will’s extended family,
              for their unity; and select Legionaires and Constellation members,
              widening his wrath. Each kill fueled his revenge, a dark prelude
              to his redemption arc.
            </Text>
            <Text style={styles.aboutText}>
              When the Parliament of Justice formed, Sam broke from the
              Enlightened, their bounty on his head a mark of his betrayal.
              Joining the Parliament, he formed the Bludbruhs, but this “Evil
              Sam” phase came first, his identity hidden until Will and the
              Titans faced him, shocked to find their lost friend alive and
              twisted. His shift to Thunder Born with Cole, Joseph, James, and
              Tanner marked his attempt at redemption, but this earlier reign of
              terror remains a grim legend.
            </Text>
            <Text style={styles.aboutText}>Abilities</Text>
            <Text style={styles.aboutText}>
              Sam’s corrupted powers and armor grant him a range of devastating
              abilities during his “Evil Sam” phase, blending his original
              skills with a darker edge:
            </Text>
            <Text style={styles.aboutText}>
              Electrical Manipulation: Commands lightning with lethal
              precision, striking foes with bolts or chaining electricity
              through groups, a power amplified by his rage.
            </Text>
            <Text style={styles.aboutText}>
              Telekinesis: Lifts and crushes objects or people with his mind, a
              dark tool of vengeance honed by Erevos, used to dismantle his
              targets.
            </Text>
            <Text style={styles.aboutText}>
              Mind Influence: Bends thoughts and wills with sinister force,
              sowing fear or obedience, a corrupted gift from the Enlightened he
              wields ruthlessly.
            </Text>
            <Text style={styles.aboutText}>
              Dark Surge: Unleashes a wave of shadow and electricity,
              obliterating enemies in a storm of corruption, a signature move of
              his killing spree.
            </Text>
            <Text style={styles.aboutText}>
              Shadow Cloak: Wraps himself in darkness, becoming near-invisible
              to stalk and strike, a stealth tactic that masked his identity as
              the mysterious figure.
            </Text>
            <Text style={styles.aboutText}>
              Personality and Role in the Narrative
            </Text>
            <Text style={styles.aboutText}>
              As “Evil Sam,” he is the storm and vengeance of his own dark tale,
              a solitary force of destruction before his Thunder Born redemption.
              He’s cold, conflicted, and driven by a twisted love for Chroma and
              revenge for Melcornia, his loyalty to his past crew buried under
              rage. His killing spree targeted those tied to Will—Spartans for
              their strength, Cobros for their bonds, Olympians for their
              family, and others for their resistance—each death a strike
              against the world that failed him.
            </Text>
            <Text style={styles.aboutText}>
              In this phase, Sam operated alone, his identity as the mysterious
              figure unknown until Will and the Titans confronted him, revealing
              the friend they thought lost. His shift to Thunder Born with Cole,
              Joseph, James, and Tanner, and the rift with Monkie Alliance,
              followed this terror, marking his struggle to reclaim his
              humanity. In Zion City, his spree left scars—families mourning,
              factions weakened—setting the stage for his redemption arc and the
              Parliament’s uneasy truce. His ultimate goal as “Evil Sam” was to
              punish the unknown killer through proxies, a dark prelude to his
              conflicted present.
            </Text>
            <Text style={styles.aboutText}>
              Before revealing himself, “Evil Sam” emerged as a mysterious
              figure post-Melcornia, his survival hidden as he hunted Zion
              City’s factions. He struck The Advanced Spartan 3 Corp, Cobros
              314, Olympians, Legionaires, and Constellation, killing key
              members in a calculated rampage—retribution for his family’s death
              and a test of his corrupted power. His defeat of these groups
              preceded his Parliament entry, ending when Will and the Titans
              faced him, shocked by his survival and darkness, paving the way
              for his Thunder Born phase and Monkie rivalry.
            </Text>
          </View>
        </ScrollView>

        {/* Preview Modal */}
        {previewArmor && !previewArmor.isEditing && (
          <Modal
            visible={!!previewArmor}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              setPreviewArmor(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  setPreviewArmor(null);
                }}
              >
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={cardWidth}
                    decelerationRate="fast"
                    centerContent={true}
                  >
                    {renderPreviewCard(previewArmor)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text
                    style={[
                      styles.previewCodename,
                      { color: "#c38aff" },
                    ]}
                  >
                    {previewArmor?.codename || "No Codename"}
                  </Text>
                  <Text
                    style={[
                      styles.previewName,
                      { color: "#fff" },
                    ]}
                  >
                    {previewArmor?.name || "Unknown"}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewArmor?.description || "No description available"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setPreviewArmor(null);
                    }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() =>
            setDeleteModal({ visible: false, armor: null })
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.armor?.name || ""}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() =>
                    setDeleteModal({ visible: false, armor: null })
                  }
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.armor &&
                    confirmDelete(deleteModal.armor.id)
                  }
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Styles – heavily based on Sam’s clean glassy UI but tinted purple
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // 🎧 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(9, 4, 20, 0.97)",
    borderBottomWidth: 1,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(210, 170, 255, 0.9)",
    backgroundColor: "rgba(24, 10, 48, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#f7ebff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(18, 6, 40, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(210, 170, 255, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#e0c9ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#f7ebff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(157, 89, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 230, 255, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(20, 6, 46, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(180, 135, 235, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#160020",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#f7ebff",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(20, 8, 46, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(128, 0, 128, 0.85)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: "#f7ebff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(10, 3, 28, 0.96)",
    borderWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fdf7ff",
    textAlign: "center",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    color: "#e0c9ff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  planetContainer: {
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "transparent",
  },
  planetImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    opacity: 0.9,
  },

  // SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 22,
    backgroundColor: "rgba(10, 4, 28, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(128, 0, 128, 0.35)",
    shadowColor: "#800080",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fdf7ff",
    textAlign: "center",
    textShadowColor: "#800080",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  sectionDivider: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(128, 0, 128, 0.9)",
  },

  // IMAGES
  imageContainer: {
    width: "100%",
    paddingVertical: 12,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  armorCont: {
    marginRight: 20,
    alignItems: "center",
  },
  card: {
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  clickable: (borderColor) => ({
    borderWidth: 1,
    borderColor: borderColor || "rgba(255, 255, 255, 0.25)",
  }),
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
  },

  // ARMORY BUTTONS
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  disabled: {
    backgroundColor: "#555",
    opacity: 0.6,
  },

  // ABOUT
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "rgba(7, 3, 24, 0.97)",
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fdf7ff",
    textAlign: "center",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: "#f0e4ff",
    lineHeight: 20,
    marginTop: 8,
    textAlign: "left",
  },

  // MODALS
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOuterContainer: {
    width: "80%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  previewAboutSection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "rgba(10, 4, 30, 0.96)",
    borderRadius: 12,
    width: "100%",
  },
  previewCodename: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  previewName: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  previewDesc: {
    fontSize: 13,
    color: "#f5f5f5",
    textAlign: "center",
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "#7C4DFF",
    padding: 10,
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  modalCancel: {
    backgroundColor: "#7C4DFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalDelete: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EvilSam;
