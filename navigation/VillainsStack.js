import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Villains Screens
import VillainsScreen from '../screens/Villains/VillainsScreen';
import VillainsTab from '../screens/Villains/VillainsTab';

// Big Bads Screens
import BigBadsTab from '../screens/Villains/BigBadsTab';

// Demons Section
import DemonsSection from '../screens/Villains/DemonsSection';
import NateScreen from '../screens/Villains/DemonMembers/NateScreen';
import ObeliskScreen from '../screens/Villains/DemonMembers/ObeliskScreen';

// import Screen from '../screens/Villains/DemonMembers/Screen';

// Villain Imports
import FjordScreen from '../screens/Villains/VillainsMembers/FjordScreen';
import JudgeHexScreen from '../screens/Villains/VillainsMembers/JudgeHexScreen';
import WraithbladeScreen from '../screens/Villains/VillainsMembers/WraithbladeScreen';
import HarbingerScreen from '../screens/Villains/VillainsMembers/HarbingerScreen';
import VenomFangScreen from '../screens/Villains/VillainsMembers/VenomFangScreen';
import ShatterbloomScreen from '../screens/Villains/VillainsMembers/ShatterbloomScreen';
import HarbingerDoveScreen from '../screens/Villains/VillainsMembers/HarbingerDoveScreen';
import ByteRuinScreen from '../screens/Villains/VillainsMembers/ByteRuinScreen';
import ShadeWeaverScreen from '../screens/Villains/VillainsMembers/ShadeWeaverScreen';
import RageVortexScreen from '../screens/Villains/VillainsMembers/RageVortexScreen';
import MallikhanScreen from '../screens/Villains/VillainsMembers/MallikhanScreen';
import ElderPyrrhusScreen from '../screens/Villains/VillainsMembers/ElderPyrrhusScreen';
import DarkEnvoyScreen from '../screens/Villains/VillainsMembers/DarkEnvoyScreen';
import SpectralWraithScreen from '../screens/Villains/VillainsMembers/SpectralWraithScreen';
import HarrierScreen from '../screens/Villains/VillainsMembers/HarrierScreen';
import ShadeWidowScreen from '../screens/Villains/VillainsMembers/ShadeWidowScreen';
import GildedShardScreen from '../screens/Villains/VillainsMembers/GildedShardScreen';
import ChromePhoenixScreen from '../screens/Villains/VillainsMembers/ChromePhoenixScreen';
import HadesRavageScreen from '../screens/Villains/VillainsMembers/HadesRavageScreen';
import SpectralWarlordScreen from '../screens/Villains/VillainsMembers/SpectralWarlordScreen';
import VirusVortexScreen from '../screens/Villains/VillainsMembers/VirusVortexScreen';
import ShadeStalkerScreen from '../screens/Villains/VillainsMembers/ShadeStalkerScreen';
import VoltShadeScreen from '../screens/Villains/VillainsMembers/VoltShadeScreen';
import SableScreen from '../screens/Villains/VillainsMembers/SableScreen';
import EvilSam from '../screens/Villains/VillainsMembers/EvilSam';
import WarpScreen from "../screens/BludBruhs/WarpScreen";
import MontroseManorScreen from "../screens/BludBruhs/MontroseManor/MontroseManorScreen"; // Your new tab screen
// import BackWarpScreen from "../screens/BludBruhs/BackWarpScreen";
import Landing from "../screens/BludBruhs/MontroseManor/Landing";
import MontroseManorTab from "../screens/BludBruhs/MontroseManor/MontroseManorTab";
import BookDetails from '../screens/BludBruhs/MontroseManor/BookDetails';

import EvilMontroseManorScreen from "../screens/BludBruhs/MontroseManor/EvilMontroseManorScreen"; // Your new tab screen
import EvilBackWarpScreen from "../screens/BludBruhs/EvilBackWarpScreen";


import SteelJuggernautScreen from '../screens/Villains/VillainsMembers/SteelJuggernautScreen';
import WarhoundScreen from '../screens/Villains/VillainsMembers/WarhoundScreen';
import OvermindScreen from '../screens/Villains/VillainsMembers/OvermindScreen';
import ObsidianShroudScreen from '../screens/Villains/VillainsMembers/ObsidianShroudScreen';
import FangstrikeScreen from '../screens/Villains/VillainsMembers/FangstrikeScreen';
import VoidPhantomScreen from '../screens/Villains/VillainsMembers/VoidPhantomScreen';
import ChronaScreen from '../screens/Villains/VillainsMembers/ChronaScreen';
import NocturaScreen from '../screens/Villains/VillainsMembers/NocturaScreen';
import RedMercuryScreen from '../screens/Villains/VillainsMembers/RedMercuryScreen';
import TitanusScreen from '../screens/Villains/VillainsMembers/TitanusScreen';

// import Screen from '../screens/Villains/VillainsMembers/Screen';

// Big Bads Imports
import ObsidianScreen from '../screens/Villains/BigBadMembers/ObsidianScreen';
import UmbraNexScreen from '../screens/Villains/BigBadMembers/UmbraNexScreen';
import KaidanVyrosScreen from '../screens/Villains/BigBadMembers/KaidanVyrosScreen';
import StormshadeScreen from '../screens/Villains/BigBadMembers/StormshadeScreen';
import VoidConquerorScreen from '../screens/Villains/BigBadMembers/VoidConquerorScreen';
import ErevosScreen from '../screens/Villains/BigBadMembers/ErevosScreen';
import AlmarraScreen from '../screens/Villains/BigBadMembers/AlmarraScreen';
import VortigarScreen from '../screens/Villains/BigBadMembers/VortigarScreen';

