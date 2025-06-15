import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Hero Screens
import ShipYardScreen from '../screens/ShipYard/ShipYardScreen';

// import Screen from '../screens/Justice/';

const Stack = createNativeStackNavigator();

const ShipYardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Base Screens */}
      <Stack.Screen name="ShipYardScreen" component={ShipYardScreen} />

    </Stack.Navigator>
  );
};

export default ShipYardStack;
