import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Get device width

const factions = [
  'The Parliament of Justice', 'Titans', 'Eclipse', 'Olympians', 'Cobros',
  'Advanced Spartan 3 Corp', 'Endogons', 'Legionaires', 'Constellation'
];

export const StartScreen = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.delay(500),
        Animated.timing(slideAnim, { toValue: -1, duration: 1500, useNativeDriver: false }),
        Animated.delay(500),
      ]).start(() => {
        setIndex((prevIndex) => (prevIndex + 1) % factions.length);
        startAnimation();
      });
    };

    startAnimation();
  }, []);

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
                    inputRange: [-1, 1],
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
    paddingHorizontal: 20, // Adds padding for smaller screens
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staticText: {
    fontSize: SCREEN_WIDTH > 600 ? 40 : 20, // ✅ Larger for desktop, smaller for mobile
    color: 'white',
    fontWeight: '500',
  },
  dynamicTextContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  dynamicText: {
    fontSize: SCREEN_WIDTH > 600 ? 50 : 28, // ✅ Scales down text size for mobile
    fontWeight: '500',
    letterSpacing: SCREEN_WIDTH > 600 ? 4 : 2, // ✅ Smaller spacing for smaller screens
    color: '#b2d7dd',
    textShadowColor: '#00b3ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 20,
  },
  slideBox: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '500%', // Ensures full coverage of dynamic text
    backgroundColor: 'black',
  },
});