// import Screen from '../screens/Villains/BigBadMembers/Screen';

const Stack = createNativeStackNavigator();

const VillainsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Base Screens */}
      <Stack.Screen name="Villains" component={VillainsScreen} />
      <Stack.Screen name="VillainsTab" component={VillainsTab} />
      <Stack.Screen name="BigBadsTab" component={BigBadsTab} />
      <Stack.Screen name="DemonsSection" component={DemonsSection} />
      <Stack.Screen name="NateScreen" component={NateScreen} />
      <Stack.Screen name="ObeliskScreen" component={ObeliskScreen} />

      {/* Villain Screens */}
      <Stack.Screen name="FjordScreen" component={FjordScreen} />
      <Stack.Screen name="JudgeHexScreen" component={JudgeHexScreen} />
      <Stack.Screen name="WraithbladeScreen" component={WraithbladeScreen} />
      <Stack.Screen name="HarbingerScreen" component={HarbingerScreen} />
      <Stack.Screen name="VenomFangScreen" component={VenomFangScreen} />
      <Stack.Screen name="ShatterbloomScreen" component={ShatterbloomScreen} />
      <Stack.Screen name="HarbingerDoveScreen" component={HarbingerDoveScreen} />
      <Stack.Screen name="ByteRuinScreen" component={ByteRuinScreen} />
      <Stack.Screen name="ShadeWeaverScreen" component={ShadeWeaverScreen} />
      <Stack.Screen name="RageVortexScreen" component={RageVortexScreen} />
      <Stack.Screen name="MallikhanScreen" component={MallikhanScreen} />
      <Stack.Screen name="ElderPyrrhusScreen" component={ElderPyrrhusScreen} />
      <Stack.Screen name="DarkEnvoyScreen" component={DarkEnvoyScreen} />
      <Stack.Screen name="SpectralWraithScreen" component={SpectralWraithScreen} />
      <Stack.Screen name="HarrierScreen" component={HarrierScreen} />
      <Stack.Screen name="ShadeWidowScreen" component={ShadeWidowScreen} />
      <Stack.Screen name="GildedShardScreen" component={GildedShardScreen} />
      <Stack.Screen name="ChromePhoenixScreen" component={ChromePhoenixScreen} />
      <Stack.Screen name="HadesRavageScreen" component={HadesRavageScreen} />
      <Stack.Screen name="SpectralWarlordScreen" component={SpectralWarlordScreen} />
      <Stack.Screen name="VirusVortexScreen" component={VirusVortexScreen} />
      <Stack.Screen name="ShadeStalkerScreen" component={ShadeStalkerScreen} />
      <Stack.Screen name="VoltShadeScreen" component={VoltShadeScreen} />
      <Stack.Screen name="SableScreen" component={SableScreen} />
      <Stack.Screen name="EvilSam" component={EvilSam} />
      <Stack.Screen name="WarpScreen" component={WarpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Montrose" component={MontroseManorScreen} />
      {/* <Stack.Screen name="BackWarpScreen" component={BackWarpScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="MontroseManorTab" component={MontroseManorTab} />
      <Stack.Screen name="BookDetails" component={BookDetails} />
      
      <Stack.Screen name="EvilMontrose" component={EvilMontroseManorScreen} />
      <Stack.Screen name="EvilBackWarpScreen" component={EvilBackWarpScreen} />


      <Stack.Screen name="SteelJuggernautScreen" component={SteelJuggernautScreen} />
      <Stack.Screen name="WarhoundScreen" component={WarhoundScreen} />
      <Stack.Screen name="OvermindScreen" component={OvermindScreen} />
      <Stack.Screen name="ObsidianShroudScreen" component={ObsidianShroudScreen} />
      <Stack.Screen name="FangstrikeScreen" component={FangstrikeScreen} />
      <Stack.Screen name="VoidPhantomScreen" component={VoidPhantomScreen} />
      <Stack.Screen name="ChronaScreen" component={ChronaScreen} />
      <Stack.Screen name="NocturaScreen" component={NocturaScreen} />
      <Stack.Screen name="RedMercuryScreen" component={RedMercuryScreen} />
      <Stack.Screen name="TitanusScreen" component={TitanusScreen} />



      {/* Big Bads Screens */}
      <Stack.Screen name="ObsidianScreen" component={ObsidianScreen} />
      <Stack.Screen name="UmbraNexScreen" component={UmbraNexScreen} />
      <Stack.Screen name="KaidanVyrosScreen" component={KaidanVyrosScreen} />
      <Stack.Screen name="StormshadeScreen" component={StormshadeScreen} />
      <Stack.Screen name="VoidConquerorScreen" component={VoidConquerorScreen} />
      <Stack.Screen name="ErevosScreen" component={ErevosScreen} />
      <Stack.Screen name="AlmarraScreen" component={AlmarraScreen} />
      <Stack.Screen name="VortigarScreen" component={VortigarScreen} />
    </Stack.Navigator>
  );
};

export default VillainsStack;
