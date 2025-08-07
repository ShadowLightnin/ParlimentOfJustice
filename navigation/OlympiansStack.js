import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OlympiansScreen } from '../screens/Olympians/OlympiansScreen';
import OlympiansCharacterDetail from '../screens/Olympians/OlympiansCharacterDetail';
import TeamChatScreen from "../screens/Olympians/TeamChatScreen";

// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function OlympiansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OlympiansHome" component={OlympiansScreen} />
      <Stack.Screen name="OlympiansCharacterDetail" component={OlympiansCharacterDetail} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
