import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const factions = [
  'The Parliament of Justice', 'Titans', 'Eclipse', 'Olympians', 'Cobros',
  'Advanced Spartan 3 Corp', 'BludBruhs', 'Legionaires', 'Constellation'
];

export const StartScreen = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-1)).current; // Start fully off-screen

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        // Slide in (-150% → 100%)
        Animated.timing(slideAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),

        // Hold at full view (100%)
        Animated.delay(500),

        // Slide out (100% → -150%) covering the text again
        Animated.timing(slideAnim, { toValue: -1, duration: 1500, useNativeDriver: false }),

        // Change the index after slide out
        Animated.delay(500),
      ]).start(() => {
        setIndex((prevIndex) => (prevIndex + 1) % factions.length);
        startAnimation(); // Loop animation
      });
    };

    startAnimation();
  }, []);

  // Tap anywhere to go to Home
  const handlePress = () => {
    navigation.replace('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.staticText}></Text>
          <View style={styles.dynamicTextContainer}>
            <Text style={styles.dynamicText}>{factions[index]}</Text>
            <Animated.View
              style={[
                styles.slideBox,
                {
                  left: slideAnim.interpolate({
                    inputRange: [-1, 1], // Moves from -150% to 150%
                    outputRange: ['-150%', '150%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staticText: {
    fontSize: 40,
    color: 'white',
    fontWeight: '500',
  },
  dynamicTextContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  dynamicText: {
    fontSize: 50,
    fontWeight: '500',
    letterSpacing: 4,
    color: '#b2d7dd',
    textShadowColor: '#00b3ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
  slideBox: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '500%', // Ensure full coverage
    backgroundColor: 'black',
  },
});
