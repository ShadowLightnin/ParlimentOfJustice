import React, { useEffect, useContext, useState } from 'react';
import { 
  NavigationContainer 
} from '@react-navigation/native';
import { 
  createNativeStackNavigator 
} from '@react-navigation/native-stack';
import { 
  AppState, Alert, BackHandler, Platform, View, Text, StyleSheet
} from 'react-native';
import * as ScreenCapture from 'expo-screen-capture'; 
import { BlurView } from 'expo-blur';  // ✅ For Blurring
import { auth } from "./api/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, { AuthContext } from './context/auth-context';

import { StartScreen } from './screens/StartScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TitansStack } from './navigation/TitansStack';
import { EclipseStack } from './navigation/EclipseStack';
import { OlympiansStack } from './navigation/OlympiansStack';
import { CobrosStack } from './navigation/CobrosStack';
import { SpartansStack } from './navigation/SpartansStack';
import { BludBruhsStack } from './navigation/BludBruhsStack';
import { LegionairesStack } from './navigation/LegionairesStack';
import { ConstollationStack } from './navigation/ConstollationStack';
import { DesignsStack } from './navigation/DesignsStack';
import { AdminStack } from "./navigation/AdminStack";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import PublicChatScreen from "./screens/PublicChatScreen";
import VillainsStack from './navigation/VillainsStack';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="VillainsScreen" component={VillainsStack} />
      <Stack.Screen name="PublicChat" component={PublicChatScreen} />
      <Stack.Screen name="Admin" component={AdminStack} />
      <Stack.Screen name="Titans" component={TitansStack} />
      <Stack.Screen name="Eclipse" component={EclipseStack} />
      <Stack.Screen name="Olympians" component={OlympiansStack} />
      <Stack.Screen name="Cobros" component={CobrosStack} />
      <Stack.Screen name="ASTC" component={SpartansStack} />
      <Stack.Screen name="BludBruhs" component={BludBruhsStack} />
      <Stack.Screen name="Legionaires" component={LegionairesStack} />
      <Stack.Screen name="Constollation" component={ConstollationStack} />
      <Stack.Screen name="Designs" component={DesignsStack} /> 
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  return <Navigation />;
}

export default function App() {
  const [isAppInactive, setIsAppInactive] = useState(false);

  // 🔒 Disable Screenshots (Android Only)
  useEffect(() => {
    if (Platform.OS === 'android') {
      const preventScreenshot = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
      };
      preventScreenshot();

      return () => {
        ScreenCapture.allowScreenCaptureAsync();
      };
    }
  }, []);

  // 🔒 Prevent Image Saving via Long Press
  useEffect(() => {
    const preventLongPress = () => {
      Alert.alert('⚠️ Content Protection', 'Image saving is disabled.');
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', preventLongPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', preventLongPress);
    };
  }, []);

  // 🔒 Disable Right-Click (Web/Desktop)
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }, []);

  // 🔒 Blur Screen on Background (Extra Protection)
  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      setIsAppInactive(nextAppState !== "active"); // Blur when not active
    });

    return () => appStateListener.remove();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <View style={{ flex: 1, position: 'relative' }}>
          <Root />
          {isAppInactive && (
            <BlurView
              intensity={100} // Full blur
              tint="dark"
              style={{
                ...StyleSheet.absoluteFillObject,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 24 }}>🔒 Screen Secured</Text>
            </BlurView>
          )}
        </View>
      </AuthContextProvider>
    </>
  );
}

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
