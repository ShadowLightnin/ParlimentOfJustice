import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

// 🔥 Background Music Component
const BackgroundMusic = () => {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function playMusic() {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/Halo2.wav'), // ✅ Add your own music file
        { shouldPlay: true, isLooping: true }
      );

      if (isMounted) setSound(sound);
      await sound.playAsync();
    }

    playMusic();

    return () => {
      isMounted = false;
      if (sound) sound.unloadAsync();
    };
  }, []);

  return null;
};

// 🔥 Member Data
const members = [
  { name: 'The Spartans', codename: '', screen: '', clickable: true, position: [1, 1] },
];

// Function to check if a position should be empty
const isEmpty = (row, col) =>
  (row === 0 && col === 0) || (row === 0 && col === 1) || (row === 0 && col === 2) ||
  (row === 1 && col === 0) || (row === 1 && col === 2) || (row === 2 && col === 0) ||
  (row === 2 && col === 1) || (row === 2 && col === 2);

// Function to get a member at a specific position
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

// 🔥 Random Backgrounds
const backgrounds = [
  require('../../assets/Halo/1.jpg'),
  require('../../assets/Halo/2.jpg'),
  require('../../assets/Halo/4.jpg'),
  require('../../assets/Halo/6.jpg'),
  require('../../assets/Halo/7.jpg'),
  require('../../assets/Halo/8.jpg'),
  require('../../assets/Halo/18.jpg'),
  require('../../assets/Halo/32.png'),
  require('../../assets/Halo/12.jpg'),
  require('../../assets/Halo/33.jpg'),
  require('../../assets/Halo/14.jpg'),
  require('../../assets/Halo/19.jpg'),
  require('../../assets/Halo/17.jpg'),
];

export const ASTCScreen = () => {
  const navigation = useNavigation();
  const [background, setBackground] = useState(backgrounds[Math.floor(Math.random() * backgrounds.length)]);

  // 🏗️ Animation for Image Sliding Down
  const topPosition = useState(new Animated.Value(-400))[0]; // Start off-screen

  const startAnimation = () => {
    Animated.sequence([
      // Move down halfway
      Animated.timing(topPosition, { toValue: 250, duration: 3000, useNativeDriver: false }),

      // Pause for dramatic effect (1 second)
      Animated.delay(1000),

      // Move down further before transition (optional)
      Animated.timing(topPosition, { toValue: 400, duration: 1500, useNativeDriver: false }),

      // Transition to SpartanScreen
    ]).start(() => navigation.navigate('SpartanScreen'));
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* ✅ Background Music */}
        <BackgroundMusic />

        {/* 🔥 Activation Animation */}
        <Animated.View style={[styles.imageContainer, { top: topPosition }]}>
          <Image source={require('../../assets/Halo/Activation_Index.jpg')} style={styles.image} />
        </Animated.View>

        {/* 🔘 Activate Button */}
        <TouchableOpacity style={styles.activateButton} onPress={startAnimation}>
          <Text style={styles.activateText}>Activate</Text>
        </TouchableOpacity>

        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Advanced Spartan 3 Corp</Text>
        </View>

        {/* 🔲 Grid Layout */}
        <View style={styles.grid}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.row}>
              {[0, 1, 2].map((col) => {
                if (isEmpty(row, col)) {
                  return <View key={col} style={styles.emptyCell} />;
                }

                const member = getMemberAtPosition(row, col);
                return (
                  <TouchableOpacity
                    key={col}
                    style={[styles.card, !member?.clickable && styles.disabledCard]}
                    onPress={() => member?.clickable && navigation.navigate(member.screen)}
                    disabled={!member?.clickable}
                  >
                    {/* Character Image */}
                    {member?.image && <Image source={member.image} style={styles.characterImage} />}

                    {/* Name & Codename */}
                    <Text style={styles.name}>{member?.name || ''}</Text>
                    <Text style={styles.codename}>{member?.codename || ''}</Text>

                    {/* Disabled Text */}
                    {!member?.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center' },
  headerWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 50, paddingHorizontal: 20, marginBottom: 20 },
  backButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', textShadowColor: '#00b3ff', textShadowRadius: 15, textAlign: 'center', flex: 1 },
  grid: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -40 },
  row: { flexDirection: 'row' },
  emptyCell: { width: 100, height: 140, margin: 10 },
  card: { width: 100, height: 160, margin: 10, backgroundColor: '#1c1c1c', justifyContent: 'center', alignItems: 'center', borderRadius: 8, shadowColor: '#00b3ff', shadowOpacity: 1.5, shadowRadius: 10, elevation: 5, padding: 5 },
  characterImage: { width: '100%', height: 100, resizeMode: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  name: { fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 5 },
  codename: { fontSize: 10, fontStyle: 'italic', color: '#aaa', textAlign: 'center' },
  disabledCard: { backgroundColor: '#444', shadowColor: 'transparent' },
  disabledText: { fontSize: 10, color: '#ff4444', textAlign: 'center', marginTop: 5 },

   // 🔥 Image Animation Styles
   imageContainer: { position: 'absolute', left: '47.2%', transform: [{ translateX: -50 }] },
   image: { width: 200, height: 200, resizeMode: 'contain' },
 
   // 🔘 Activate Button
   activateButton: { marginTop: 30, padding: 15, backgroundColor: '#00b3ff', borderRadius: 5 },
   activateText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
