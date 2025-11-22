import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConstollationScreen } from '../screens/Constollation/ConstollationScreen';
import ConstollationCharacterDetail from '../screens/Constollation/ConstollationCharacterDetail';
import TeamChatScreen from "../screens/Constollation/TeamChatScreen";

// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function ConstollationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConstollationHome" component={ConstollationScreen} />
      <Stack.Screen name="ConstollationCharacterDetail" component={ConstollationCharacterDetail} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
