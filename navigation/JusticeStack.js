import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Hero Screens
import Justice from '../screens/Justice/JusticeScreen.js';
import JusticeCharacterDetail from '../screens/Justice/JusticeCharacterDetail.js';
import Heroes from '../screens/Justice/Heroes.js';
import VigilanteScreen from '../screens/Justice/Vigilantes.js';

// import Screen from '../screens/Justice/';

const Stack = createNativeStackNavigator();

const JusticeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Base Screens */}
      <Stack.Screen name="Justice" component={Justice} />
      <Stack.Screen name="JusticeCharacterDetail" component={JusticeCharacterDetail} />
      <Stack.Screen name="Heroes" component={Heroes} />
      <Stack.Screen name="VigilanteScreen" component={VigilanteScreen} />

    </Stack.Navigator>
  );
};

export default JusticeStack;
