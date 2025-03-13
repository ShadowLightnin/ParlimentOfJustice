import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BludBruhsScreen from '../screens/BludBruhs/BludBruhsScreen';
import TeamChatScreen from "../screens/BludBruhs/TeamChatScreen";

// import {  } from '../screens/BludBruhs/';

const Stack = createNativeStackNavigator();

export function BludBruhsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BludBruhsHome" component={BludBruhsScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
