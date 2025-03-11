import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TitansScreen } from '../screens/Titans/TitansScreen';
import UploadCharacter from '../components/UploadCharacter';
import UploadDesign from '../components/UploadDesign';
import TeamChatScreen from "../screens/Titans/TeamChatScreen";

// import { Will } from '../screens/Titans/Will';

const Stack = createNativeStackNavigator();

export function TitansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TitansHome" component={TitansScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
      <Stack.Screen name="UploadCharacter" component={UploadCharacter} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      <Stack.Screen name="Will" component={FactionScreen} initialParams={{ title: "Will" }} />
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