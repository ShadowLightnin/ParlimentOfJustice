// navigation/PlanetsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlanetsHome from '../screens/Planets/PlanetsHome';
import GalaxyMap from '../screens/Planets/GalaxyMap';

const Stack = createNativeStackNavigator();

export function PlanetsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanetsHome" component={PlanetsHome} />
      <Stack.Screen name="GalaxyMap" component={GalaxyMap} />
    </Stack.Navigator>
  );
}

export default PlanetsStack;
