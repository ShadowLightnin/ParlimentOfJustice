import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StartScreen } from './screens/StartScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TitansStack } from './navigation/TitansStack';
import { EclipseStack } from './navigation/EclipseStack';
// import { OlympiansStack } from './navigation/OlympiansStack';
// import { CobrosStack } from './navigation/CobrosStack';
// import { SpartansStack } from './navigation/SpartansStack';
// import { BludBruhsStack } from './navigation/BludBruhsStack';
// import { LegionairesStack } from './navigation/LegionairesStack';
// import { ConstollationStack } from './navigation/ConstollationStack';
// import { DesignsStack } from './navigation/DesignsStack';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Titans" component={TitansStack} />
        <Stack.Screen name="Eclipse" component={EclipseStack} />
        <Stack.Screen name="Olympians" component={FactionScreen} initialParams={{ title: "Olympians" }} />
        <Stack.Screen name="Cobros" component={FactionScreen} initialParams={{ title: "Cobros" }} />
        <Stack.Screen name="ASTC" component={FactionScreen} initialParams={{ title: "ASTC" }} />
        <Stack.Screen name="BludBruhs" component={FactionScreen} initialParams={{ title: "BludBruhs" }} />
        <Stack.Screen name="Legionaires" component={FactionScreen} initialParams={{ title: "Legionaires" }} />
        <Stack.Screen name="Constollation" component={FactionScreen} initialParams={{ title: "Constollation" }} />
        <Stack.Screen name="Designs" component={FactionScreen} initialParams={{ title: "Designs" }} />
      </Stack.Navigator>
    </NavigationContainer>
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
