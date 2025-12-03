// navigation/PlanetsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlanetsHome from '../screens/Planets/PlanetsHome';
import GalaxyMap from '../screens/Planets/GalaxyMap';
import PinnaclePlanets from '../screens/Planets/PinnaclePlanets';
import PinnacleGalaxyMap from '../screens/Planets/PinnacleSystem';

const Stack = createNativeStackNavigator();

export function PlanetsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanetsHome" component={PlanetsHome} />
      <Stack.Screen name="GalaxyMap" component={GalaxyMap} />
      <Stack.Screen name="PinnaclePlanets" component={PinnaclePlanets} />
      <Stack.Screen name="PinnacleGalaxyMap" component={PinnacleGalaxyMap} />
    </Stack.Navigator>
  );
}

export default PlanetsStack;
