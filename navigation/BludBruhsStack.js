import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BludBruhsScreen } from '../screens/BludBruhs/BludBruhsScreen';
// import {  } from '../screens/BludBruhs/';

const Stack = createNativeStackNavigator();

export function BludBruhsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BludBruhsHome" component={BludBruhsScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
