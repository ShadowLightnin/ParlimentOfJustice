import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BludBruhsScreen from '../screens/BludBruhs/BludBruhsScreen';
import TeamChatScreen from "../screens/BludBruhs/TeamChatScreen";
import UploadCharacter from '../components/UploadCharacter';
import UploadDesign from '../components/UploadDesign';


// import {  } from '../screens/BludBruhs/';
// import Sam from '../screens/BludBruhs/Sam';
// import Cole from '../screens/BludBruhs/Cole';
// import Joseph from '../screens/BludBruhs/Joseph';
// import James from '../screens/BludBruhs/James';
// import Tanner from '../screens/BludBruhs/Tanner';
// import RangerSquad from '../screens/BludBruhs/RangerSquad';
import MonkeAllianceScreen from '../screens/BludBruhs/MonkeAlliance/MonkeAllianceScreen';

const Stack = createNativeStackNavigator();

export function BludBruhsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BludBruhsHome" component={BludBruhsScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="UploadCharacter" component={UploadCharacter} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      {/* <Stack.Screen name="Sam" component={Sam} /> */}
      {/* <Stack.Screen name="Cole" component={Cole} /> */}
      {/* <Stack.Screen name="Joseph" component={Joseph} /> */}
      {/* <Stack.Screen name="James" component={James} /> */}
      {/* <Stack.Screen name="Tanner" component={Tanner} /> */}
      {/* <Stack.Screen name="RangerSquad" component={RangerSquad} /> */}
      <Stack.Screen name="MonkeAllianceScreen" component={MonkeAllianceScreen} />    
    </Stack.Navigator>
  );
}
