import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EclipseScreen from '../screens/Eclipse/EclipseScreen';
import TeamChatScreen from "../screens/Eclipse/TeamChatScreen";

import Aileen from '../screens/Eclipse/Aileen';

const Stack = createNativeStackNavigator();

export function EclipseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EclipseHome" component={EclipseScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="Aileen" component={Aileen} />
    </Stack.Navigator>
  );
}
