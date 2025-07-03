import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Hero Screens
import JusticeScreen from '../screens/Justice/JusticeScreen.js';
import Heroes from '../screens/Justice/Heroes.js';

// import Screen from '../screens/Justice/';

const Stack = createNativeStackNavigator();

const JusticeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Base Screens */}
      <Stack.Screen name="Justice" component={JusticeScreen} />
      <Stack.Screen name="Heroes" component={Heroes} />

    </Stack.Navigator>
  );
};

export default JusticeStack;
