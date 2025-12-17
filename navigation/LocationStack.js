// navigation/PlanetsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LocationMapScreen from '../screens/Locations/LocationMapScreen';
import ZionCityScreen from '../screens/Locations/ZionCityScreen';
import AegisCompoundScreen from '../screens/Locations/AegisCompoundScreen';
import OphirCityScreen from '../screens/Locations/OphirCityScreen';
import Labyrinth from '../screens/Locations/Labyrinth';

const Stack = createNativeStackNavigator();

export function LocationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LocationMap" component={LocationMapScreen} />
        <Stack.Screen name="ZionCity" component={ZionCityScreen} />
        <Stack.Screen name="AegisCompound" component={AegisCompoundScreen} />
        <Stack.Screen name="OphirCity" component={OphirCityScreen} />
        <Stack.Screen name="Labyrinth" component={Labyrinth} />
    </Stack.Navigator>
  );
}

export default LocationStack;
