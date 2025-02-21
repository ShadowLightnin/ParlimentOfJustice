import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SpartansScreen } from '../screens/ASTC/SpartansScreen';
// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function SpartansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SpartansHome" component={SpartansScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
