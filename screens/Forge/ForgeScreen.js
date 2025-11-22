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
  ['Glen', 'Ted', 'Marisela', 'Beau', 'Taylor', 'Angie'].includes(m.name)
);
const theAnvil = forgeMembers.filter(m =>
  ['Camren', 'Shailey', 'Kaitlyn', 'Emma', 'Mila', 'Karrie', 'Gary', 'Trevor', 'Kristin'].includes(m.name)
);

// const forgeTheme = require('../../assets/audio/ForgeTheme.mp3');
// const hammerStrikeSound = require('../../assets/audio/hammer-strike.mp3');

export const ForgeScreen = () => {
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);
  const hammerAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [sparks, setSparks] = useState([]);

  const playForgeTheme = async () => {
    if (sound) return;
    const { sound: newSound } = await Audio.Sound.createAsync(forgeTheme, {
      shouldPlay: true,
      isLooping: true,
      volume: 0.88,
    });
    setSound(newSound);
  };

  const stopForgeTheme = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      playForgeTheme();
      startHammerStrikes();
      return () => stopForgeTheme();
    }, [])
  );

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
    // Hammer sound
    try {
      const { sound: hit } = await Audio.Sound.createAsync(hammerStrikeSound);
      await hit.playAsync();
      hit.setOnPlaybackStatusUpdate(s => s.didJustFinish && hit.unloadAsync());
    } catch (e) {}

    // Hammer animation
    Animated.sequence([
      Animated.timing(hammerAnim, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(hammerAnim, { toValue: 0, duration: 700, easing: Easing.elastic(1.3), useNativeDriver: true }),
    ]).start();

    // Screen shake
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start();

    // SPARKS
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

  const hammerTranslateY = hammerAnim.interpolate({ inputRange: [0, 1], outputRange: [-140, 60] });
  const hammerScale = hammerAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });

  const handleMemberPress = async (member) => {
    await stopForgeTheme();
    navigation.navigate('ForgeCharacterDetail', { member });
  };

  const renderMemberCard = (member) => {
    const imageSource = member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg');
    return (
      <TouchableOpacity key={member.name} style={styles.card} onPress={() => handleMemberPress(member)} activeOpacity={0.85}>
        <Image source={imageSource} style={styles.characterImage} resizeMode="cover" />
        <View style={styles.textWrapper}>
          <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>{member.name}</Text>
          <Text style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]} numberOfLines={2}>
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
                styles.row, // ← FIXED: was styles.Rows
                { gap: horizontalSpacing, marginBottom: i < rows - 1 ? verticalSpacing : 0 },
              ]}
            >
              {rowMembers.map(renderMemberCard)}
              {rowMembers.length < columns &&
                Array.from({ length: columns - rowMembers.length }).map((_, j) => (
                  <View key={`empty-${j}`} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />
                ))}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ImageBackground source={require('../../assets/BackGround/Forge.jpg')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnim }] }}>
          <View style={styles.headerWrapper}>
            <TouchableOpacity style={styles.backButton} onPress={async () => { await stopForgeTheme(); navigation.goBack(); }}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.header}>The Forge</Text>
            <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ForgeChat')}>
              <Text style={styles.chatText}>🛡️</Text>
            </TouchableOpacity>
          </View>

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
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10 },
  backButton: { padding: 12, backgroundColor: 'rgba(255,107,53,0.3)', borderRadius: 8, borderWidth: 1, borderColor: '#ff6b35' },
  backText: { fontSize: 18, color: '#ffae42', fontWeight: 'bold' },
  header: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', flex: 1, textShadowColor: '#ff6b35', textShadowRadius: 40 },
  chatButton: { padding: 12, backgroundColor: 'rgba(255,107,53,0.3)', borderRadius: 8, borderWidth: 1, borderColor: '#ff6b35' },
  chatText: { fontSize: 24, color: '#ffae42', fontWeight: 'bold' },
  scrollContainer: { paddingBottom: 80, alignItems: 'center' },

  section: { width: '95%', alignItems: 'center', marginBottom: 50 },
  sectionTitle: { fontSize: 34, fontWeight: '900', color: '#ffae42', textAlign: 'center', letterSpacing: 1, textShadowColor: '#ff6b35', textShadowRadius: 16 },
  divider: { height: 4, width: '80%', backgroundColor: '#ff6b35', marginTop: 10, marginBottom: 20, borderRadius: 2, shadowColor: '#ff6b35', shadowOpacity: 1, shadowRadius: 12, elevation: 10 },

  row: { flexDirection: 'row', justifyContent: 'center' }, // ← Correct style name

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
  codename: { color: '#ff6b35', fontWeight: '900', textShadowColor: '#000', textShadowRadius: 12, marginTop: 2 },
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