import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Audio } from "expo-av";
import { db, auth, storage } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import SamsArmory from "./SamsArmory";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🎧 Void Walker / Thunder Born tracks (you can swap/add later)
const TRACKS = [
  {
    id: "voidwalker_main",
    label: "Void Walker Good",
    source: require("../../assets/audio/goodWalker.m4a"),
  },
  {
    id: "thunder_born",
    label: "Void Walker Bad",
    source: require("../../assets/audio/evilWalker.m4a"),
  },
];

const armors = [
  {
    id: "sam-1",
    name: "Void Walker",
    codename: "Void Walker",
    copyright: "William Cummings",
    image: require("../../assets/Armor/Sam.jpg"),
    clickable: true,
    hardcoded: true,
  },
  // {
  //   id: "sam-2",
  //   name: "Legacy",
  //   codename: "Legacy",
  //   copyright: "William Cummings",
  //   image: require("../../assets/Armor/SamLegacy.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-3",
  //   name: "Void Walker",
  //   codename: "Void Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam8.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-4",
  //   name: "Void Walker",
  //   codename: "Void Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam9.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-5",
  //   name: "Void Walker",
  //   codename: "Void Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam4.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-6",
  //   name: "Void Walker",
  //   codename: "Void Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam7.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-7",
  //   name: "Void Walker",
  //   codename: "Void Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam3.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-8",
  //   name: "Void Walker",
  //   codename: "Void Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam5.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
  // {
  //   id: "sam-9",
  //   name: "Celestial Walker",
  //   codename: "Celestial Walker",
  //   copyright: "Samuel Woodwell",
  //   image: require("../../assets/Armor/Sam10.jpg"),
  //   clickable: true,
  //   hardcoded: true,
  // },
];

// IDs to exclude in Pinnacle Universe
const pinnacleExclusions = [
  "sam-2",
  "sam-3",
  "sam-4",
  "sam-5",
  "sam-6",
  "sam-7",
  "sam-8",
  "sam-9",
];

const ALLOWED_EMAILS = [
  "will@test.com",
  "c1wcummings@gmail.com",
  "samuelp.woodwell@gmail.com",
];
const RESTRICT_ACCESS = true;

