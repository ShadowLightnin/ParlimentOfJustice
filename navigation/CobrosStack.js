import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CobrosScreen } from '../screens/Cobros/CobrosScreen';
import TeamChatScreen from "../screens/Cobros/TeamChatScreen";

// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function CobrosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CobrosHome" component={CobrosScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
