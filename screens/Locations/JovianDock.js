import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ✅ Update paths if your assets live elsewhere
import SOS from '../../assets/Locations/SOS.jpg';
import SOSInteriorImg from '../../assets/Locations/SOSinterior.jpg';
import OmegaBlackEmblem from '../../assets/BackGround/Court.jpg';

/**
 * =========================================================
 * 1) JovianDock Screen
 * =========================================================
 */
export const JovianDock = () => {
  const navigation = useNavigation();

  const handleDock = () => navigation.navigate('SOSInterior');
  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home');
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={SOS} style={styles.bg} resizeMode="cover">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.85}>
            <Text style={styles.backText}>⬅ Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promptWrap} pointerEvents="box-none">
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>Spartan Orbital Station</Text>
            <Text style={styles.promptSub}>Docking request detected.</Text>

            <TouchableOpacity style={styles.dockBtn} onPress={handleDock} activeOpacity={0.9}>
              <Text style={styles.dockBtnText}>Dock</Text>
            </TouchableOpacity>

            <Text style={styles.promptHint}>
              Proceeding will load interior access.
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

/**
 * =========================================================
 * 2) SOSInterior Screen
 * =========================================================
 */
export const SOSInterior = () => {
  const navigation = useNavigation();
  const [fileOpen, setFileOpen] = useState(false);

  const handleBack = () => {
    if (fileOpen) {
      setFileOpen(false);
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home');
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={SOSInteriorImg} style={styles.bg} resizeMode="cover">
        <View style={styles.topBarRow}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.85}>
            <Text style={styles.backText}>⬅ Back</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.aboutBtn} onPress={() => setFileOpen(true)} activeOpacity={0.9}>
            <Text style={styles.aboutText}>About this base</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerTag}>
          <Text style={styles.headerTagText}>SOS — Interior Access</Text>
        </View>

        {fileOpen && (
          <View style={styles.fileOverlay}>
            <View style={styles.fileCard}>
              <Image source={OmegaBlackEmblem} style={styles.fileEmblem} resizeMode="contain" />

              <Text style={styles.fileHeader}>OMEGA–BLACK ARCHIVE</Text>
              <Text style={styles.fileSub}>SPARTAN ORBITAL STATION (SOS) — JOVIAN ANVIL</Text>

              <ScrollView style={styles.fileScroll} contentContainerStyle={{ paddingBottom: 14 }}>
                <Text style={styles.fileBody}>
                  CLASSIFICATION: Omega–Black{'\n'}
                  CLEARANCE: Highest{'\n\n'}
                  OVERVIEW:{'\n'}
                  The Spartan Orbital Station (SOS), codename “Jovian Anvil,” is the Spartans’ primary
                  operational platform in Jovian space. Its role is to provide rapid response, repair,
                  resupply, and mission staging for deep-system operations — including patrol, interdiction,
                  and emergency extraction.{'\n\n'}
                  PURPOSE:{'\n'}
                  • Orbital command & mission staging over Jupiter{'\n'}
                  • Stealth-capable docking and rapid deployment{'\n'}
                  • Medical stabilization, refit, and armory access{'\n'}
                  • Classified research containment & threat assessment{'\n\n'}
                  SECURITY NOTE:{'\n'}
                  Unauthorized disclosure of SOS interior layouts, personnel rosters, or docking schedules
                  constitutes a strategic leak. If accessed without authorization, the system will record the
                  session and trigger counter-intelligence review.
                </Text>
              </ScrollView>

              <TouchableOpacity style={styles.fileCloseBtn} onPress={() => setFileOpen(false)} activeOpacity={0.9}>
                <Text style={styles.fileCloseText}>Close File</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

/**
 * =========================================================
 * Styles (shared)
 * =========================================================
 */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'black' },
  bg: { flex: 1 },

  topBar: {
    paddingTop: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  topBarRow: {
    paddingTop: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150, 230, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backText: { color: '#E6F7FF', fontWeight: '900', fontSize: 13 },

  promptWrap: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 26,
    paddingHorizontal: 14,
  },
  promptCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(150, 230, 255, 0.55)',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
  },
  promptTitle: {
    color: '#EFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  promptSub: {
    marginTop: 4,
    color: 'rgba(210, 240, 255, 0.9)',
    fontSize: 12,
    textAlign: 'center',
  },
  dockBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150, 230, 255, 0.9)',
    backgroundColor: 'rgba(10, 40, 70, 0.75)',
  },
  dockBtnText: {
    color: '#EFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  promptHint: {
    marginTop: 10,
    color: 'rgba(190, 225, 255, 0.85)',
    fontSize: 10,
    textAlign: 'center',
  },

  aboutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(180, 120, 255, 0.85)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  aboutText: { color: '#f2e6ff', fontWeight: '900', fontSize: 12 },

  headerTag: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150, 230, 255, 0.35)',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  headerTagText: {
    color: 'rgba(220, 245, 255, 0.92)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  fileOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  fileCard: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '80%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(170, 170, 170, 0.35)',
    backgroundColor: 'rgba(0,0,0,0.92)',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  fileEmblem: {
    width: 44,
    height: 44,
    alignSelf: 'center',
    marginBottom: 8,
    opacity: 0.95,
  },
  fileHeader: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  fileSub: {
    marginTop: 6,
    color: 'rgba(220,220,220,0.9)',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  fileScroll: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: 10,
  },
  fileBody: {
    color: 'rgba(235,235,235,0.92)',
    fontSize: 12,
    lineHeight: 18,
  },
  fileCloseBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.35)',
    backgroundColor: 'rgba(15,15,15,0.95)',
  },
  fileCloseText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
