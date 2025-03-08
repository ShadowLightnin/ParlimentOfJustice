import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ASTCScreen } from '../screens/ASTC/ASTCScreen';
import { SpartansScreen } from '../screens/ASTC/Spartans/SpartansScreen';
// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function SpartansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ASTCHome" component={ASTCScreen} />
      <Stack.Screen name="SpartansScreen" component={SpartansScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
