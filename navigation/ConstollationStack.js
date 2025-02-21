import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConstollationScreen } from '../screens/Constollation/ConstollationScreen';
// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function ConstollationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConstollationHome" component={ConstollationScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
