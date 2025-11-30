import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { forgeMembers } from './ForgeMembers';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 30 : 20;

const theHammer = forgeMembers.filter(m =>
  ['Glen', 'Ted', 'Marisela', 'Beau', 'Taylor', 'Angie', 'Brad'].includes(m.name)
);
const theAnvil = forgeMembers.filter(m =>
  [
    'Camren',
    'Shailey',
    'Kaitlyn',
    'Emma',
    'Mila',
    'Karrie',
    'Gary',
    'Trevor',
    'Kristin',
    'Kazia',
    'Joe',
    'Jim',
    'Mike',
  ].includes(m.name)
);

// 🔊 AUDIO ASSETS (make sure these exist)
// const forgeTheme = require('../../assets/audio/ForgeTheme.mp3');
// const hammerStrikeSound = require('../../assets/audio/hammer-strike.mp3');

export const ForgeScreen = () => {
  const navigation = useNavigation();

  // Background theme
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animations
  const hammerAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [sparks, setSparks] = useState([]);

  // ───── THEME MUSIC ─────
  const playForgeTheme = useCallback(async () => {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(forgeTheme, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.88,
      });

      setSound(newSound);
      setIsPlaying(true);
    } catch (e) {
      console.log('Forge theme failed:', e);
    }
  }, [sound]);

  const pauseForgeTheme = useCallback(async () => {
    if (!sound) return;
    try {
      await sound.pauseAsync();
    } catch (e) {}
    setIsPlaying(false);
  }, [sound]);

  const stopForgeTheme = useCallback(async () => {
    if (!sound) return;
    try {
      await sound.stopAsync();
    } catch (e) {}
    try {
      await sound.unloadAsync();
    } catch (e) {}
    setSound(null);
    setIsPlaying(false);
  }, [sound]);

  // ───── SPARKS ─────
  const createSparks = () => {
    const newSparks = [];
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.4 - 0.2;
      const velocity = 8 + Math.random() * 12;
      const size = 4 + Math.random() * 8;
      const duration = 600 + Math.random() * 400;

      newSparks.push({
        id: Math.random(),
        angle,
        velocity,
        size,
        duration,
        x: new Animated.Value(SCREEN_WIDTH / 2),
        y: new Animated.Value(SCREEN_HEIGHT * 0.42),
        opacity: new Animated.Value(1),
      });
    }
    return newSparks;
  };

  const triggerStrike = async () => {
    // Hammer SFX
    try {
      const { sound: hit } = await Audio.Sound.createAsync(hammerStrikeSound);
      await hit.playAsync();
      hit.setOnPlaybackStatusUpdate(status => {
        if (status && status.didJustFinish) {
          hit.unloadAsync();
        }
      });
    } catch (e) {
      // ignore if hammer audio missing
    }

    // Hammer animation
    Animated.sequence([
      Animated.timing(hammerAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(hammerAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.elastic(1.3),
        useNativeDriver: true,
      }),
    ]).start();

    // Screen shake
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start();

    // Sparks
    const newSparks = createSparks();
    setSparks(prev => [...prev, ...newSparks]);

    newSparks.forEach(spark => {
      Animated.parallel([
        Animated.timing(spark.x, {
          toValue: SCREEN_WIDTH / 2 + Math.cos(spark.angle) * spark.velocity * 80,
          duration: spark.duration,
          useNativeDriver: true,
        }),
        Animated.timing(spark.y, {
          toValue: SCREEN_HEIGHT * 0.42 + Math.sin(spark.angle) * spark.velocity * 80 - 100,
          duration: spark.duration,
          useNativeDriver: true,
        }),
        Animated.timing(spark.opacity, {
          toValue: 0,
          duration: spark.duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSparks(prev => prev.filter(s => s.id !== spark.id));
      });
    });
  };

  // Hammer loop (same as before)
  const startHammerStrikes = () => {
    const loop = () => {
      const delay = 3800 + Math.random() * 5200;
      setTimeout(() => {
        triggerStrike();
        loop();
      }, delay);
    };
    loop();
  };

  useFocusEffect(
    useCallback(() => {
      startHammerStrikes();
      return () => {
        stopForgeTheme();
      };
    }, [stopForgeTheme])
  );

  const hammerTranslateY = hammerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 60],
  });
  const hammerScale = hammerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const handleMemberPress = async member => {
    await stopForgeTheme();
    navigation.navigate('ForgeCharacterDetail', { member });
  };

  const renderMemberCard = member => {
    const imageSource = member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg');
    return (
      <TouchableOpacity
        key={member.name}
        style={styles.card}
        onPress={() => handleMemberPress(member)}
        activeOpacity={0.85}
      >
        <Image source={imageSource} style={styles.characterImage} resizeMode="cover" />
        <View style={styles.textWrapper}>
          <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
            {member.name}
          </Text>
          <Text
            style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]}
            numberOfLines={2}
          >
            {member.codename}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (members, title) => {
    if (members.length === 0) return null;
    const rows = Math.ceil(members.length / columns);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.divider} />

        {Array.from({ length: rows }).map((_, i) => {
          const start = i * columns;
          const rowMembers = members.slice(start, start + columns);

          return (
            <View
              key={i}
              style={[
                styles.row,
                { gap: horizontalSpacing, marginBottom: i < rows - 1 ? verticalSpacing : 0 },
              ]}
            >
              {rowMembers.map(renderMemberCard)}
              {rowMembers.length < columns &&
                Array.from({ length: columns - rowMembers.length }).map((_, j) => (
                  <View
                    key={`empty-${j}`}
                    style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
                  />
                ))}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Forge.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnim }] }}>
          {/* HEADER */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={async () => {
                await stopForgeTheme();
                navigation.goBack();
              }}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={styles.headerGlass}>
                <Text style={styles.headerTitle}>The Forge</Text>
                <Text style={styles.headerSubtitle}>The workforce of The Parliament</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatButton}
              onPress={async () => {
                await stopForgeTheme();
                navigation.navigate('ForgeChat');
              }}
            >
              <Text style={styles.chatText}>🛡️</Text>
            </TouchableOpacity>
          </View>

          {/* MUSIC CONTROLS */}
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playForgeTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButton} onPress={pauseForgeTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {renderSection(theHammer, 'The Hammer')}
            {renderSection(theAnvil, 'The Anvil')}
          </ScrollView>
        </Animated.View>

        {/* ANIMATED HAMMER */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.hammerContainer,
            { transform: [{ translateY: hammerTranslateY }, { scale: hammerScale }] },
          ]}
        >
          {/* <Image source={require('../../assets/faviconOG.png')} style={styles.hammer} resizeMode="contain" /> */}
        </Animated.View>

        {/* SPARKS */}
        {sparks.map(spark => (
          <Animated.View
            key={spark.id}
            pointerEvents="none"
            style={[
              styles.spark,
              {
                width: spark.size,
                height: spark.size,
                backgroundColor: spark.size > 8 ? '#ff6b35' : '#ff9a35',
                borderRadius: spark.size / 2,
                transform: [{ translateX: spark.x }, { translateY: spark.y }],
                opacity: spark.opacity,
              },
            ]}
          />
        ))}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },

  // HEADER
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(40,10,0,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  backText: { fontSize: 14, color: '#ffddaa', fontWeight: 'bold' },

  headerCenter: { flex: 1, alignItems: 'center' },
  headerGlass: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(30,10,0,0.95)',
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff7ee',
    textAlign: 'center',
    textShadowColor: '#ff6b35',
    textShadowRadius: 24,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    color: '#ffae42',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(40,10,0,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  chatText: { fontSize: 18, color: '#ffddaa', fontWeight: 'bold' },

  // MUSIC
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginVertical: 10,
  },
  musicButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(60,20,0,0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  musicButtonText: {
    color: '#ffddaa',
    fontWeight: 'bold',
    fontSize: 13,
  },

  scrollContainer: { paddingBottom: 80, alignItems: 'center' },

  section: { width: '95%', alignItems: 'center', marginBottom: 50 },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffae42',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#ff6b35',
    textShadowRadius: 16,
  },
  divider: {
    height: 4,
    width: '80%',
    backgroundColor: '#ff6b35',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 2,
    shadowColor: '#ff6b35',
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },

  row: { flexDirection: 'row', justifyContent: 'center' },

  card: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ff6b35',
    backgroundColor: 'rgba(255,107,53,0.15)',
    shadowColor: '#ff6b35',
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 15,
  },
  characterImage: { width: '100%', height: '100%' },
  textWrapper: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  name: { color: '#ffffff', fontWeight: '600', textShadowColor: '#000', textShadowRadius: 10 },
  nameDesktop: { fontSize: 14 },
  nameMobile: { fontSize: 11 },
  codename: {
    color: '#ff6b35',
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 12,
    marginTop: 2,
  },
  codenameDesktop: { fontSize: 18 },
  codenameMobile: { fontSize: 14 },

  hammerContainer: { position: 'absolute', top: '12%', left: '50%', marginLeft: -70, zIndex: 999 },
  hammer: { width: 140, height: 280 },

  spark: {
    position: 'absolute',
    shadowColor: '#ff6b35',
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
});

export default ForgeScreen;