const Sam = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flashAnim = useRef(new Animated.Value(1)).current;

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [fromBludBruhsHome, setFromBludBruhsHome] = useState(false);
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [armorList, setArmorList] = useState(armors);
  const [previewArmor, setPreviewArmor] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, armor: null });
  const [isYourUniverse, setIsYourUniverse] = useState(null);

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;
  const isDesktop = windowWidth >= 768;

  // 🎧 local audio state (like Jennifer)
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  // ───────── UNIVERSE PREFERENCE ─────────
  useEffect(() => {
    const loadUniversePreference = async () => {
      try {
        const savedUniverse = await AsyncStorage.getItem("selectedUniverse");
        setIsYourUniverse(savedUniverse ? savedUniverse === "your" : true); // Default to Prime
      } catch (error) {
        console.error("Error loading universe preference:", error);
        setIsYourUniverse(true);
      }
    };
    loadUniversePreference();
  }, []);

  // Route params
  useEffect(() => {
    const params = route.params || {};
    console.log("Route params on mount:", params);
    if (params.from === "BludBruhsHome") {
      setFromBludBruhsHome(true);
      setHasShownPopup(false);
      console.log(
        "Set fromBludBruhsHome to true at:",
        new Date().toISOString()
      );
    } else {
      setFromBludBruhsHome(false);
      console.log(
        "Set fromBludBruhsHome to false at:",
        new Date().toISOString()
      );
    }
  }, [route.params]);

  // Pulsing planet animation
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
  }, []);

  // Responsive layout
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // ───────── AUDIO HELPERS (no autoplay) ─────────
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
        console.error("Failed to play Sam track", e);
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

  // ───────── FIRESTORE ARMORY ─────────
  useEffect(() => {
    const validatedArmors = armors.map((armor, index) => ({
      ...armor,
      id: armor.id || `sam-armor-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    console.log(
      "Validated Armors:",
      validatedArmors.map((a) => ({ id: a.id, name: a.name, codename: a.codename }))
    );
    setArmorList(validatedArmors);

    const unsub = onSnapshot(
      collection(db, "samArmory"),
      (snap) => {
        if (snap.empty) {
          console.log("No armor found in Firestore");
          setArmorList(validatedArmors);
          return;
        }
        const dynamicArmors = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor:
            docSnap.data().borderColor ||
            (isYourUniverse ? "#00b3ff" : "#800080"),
          hardcoded: false,
          copyright: "Samuel Woodwell",
        }));
        console.log(
          "Fetched dynamic armors:",
          dynamicArmors.map((a) => ({ id: a.id, name: a.name || a.codename }))
        );

        const filteredDynamic = dynamicArmors.filter(
          (dynamic) =>
            !validatedArmors.some(
              (armor) =>
                armor.id === dynamic.id ||
                armor.name === (dynamic.name || dynamic.codename) ||
                armor.codename === (dynamic.name || dynamic.codename)
            )
        );
        console.log(
          "Filtered dynamic armors:",
          filteredDynamic.map((a) => ({ id: a.id, name: a.name || a.codename }))
        );

        // Added ones First
        // const combined = [...filteredDynamic, ...validatedArmors].filter(
        //   (armor) => isYourUniverse || !pinnacleExclusions.includes(armor.id)
        // );

        // Hardcoded first, then dynamic (only those that don't conflict)
        const combined = [
          ...validatedArmors,           // Hardcoded ones FIRST
          ...filteredDynamic,           // Then safe dynamic ones
        ].filter(
          (armor) => isYourUniverse || !pinnacleExclusions.includes(armor.id)
        );

        console.log(
          "Combined armors (after universe filter, dynamic first):",
          combined.map((a) => ({ id: a.id, name: a.name || a.codename }))
        );

        setArmorList(combined);
      },
      (e) => {
        console.error("Firestore error:", e.code, e.message);
        Alert.alert("Error", `Failed to fetch armors: ${e.message}`);
      }
    );
    return () => unsub();
  }, [isYourUniverse]);

  // ───────── NAV HANDLERS (stop audio then move) ─────────
  const handlePlanetPress = async () => {
    console.log(
      "Planet pressed, stopping music and navigating to WarpScreen at:",
      new Date().toISOString()
    );
    await unloadSound();
    setIsPlaying(false);
    navigation.navigate("WarpScreen", { from: "Sam" });
  };

  const handleBackPress = async () => {
    console.log("Back button pressed at:", new Date().toISOString());
    await unloadSound();
    setIsPlaying(false);
    navigation.navigate("BludBruhsHome");
  };

  const handleArmorPress = (armor) => {
    if (!armor?.clickable) {
      console.log("Armor card not clickable:", armor?.name || armor?.codename);
      return;
    }
    console.log("Armor card pressed:", armor.name || armor.codename);
    setPreviewArmor(armor);
  };

  const confirmDelete = async (samArmoryId) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert("Access Denied", "Only authorized users can delete armors.");
      return;
    }
    try {
      const armorItem = armorList.find((a) => a.id === samArmoryId);
      if (armorItem.hardcoded) {
        Alert.alert("Error", "Cannot delete hardcoded armors!");
        return;
      }
      const armorRef = doc(db, "samArmory", samArmoryId);
      const snap = await getDoc(armorRef);
      if (!snap.exists()) {
        Alert.alert("Error", "Armor not found");
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== "placeholder") {
        let path = "";
        try {
          console.log("Raw imageUrl:", imageUrl);
          const urlParts = imageUrl.split("/o/");
          if (urlParts.length > 1) {
            path = decodeURIComponent(urlParts[1].split("?")[0]);
          }
          if (!path) {
            console.warn("No valid path extracted from imageUrl:", imageUrl);
          } else {
            console.log("Attempting to delete image:", path);
            await deleteObject(ref(storage, path)).catch((e) => {
              if (e.code !== "storage/object-not-found") {
                throw e;
              }
              console.warn("Image not found in storage:", path);
            });
            console.log("Image deleted or not found:", path);
          }
        } catch (e) {
          console.error(
            "Delete image error:",
            e.message,
            "Path:",
            path,
            "URL:",
            imageUrl
          );
          Alert.alert(
            "Warning",
            `Failed to delete image from storage: ${e.message}. Armor will still be deleted.`
          );
        }
      }
      await deleteDoc(armorRef);
      console.log("Armor deleted from Firestore:", samArmoryId);
      setArmorList(armorList.filter((a) => a.id !== samArmoryId));
      setDeleteModal({ visible: false, armor: null });
      Alert.alert("Success", "Armor deleted successfully!");
    } catch (e) {
      console.error("Delete armor error:", e.message);
      Alert.alert("Error", `Failed to delete armor: ${e.message}`);
    }
  };

  const cardWidth = isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9;

  const renderArmorCard = (armor) => (
    <View
      key={armor.id || `${armor.name}-${armor.codename}`}
      style={styles.armorCont}
    >
      <TouchableOpacity
        style={[
          styles.card,
          armor.clickable
            ? styles.clickable(
                armor.borderColor || (isYourUniverse ? "#00b3ff" : "#800080")
              )
            : styles.notClickable,
          { width: cardWidth },
          {
            backgroundColor: isYourUniverse
              ? "rgba(0, 179, 255, 0.08)"
              : "rgba(128, 0, 128, 0.08)",
            shadowColor: isYourUniverse ? "#00b3ff" : "#800080",
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
              : require("../../assets/Armor/PlaceHolder.jpg"))
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
        <Text
          style={[
            styles.cardName,
            { color: isYourUniverse ? "#00d4ff" : "#c38aff" },
          ]}
        >
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
        styles.clickable(
          armor.borderColor || (isYourUniverse ? "#00b3ff" : "#800080")
        ),
        { width: cardWidth },
        {
          backgroundColor: isYourUniverse
            ? "rgba(0, 179, 255, 0.1)"
            : "rgba(128, 0, 128, 0.1)",
          shadowColor: isYourUniverse ? "#00b3ff" : "#800080",
        },
      ]}
      onPress={() => {
        console.log("Closing preview modal");
        setPreviewArmor(null);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={
          armor.image ||
          (armor.imageUrl && armor.imageUrl !== "placeholder"
            ? { uri: armor.imageUrl }
            : require("../../assets/Armor/PlaceHolder.jpg"))
        }
        style={styles.armorImage}
        resizeMode="cover"
        onError={(e) =>
          console.error(
            "Preview image load error:",
            armor.name || armor.codename,
            e.nativeEvent.error
          )
        }
      />
      <View style={styles.transparentOverlay} />
      <Text
        style={[
          styles.cardName,
          { color: isYourUniverse ? "#00d4ff" : "#c38aff" },
        ]}
      >
        © {armor.name || armor.codename || "Unknown"}; {armor.copyright}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – with track cycling, no autoplay */}
      <View
        style={[
          styles.musicControls,
          {
            borderBottomColor: isYourUniverse
              ? "rgba(0, 179, 255, 0.8)"
              : "rgba(128, 0, 128, 0.8)",
            shadowColor: isYourUniverse ? "#00b3ff" : "#800080",
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
          style={[styles.musicButton, isPlaying && styles.musicButtonDisabled]}
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
        {/* HEADER – glass + planet */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.headerGlass,
                {
                  borderColor: isYourUniverse
                    ? "rgba(0, 179, 255, 0.8)"
                    : "rgba(128, 0, 128, 0.8)",
                  shadowColor: isYourUniverse ? "#00b3ff" : "#800080",
                },
              ]}
            >
              <Text
                style={[
                  styles.title,
                  {
                    textShadowColor: isYourUniverse ? "#00b3ff" : "#800080",
                  },
                ]}
              >
                Void Walker
              </Text>
              <Text style={styles.subtitle}>
                Determined • Maw-Touched • Protector
              </Text>
            </View>

            <TouchableOpacity
              onPress={handlePlanetPress}
              style={styles.planetContainer}
            >
              <Animated.Image
                source={require("../../assets/Space/ExoPlanet2.jpg")}
                style={[styles.planetImage, { opacity: flashAnim }]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Void Walker Armory</Text>
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
              {armorList.map(renderArmorCard)}
            </ScrollView>
          </View>
        </View>

        <SamsArmory
          collectionPath="samArmory"
          placeholderImage={require("../../assets/Armor/PlaceHolder.jpg")}
          friend={armorList}
          setFriend={setArmorList}
          hardcodedFriend={armors}
          editingFriend={previewArmor?.isEditing ? previewArmor : null}
          setEditingFriend={setPreviewArmor}
        />

        {/* ABOUT SECTION */}
        <View
          style={[
            styles.aboutSection,
            {
              borderColor: isYourUniverse
                ? "rgba(0, 179, 255, 0.85)"
                : "rgba(128, 0, 128, 0.85)",
              shadowColor: isYourUniverse ? "#00b3ff" : "#800080",
            },
          ]}
        >
          <Text
            style={[
              styles.aboutHeader,
              { textShadowColor: isYourUniverse ? "#00b3ff" : "#800080" },
            ]}
          >
            About Me
          </Text>
          <Text style={styles.aboutText}>
            Sam Woodwell, known as Void Walker, is a tempest of power and
            turmoil, the conflicted leader of the Thunder Born, a faction born
            from the ashes of the Bludbruhs within Zion City’s evolving
            landscape. His presence is electric and commanding, a volatile mix
            of dark mastery and raw energy that makes him both a force and a
            liability. Behind his metallic Jedi robes and floating skull helmet,
            Sam is intense, driven, and torn between his past corruption and
            present redemption, his heart anchored by a lingering love for
            Chroma, a figure still shrouded in evil. He’s tied to his former
            Bludbruhs—Cole “Cruiser,” Joseph “Techoman,” James “Shadowmind,”
            and Tanner - Wolff—but his rift with them marks a new chapter. Off
            the battlefield, he’s a brooding strategist, wrestling with his
            demons, but his dark powers often alienate those he seeks to
            protect.
          </Text>
          <Text style={styles.aboutText}>Backstory</Text>
          <Text style={styles.aboutText}>
            Sam’s journey began as a naive teenager in Zion City’s Terrestrial
            sector, a dreamer who stumbled into a life-altering adventure.
            Alongside Will (later “Night Hawk”), Joseph, James, Cole, Tanner,
            Zeke, Elijah, Tom, and others, he ventured to the planet Melcornia,
            a pre-Parliament expedition that tested their mettle. In a dark
            mansion on that alien world, Sam’s family was killed by an unknown
            figure, shattering his innocence. A sinister entity, Erevos,
            promised justice and revenge, corrupting Sam’s mind with strange
            powers over darkness and electricity. The mansion amplified his
            grief into a weapon, and he embraced Erevos’s teachings, unaware of
            their evil.
          </Text>
          <Text style={styles.aboutText}>
            The Melcornia crew returned fractured, believing Sam dead, but he
            survived, twisted by Erevos and the Enlightened faction. Years
            later, after seeing Erevos’s ideals as malevolent, Sam broke free,
            retaining his dark powers and a love for Chroma, a corrupted ally he
            met under Erevos’s sway. Seeking redemption, he joined the nascent
            Parliament of Justice and formed the Bludbruhs with Cole, Joseph,
            James, and Tanner, a brotherhood forged to fight Zion City’s chaos.
            But Sam’s inner conflict—his reliance on dark powers versus his
            desire for good—caused a rift. Many, including Tanner, left for the
            Monkie Alliance, rejecting his methods. With a bounty from the
            Enlightened on his head, Sam rebranded the remnants as Thunder Born,
            a name reflecting his electrical might and a fresh start from the
            Bludbruhs’ tainted legacy.
          </Text>
          <Text style={styles.aboutText}>
            When the Titans formed, Will and his team were the first to face
            “Evil Sam,” unaware of his survival until that clash, setting the
            stage for a reckoning between his past and present.
          </Text>
          <Text style={styles.aboutText}>Abilities</Text>
          <Text style={styles.aboutText}>
            Sam’s armor and corrupted powers grant him a range of abilities
            blending electricity, telekinesis, and influence, shaped by his
            Melcornia ordeal:
          </Text>
          <Text style={styles.aboutText}>
            Electrical Manipulation: Controls and generates lightning-like
            energy, striking foes or powering his surroundings, a gift from the
            mansion’s corruption amplified by his will.
          </Text>
          <Text style={styles.aboutText}>
            Telekinesis: Lifts and moves objects or people with his mind, a dark
            skill honed by Erevos, used for both combat and utility, reflecting
            his mental strength.
          </Text>
          <Text style={styles.aboutText}>
            Mind Influence: Subtly sways thoughts or emotions, a lingering taint
            from the Enlightened, effective for persuasion or control, though he
            resists its full potential.
          </Text>
          <Text style={styles.aboutText}>
            Dark Surge: Combines electricity and shadow into a devastating
            burst, a remnant of his dark past, capable of overwhelming enemies
            but taxing his resolve.
          </Text>
          <Text style={styles.aboutText}>
            Storm Presence: Projects an aura of crackling energy, intimidating
            foes and inspiring allies, a natural extension of his Thunder Born
            identity.
          </Text>
          <Text style={styles.aboutText}>Personality and Role in the Team</Text>
          <Text style={styles.aboutText}>
            Sam is the storm and soul of the Thunder Born, a leader whose
            electrical might and dark past define his fractured path. He’s
            brooding, determined, and deeply conflicted, torn between the powers
            Erevos gave him and the redemption he seeks with the Parliament. His
            love for Chroma fuels his hope, but her corruption mirrors his own
            struggle.
          </Text>
          <Text style={styles.aboutText}>
            In the Thunder Born (formerly Bludbruhs), Sam’s rift with Zeke,
            Elijah, Tom, and Ammon marks a turning point—his dark surge clashed
            with their ideals, birthing the Monkie Alliance as they split. With
            Cole, he shared combat trust; with Joseph, tech synergy; with James,
            shadow tactics; and with Tanner, primal strength. Now, as Thunder
            Born, he leads a smaller, loyal remnant, redefining their purpose.
            His clash with Will and the Titans reveals his survival, setting up
            a redemption arc or rivalry.
          </Text>
          <Text style={styles.aboutText}>
            In Zion City, Sam’s bounty from the Enlightened makes him a target,
            but his Thunder Born faction aims to harness his powers for good.
            His ultimate goal is to avenge his family, free Chroma, and prove
            his dark legacy can thunder into something heroic.
          </Text>
          <Text style={styles.aboutText}>
            The Bludbruhs ended when Sam’s reliance on his dark powers—taught by
            Erevos and the Enlightened—fractured the group. After joining the
            Parliament of Justice, Sam tried to suppress his past, but a mission
            gone wrong unleashed his dark surge, alienating his team. Zeke,
            Elijah, and others left for the Monkie Alliance, seeking a path free
            of shadow. Sam, left with a loyal few, embraced his electrical core
            over his dark roots, renaming the faction Thunder Born—a rebirth
            symbolizing his lightning might and a break from the blood-soaked
            “Bludbruhs” name tied to his corrupted past.
          </Text>
        </View>
      </ScrollView>

      {previewArmor && !previewArmor.isEditing && (
        <Modal
          visible={!!previewArmor}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            console.log("Closing preview modal");
            setPreviewArmor(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => {
                console.log("Closing preview modal");
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
                    { color: isYourUniverse ? "#00d4ff" : "#c38aff" },
                  ]}
                >
                  {previewArmor?.codename || "No Codename"}
                </Text>
                <Text
                  style={[
                    styles.previewName,
                    { color: isYourUniverse ? "#fff" : "#ddd" },
                  ]}
                >
                  {previewArmor?.name || "Unknown"}
                </Text>
                <Text style={styles.previewDesc}>
                  {previewArmor?.description || "No description available"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Closing preview modal");
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
                  deleteModal.armor && confirmDelete(deleteModal.armor.id)
                }
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ───────── STYLES ─────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03040a",
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
    backgroundColor: "rgba(5, 7, 20, 0.97)",
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
    borderColor: "rgba(160, 190, 255, 0.9)",
    backgroundColor: "rgba(10, 18, 40, 0.95)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e4f5ff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(8, 14, 32, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(160, 190, 255, 0.8)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#9fd2ff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e4f5ff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 190, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(230, 250, 255, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(10, 16, 40, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(140, 160, 210, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#021018",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#f1f5ff",
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
    backgroundColor: "rgba(10, 16, 40, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.85)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: "#e7f2ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(5, 10, 28, 0.96)",
    borderWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f5fbff",
    textAlign: "center",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#9fd2ff",
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
    backgroundColor: "rgba(5, 9, 24, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 179, 255, 0.35)",
    shadowColor: "#00b3ff",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f5fbff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
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
    backgroundColor: "rgba(0, 179, 255, 0.9)",
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
    backgroundColor: "rgba(5, 10, 30, 0.97)",
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f5fbff",
    textAlign: "center",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: "#e4ecff",
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
    backgroundColor: "rgba(10, 14, 32, 0.96)",
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
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 6,
    alignSelf: "center",
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
    backgroundColor: "#2196F3",
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

export default Sam;
