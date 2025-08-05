import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EclipseScreen from '../screens/Eclipse/EclipseScreen';
import TeamChatScreen from "../screens/Eclipse/TeamChatScreen";
import Aileenchat from "../screens/Eclipse/Aileenchat";

import Aileen from '../screens/Eclipse/Aileen';
import Will from '../screens/Titans/Will';
import WarpScreen from "../screens/Eclipse/WarpScreen";
import Kolob from "../screens/Eclipse/Kolob.js"; // Your new tab screen
import Angels from '../screens/Eclipse/Angels.js';
import BackWarpScreen from "../screens/Eclipse/BackWarpScreen";
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
            <Stack.Screen name="Will" component={Will} />
          <Stack.Screen name="Angels" component={Angels} />
      <Stack.Screen name="Aileenchat" component={Aileenchat} />
      <Stack.Screen name="WarpScreen" component={WarpScreen} />
      <Stack.Screen name="Kolob" component={Kolob} />
      <Stack.Screen name="BackWarpScreen" component={BackWarpScreen} />
      <Stack.Screen name="Myran" component={Myran} />
      <Stack.Screen name="Kelsie" component={Kelsie} />
      <Stack.Screen name="James" component={James} />

    </Stack.Navigator>
  );
}
