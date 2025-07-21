import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TitansScreen from '../screens/Titans/TitansScreen';
import PowerTitans from '../screens/Titans/PowerTitans';
import UploadCharacter from '../components/UploadCharacter';
import UploadDesign from '../components/UploadDesign';
import TeamChatScreen from "../screens/Titans/TeamChatScreen";
import Spencer from '../screens/Titans/Spencer';
import Azure from '../screens/Titans/Azure';
import Jared from '../screens/Titans/Jared';
import Will from '../screens/Titans/Will';
import Aileen from '../screens/Eclipse/Aileen';
import Ben from '../screens/Titans/Ben';
import Jennifer from '../screens/Titans/Jennifer';
import Emma from '../screens/Titans/Emma';

const Stack = createNativeStackNavigator();

export function TitansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TitansHome" component={TitansScreen} />
      <Stack.Screen name="PowerTitans" component={PowerTitans} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="UploadCharacter" component={UploadCharacter} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      <Stack.Screen name="Spencer" component={Spencer} />
      <Stack.Screen name="Azure" component={Azure} />
      <Stack.Screen name="Jared" component={Jared} />
      <Stack.Screen name="Will" component={Will} />
      <Stack.Screen name="Aileen" component={Aileen} />
      <Stack.Screen name="Ben" component={Ben} />
      <Stack.Screen name="Jennifer" component={Jennifer} />
      <Stack.Screen name="Emma" component={Emma} />
    </Stack.Navigator>
  );
}

// Generic Faction Screen (for other factions)
const FactionScreen = ({ route }) => {
  const { title } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
// initialParams={{ title: "Designs" }} for the FactionScreen ie:
// <Stack.Screen name="Designs" component={FactionScreen} initialParams={{ title: "Designs" }} />

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
};