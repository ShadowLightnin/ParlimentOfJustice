import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ASTCScreen from '../screens/ASTC/ASTCScreen';
import SpartansScreen from '../screens/ASTC/Spartans/SpartansScreen';
import TeamChatScreen from "../screens/ASTC/Spartans/TeamChatScreen";
import Cam from "../screens/ASTC/Spartans/Cam";
import BenP from "../screens/ASTC/Spartans/Ben";
import Alex from "../screens/ASTC/Spartans/Alex";

// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function SpartansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ASTCHome" component={ASTCScreen} />
      <Stack.Screen name="SpartansScreen" component={SpartansScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="Cam" component={Cam} />
      <Stack.Screen name="BenP" component={BenP} />
      <Stack.Screen name="Alex" component={Alex} />

      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
