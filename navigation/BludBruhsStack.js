import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BludBruhsScreen from '../screens/BludBruhs/BludBruhsScreen';
import AddMemberScreen from '../screens/BludBruhs/AddMemberScreen';
import TeamChatScreen from "../screens/BludBruhs/TeamChatScreen";
import UploadCharacter from '../components/UploadCharacter';
import UploadDesign from '../components/UploadDesign';


// import {  } from '../screens/BludBruhs/';
import Sam from '../screens/BludBruhs/Sam';
import SamsArmory from '../screens/BludBruhs/SamsArmory';

import WarpScreen from "../screens/BludBruhs/WarpScreen";
import MontroseManorScreen from "../screens/BludBruhs/MontroseManor/MontroseManorScreen"; // Your new tab screen
import BackWarpScreen from "../screens/BludBruhs/BackWarpScreen";
import Landing from "../screens/BludBruhs/MontroseManor/Landing";
import MontroseManorTab from "../screens/BludBruhs/MontroseManor/MontroseManorTab";
import BookDetails from '../screens/BludBruhs/MontroseManor/BookDetails';

import EvilMontroseManorScreen from "../screens/BludBruhs/MontroseManor/EvilMontroseManorScreen"; // Your new tab screen
import EvilBackWarpScreen from "../screens/BludBruhs/EvilBackWarpScreen";
import EvilSam from '../screens/Villains/VillainsMembers/EvilSam';
import VillainsTab from '../screens/Villains/VillainsTab';

import Cole from '../screens/BludBruhs/Cole';
import JosephD from '../screens/BludBruhs/JosephD';
import JamesBb from '../screens/BludBruhs/JamesBb';
import TannerBb from '../screens/BludBruhs/TannerBb';
import RangerSquad from '../screens/BludBruhs/Ranger_Squad17/RangerSquad';
import MonkeAllianceScreen from '../screens/BludBruhs/MonkeAlliance/MonkeAllianceScreen';
import RollingThunderScreen from '../screens/BludBruhs/RollingThunderScreen';
import LumielScreen from '../screens/BludBruhs/MonkeAlliance/LumielScreen';
import Zeke from '../screens/BludBruhs/MonkeAlliance/Zeke';
import Elijah from '../screens/BludBruhs/MonkeAlliance/Elijah';
import AmmonT from '../screens/BludBruhs/MonkeAlliance/AmmonT';
import TomBb from '../screens/BludBruhs/MonkeAlliance/TomBb';
import Eli from '../screens/BludBruhs/MonkeAlliance/Eli';
import EthanT from '../screens/BludBruhs/MonkeAlliance/EthanT';
import AlexM from '../screens/BludBruhs/MonkeAlliance/AlexM';
import Damon from '../screens/BludBruhs/MonkeAlliance/Damon';



const Stack = createNativeStackNavigator();

export function BludBruhsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BludBruhsHome" component={BludBruhsScreen} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="UploadCharacter" component={UploadCharacter} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      <Stack.Screen name="Sam" component={Sam} />
      <Stack.Screen name="SamsArmory" component={SamsArmory} />
      
      {/* Warp and Montrose Manor Screens */}

      <Stack.Screen name="WarpScreen" component={WarpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Montrose" component={MontroseManorScreen} />
      <Stack.Screen name="BackWarpScreen" component={BackWarpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="MontroseManorTab" component={MontroseManorTab} />
      <Stack.Screen name="BookDetails" component={BookDetails} />
      
      <Stack.Screen name="EvilMontrose" component={EvilMontroseManorScreen} />
      <Stack.Screen name="EvilBackWarpScreen" component={EvilBackWarpScreen} />
      <Stack.Screen name="EvilSam" component={EvilSam} />
      <Stack.Screen name="VillainsTab" component={VillainsTab} />

      <Stack.Screen name="Cole" component={Cole} />
      <Stack.Screen name="JosephD" component={JosephD} />
      <Stack.Screen name="JamesBb" component={JamesBb} />
      <Stack.Screen name="TannerBb" component={TannerBb} />
      <Stack.Screen name="RangerSquad" component={RangerSquad} />
      <Stack.Screen name="MonkeAllianceScreen" component={MonkeAllianceScreen} />
      <Stack.Screen name="RollingThunderScreen" component={RollingThunderScreen} />
      <Stack.Screen name="Zeke" component={Zeke} />
      <Stack.Screen name="Elijah" component={Elijah} />
      <Stack.Screen name="AmmonT" component={AmmonT} />
      <Stack.Screen name="TomBb" component={TomBb} />
      <Stack.Screen name="Eli" component={Eli} />
      <Stack.Screen name="EthanT" component={EthanT} />
      <Stack.Screen name="AlexM" component={AlexM} />
      <Stack.Screen name="Damon" component={Damon} />
      <Stack.Screen name="LumielScreen" component={LumielScreen} />
      </Stack.Navigator>
  );
}
