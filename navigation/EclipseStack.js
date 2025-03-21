import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EclipseScreen from '../screens/Eclipse/EclipseScreen';
import TeamChatScreen from "../screens/Eclipse/TeamChatScreen";

import Aileen from '../screens/Eclipse/Aileen';
import Myran from '../screens/Eclipse/Myran';
import Kelsie from '../screens/Eclipse/Kelsie';
import James from '../screens/Eclipse/James';

// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function EclipseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EclipseHome" component={EclipseScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="Aileen" component={Aileen} />
      <Stack.Screen name="Myran" component={Myran} />
      <Stack.Screen name="Kelsie" component={Kelsie} />
      <Stack.Screen name="James" component={James} />

    </Stack.Navigator>
  );
}
