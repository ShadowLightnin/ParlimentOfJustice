import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ForgeScreen } from '../screens/Forge/ForgeScreen';
import TeamChatScreen from "../screens/Forge/TeamChatScreen";

// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function ForgeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ForgeScreen" component={ForgeScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
