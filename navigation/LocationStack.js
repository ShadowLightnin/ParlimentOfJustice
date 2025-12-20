// navigation/PlanetsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LocationMapScreen from '../screens/Locations/LocationMap';
import ZionCityScreen from '../screens/Locations/ZionCity';
import AegisCompoundScreen from '../screens/Locations/AegisCompound';
import OphirCityScreen from '../screens/Locations/OphirCity';
import OphiraArchive from '../screens/Locations/OphiraArchive';
import Labyrinth from '../screens/Locations/Labyrinth';
import { JovianDock, SOSInterior } from '../screens/Locations/JovianDock';

const Stack = createNativeStackNavigator();

export function LocationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LocationMap" component={LocationMapScreen} />
        <Stack.Screen name="ZionCity" component={ZionCityScreen} />
        <Stack.Screen name="AegisCompound" component={AegisCompoundScreen} />
        <Stack.Screen name="OphirCity" component={OphirCityScreen} />
        <Stack.Screen name="OphiraArchive" component={OphiraArchive} />
        <Stack.Screen name="Labyrinth" component={Labyrinth} />
        <Stack.Screen name="JovianDock" component={JovianDock} />
        <Stack.Screen name="SOSInterior" component={SOSInterior} />
    </Stack.Navigator>
  );
}

export default LocationStack;
