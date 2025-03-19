import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BludBruhsScreen from '../screens/BludBruhs/BludBruhsScreen';
import TeamChatScreen from "../screens/BludBruhs/TeamChatScreen";
import UploadCharacter from '../components/UploadCharacter';
import UploadDesign from '../components/UploadDesign';


// import {  } from '../screens/BludBruhs/';
import Sam from '../screens/BludBruhs/Sam';
import Cole from '../screens/BludBruhs/Cole';
import JosephD from '../screens/BludBruhs/JosephD';
import JamesBb from '../screens/BludBruhs/JamesBb';
import TannerBb from '../screens/BludBruhs/TannerBb';
import RangerSquad from '../screens/BludBruhs/Ranger_Squad17/RangerSquad';
import MonkeAllianceScreen from '../screens/BludBruhs/MonkeAlliance/MonkeAllianceScreen';
import LumielScreen from '../screens/BludBruhs/MonkeAlliance/LumielScreen';

const Stack = createNativeStackNavigator();

export function BludBruhsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BludBruhsHome" component={BludBruhsScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="UploadCharacter" component={UploadCharacter} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      <Stack.Screen name="Sam" component={Sam} />
      <Stack.Screen name="Cole" component={Cole} />
      <Stack.Screen name="JosephD" component={JosephD} />
      <Stack.Screen name="JamesBb" component={JamesBb} />
      <Stack.Screen name="TannerBb" component={TannerBb} />
      <Stack.Screen name="RangerSquad" component={RangerSquad} />
      <Stack.Screen name="MonkeAllianceScreen" component={MonkeAllianceScreen} />
      <Stack.Screen name="LumielScreen" component={LumielScreen} />
      </Stack.Navigator>
  );
}
