import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LegionairesScreen } from '../screens/Legionaires/LegionairesScreen';
// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function LegionairesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LegionairesHome" component={LegionairesScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
