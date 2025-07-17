import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// Heroes data with images & respective screens
const heroes = [
  { name: 'Ranger', screen: '', image: require('../../assets/Armor/LoneRanger.jpg'), clickable: true },
  { name: 'Lloyd', screen: '', image: require('../../assets/Armor/Lloyd.jpg'), clickable: true },
  { name: 'Kai', screen: '', image: require('../../assets/Armor/Kai.jpg'), clickable: true },
  { name: 'Cole', screen: '', image: require('../../assets/Armor/Cole.jpg'), clickable: true },
  { name: 'Jay', screen: '', image: require('../../assets/Armor/Jay.jpg'), clickable: true },
  { name: 'Nya', screen: '', image: require('../../assets/Armor/Nya.jpg'), clickable: true },
  { name: 'Zane', screen: '', image: require('../../assets/Armor/Zane.jpg'), clickable: true },
  { name: 'Pixal', screen: '', image: require('../../assets/Armor/Pixal.jpg'), clickable: true },
  { name: 'Superman', screen: '', image: require('../../assets/Armor/Superman7.jpg'), clickable: true },
  { name: 'Batman', screen: '', image: require('../../assets/Armor/Batman.jpg'), clickable: true },
  { name: 'Flash', screen: '', image: require('../../assets/Armor/Flash2.jpg'), clickable: true },
  { name: 'Green Lantern', screen: '', image: require('../../assets/Armor/GreenLantern.jpg'), clickable: true },
  { name: 'Green Ninja', screen: '', image: require('../../assets/Armor/GreenNinja.jpg'), clickable: true },
  { name: 'Red Ninja', screen: '', image: require('../../assets/Armor/RedNinja.jpg'), clickable: true },
  { name: 'Blue Ninja', screen: '', image: require('../../assets/Armor/BlueNinja.jpg'), clickable: true },
  { name: 'Water Ninja', screen: '', image: require('../../assets/Armor/WaterNinja.jpg'), clickable: true },
  { name: 'Black Ninja', screen: '', image: require('../../assets/Armor/BlackNinja.jpg'), clickable: true },
  { name: 'White Ninja', screen: '', image: require('../../assets/Armor/WhiteNinja.jpg'), clickable: true },
  { name: 'Green Lantern 2', screen: '', image: require('../../assets/Armor/GreenLantern2.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Batman2.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Superman5.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Flash.jpg'), clickable: true },
  { name: 'Ironman', screen: '', image: require('../../assets/Armor/Ironman.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Superman6.jpg'), clickable: true },
  { name: 'Rogue', screen: '', image: require('../../assets/Armor/Rogue.jpg'), clickable: true },
  { name: 'Ronan', screen: '', image: require('../../assets/Armor/Ronan.jpg'), clickable: true },
  { name: 'Apocolie', screen: '', image: require('../../assets/Armor/Apocolie.jpg'), clickable: true },
  { name: 'Socialation', screen: '', image: require('../../assets/Armor/Jaden.jpg'), clickable: true },
  { name: 'Spiltz', screen: '', image: require('../../assets/Armor/Jonas.jpg'), clickable: true },
  { name: '', codename: 'Voice Fry', screen: '', clickable: true, image: require('../../assets/Armor/Johnathon_cleanup.jpg') },
  
  { name: 'First Elemental Master', screen: '', image: require('../../assets/Armor/ElementalArmor/FirstElementalMaster.jpg'), clickable: true },
  { name: 'Master Of Creation', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfCreation.jpg'), clickable: true },
  { name: 'Creation Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/CreationElemental3.jpg'), clickable: true },
  { name: 'Creation Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/CreationElemental.jpg'), clickable: true },
  { name: 'Creation Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/CreationElemental2.jpg'), clickable: true },
  { name: 'GoldenPower Elemental Master', screen: '', image: require('../../assets/Armor/ElementalArmor/GoldenPowerElementalMaster.jpg'), clickable: true },
  { name: 'GoldenPower Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/GoldenPowerElemental.jpg'), clickable: true },
  
  { name: 'Master Of Destruction', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfDestruction.jpg'), clickable: true },
  { name: 'Destruction Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/DestructionElemental3.jpg'), clickable: true },
  { name: 'Destruction Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/DestructionElemental.jpg'), clickable: true },
  { name: 'Destruction Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/DestructionElemental2.jpg'), clickable: true },
  
  { name: 'DragonPower Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/DragonPowerElemental.jpg'), clickable: true },
  { name: 'DragonPower Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/DragonPowerElemental2.jpg'), clickable: true },
  { name: 'OniPower Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/OniPowerElemental.jpg'), clickable: true },
  { name: 'OniPower Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/OniPowerElemental2.jpg'), clickable: true },
  
  { name: 'Master Of Fire', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfFire.jpg'), clickable: true },
  { name: 'Fire Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/FireElemental.jpg'), clickable: true },

  { name: 'Master Of Lightning', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfLightning.jpg'), clickable: true },
  { name: 'Lightning Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/LightningELemental.jpg'), clickable: true },

  { name: 'Master Of Ice', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfIce.jpg'), clickable: true },
  { name: 'Ice Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/IceElemental.jpg'), clickable: true },
  { name: 'Ice Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/IceElemental2.jpg'), clickable: true },
  { name: 'Ice Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/IceElemental3.jpg'), clickable: true },

  { name: 'Master Of Earth', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfEarth.jpg'), clickable: true },
  { name: 'Earth Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/EarthElemental.jpg'), clickable: true },

  { name: 'Master Of Water', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfWater.jpg'), clickable: true },
  { name: 'Water Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/WaterElemental.jpg'), clickable: true },

  { name: 'Master Of Energy', screen: '', image: require('../../assets/Armor/ElementalArmor/EnergyElemental4.jpg'), clickable: true },
  { name: 'Energy Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfEnergy.jpg'), clickable: true },
  { name: 'Energy Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/EnergyElemental.jpg'), clickable: true },
  { name: 'Energy Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/EnergyElemental2.jpg'), clickable: true },
  { name: 'Energy Elemental 4', screen: '', image: require('../../assets/Armor/ElementalArmor/EnergyElemental3.jpg'), clickable: true },

  { name: 'Master Of Wind', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfWind.jpg'), clickable: true },
  { name: 'Wind Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/WindElemental.jpg'), clickable: true },

  { name: 'Master Of Shadow', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfShadow.jpg'), clickable: true },
  { name: 'Shadow Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/ShadowElemental.jpg'), clickable: true },

  { name: 'Master Of Light', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfLight.jpg'), clickable: true },
  { name: 'Light Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/LightElemental.jpg'), clickable: true },
  { name: 'Light Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/LightElemental2.jpg'), clickable: true },
  { name: 'Light Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/LightElemental3.jpg'), clickable: true },

  { name: 'Master Of Metal', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfMetal.jpg'), clickable: true },
  { name: 'Metal Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/MetalElemental.jpg'), clickable: true },

  { name: 'Master Of Poison', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfPoison.jpg'), clickable: true },
  { name: 'Poison Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/PoisonElemental.jpg'), clickable: true },

  { name: 'Master Of Nature', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfNature.jpg'), clickable: true },
  { name: 'Nature Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/NatureElemental.jpg'), clickable: true },

  { name: 'Master Of Mind', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfMind.jpg'), clickable: true },
  { name: 'Mind Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/MindElemental.jpg'), clickable: true },

  { name: 'Master Of Speed', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfSpeed.jpg'), clickable: true },
  { name: 'Speed Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/SpeedElemental.jpg'), clickable: true },

  { name: 'Master Of Gravity', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfGravity.jpg'), clickable: true },
  { name: 'Gravity Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/GravityElemental.jpg'), clickable: true },

  { name: 'Master Of Amber', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfAmber.jpg'), clickable: true },
  { name: 'Amber Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/AmberElemental.jpg'), clickable: true },

  { name: 'Master Of Smoke', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfSmoke.jpg'), clickable: true },
  { name: 'Smoke Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/SmokeElemental.jpg'), clickable: true },

  { name: 'Master Of Sound', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfSound.jpg'), clickable: true },
  { name: 'Sound Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/SoundElemental.jpg'), clickable: true },

  { name: 'Master Of Form', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfForm.jpg'), clickable: true },
  { name: 'Form Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/FormElemental.jpg'), clickable: true },

  { name: 'Master Of Time', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfTime.jpg'), clickable: true },
  { name: 'Time Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/TimeElemental.jpg'), clickable: true },
  { name: 'Time Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/TimeElemental2.jpg'), clickable: true },
  { name: 'Time Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/TimeElemental3.jpg'), clickable: true },

  { name: 'Master Of Darkness', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfDarkness.jpg'), clickable: true },
  { name: 'Darkness Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/DarknessElemental.jpg'), clickable: true },

  { name: 'Master Of Heat', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfHeat.jpg'), clickable: true },
  { name: 'Heat Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/HeatElemental.jpg'), clickable: true },
  { name: 'Heat Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/HeatElemental2.jpg'), clickable: true },
  { name: 'Heat Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/HeatElemental3.jpg'), clickable: true },
  
  { name: 'Master Of Quake', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfQuake.jpg'), clickable: true },
  { name: 'Quake Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/QuakeElemental.jpg'), clickable: true },
  { name: 'Quake Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/QuakeElemental2.jpg'), clickable: true },

  { name: 'Master Of Fusion', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfFusion.jpg'), clickable: true },
  { name: 'Fusion Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/FusionElemental.jpg'), clickable: true },

  { name: 'Master Of Technology', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfTechnology.jpg'), clickable: true },
  { name: 'Technology Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/TechnologyElemental.jpg'), clickable: true },

  { name: 'Lava Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/LavaElemental.jpg'), clickable: true },
  { name: 'Lava Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/LavaElemental2.jpg'), clickable: true },
  { name: 'Lava Elemental 4', screen: '', image: require('../../assets/Armor/ElementalArmor/LavaElemental4.jpg'), clickable: true },
  
  { name: 'Life Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/LifeElemental.jpg'), clickable: true },
  { name: 'Life Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/LifeElemental2.jpg'), clickable: true },

  { name: 'Master Of Chaos', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfChaos.jpg'), clickable: true },
  { name: 'Chaos Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/ChaosElemental.jpg'), clickable: true },

  { name: 'Master Of Focus', screen: '', image: require('../../assets/Armor/ElementalArmor/MasterOfFocus.jpg'), clickable: true },
  { name: 'Focus Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/FocusElemental.jpg'), clickable: true },

  { name: 'Fertility Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/FertilityElemental.jpg'), clickable: true },
  { name: 'Fertility Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/FertilityElemental2.jpg'), clickable: true },
  
  { name: 'First Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/FirstElemental.jpg'), clickable: true },
  { name: 'First Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/FirstElemental2.jpg'), clickable: true },
  
  { name: 'Love Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/LoveElemental.jpg'), clickable: true },
  { name: 'Love Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/LoveElemental2.jpg'), clickable: true },

  { name: 'BlackHole Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental.jpg'), clickable: true },
  { name: 'BlackHole Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental2.jpg'), clickable: true },
  { name: 'BlackHole Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental3.jpg'), clickable: true },
  { name: 'BlackHole Elemental 4', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental4.jpg'), clickable: true },
  { name: 'BlackHole Elemental 5', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental5.jpg'), clickable: true },
  { name: 'BlackHole Elemental 6', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental6.jpg'), clickable: true },
  { name: 'BlackHole Elemental 7', screen: '', image: require('../../assets/Armor/ElementalArmor/BlackHoleElemental7.jpg'), clickable: true },
  
  { name: 'Brown Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/BrownElemental.jpg'), clickable: true },
  { name: 'Brown Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/BrownElemental2.jpg'), clickable: true },
  
  { name: 'Cosmos Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/CosmosElemental.jpg'), clickable: true },
  { name: 'Cosmos Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/CosmosElemental2.jpg'), clickable: true },
  
  { name: 'DarkEnergey Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/DarkEnergeyElemental.jpg'), clickable: true },
  { name: 'DarkEnergey Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/DarkEnergeyElemental2.jpg'), clickable: true },
  
  { name: 'DarkMatter Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/DarkMatterELemental.jpg'), clickable: true },
  { name: 'DarkMatter Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/DarkMatterElemental2.jpg'), clickable: true },
  
  { name: 'Death Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/DeathElemental.jpg'), clickable: true },
  { name: 'Death Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/DeathElemental2.jpg'), clickable: true },
    
  { name: 'Galaxy Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/GalaxyElemental.jpg'), clickable: true },
  { name: 'Galaxy Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/GalaxyElemental2.jpg'), clickable: true },
  
  { name: 'IMG 0474 Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/IMG_0474.jpg'), clickable: true },
  { name: 'IMG 0475 Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/IMG_0475.jpg'), clickable: true },
  
  { name: 'Maw Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/MawElemental.jpg'), clickable: true },
  { name: 'Maw Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/MawElemental2.jpg'), clickable: true },
  { name: 'Maw Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/MawElemental3.jpg'), clickable: true },
  { name: 'Maw Elemental 4', screen: '', image: require('../../assets/Armor/ElementalArmor/MawElemental4.jpg'), clickable: true },
  
  { name: 'Plasma Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/PlasmaElemental.jpg'), clickable: true },
  { name: 'Plasma Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/PlasmaElemental2.jpg'), clickable: true },
  { name: 'Plasma Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/PlasmaElemental3.jpg'), clickable: true },
  
  { name: 'Portal Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/PortalElemental.jpg'), clickable: true },
  { name: 'Portal Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/PortalElemental2.jpg'), clickable: true },
  
  { name: 'Quantum Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/QuantumElemental.jpg'), clickable: true },
  { name: 'Quantum Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/QuantumElemental2.jpg'), clickable: true },
  
  { name: 'Quasar Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/QuasarElemetal.jpg'), clickable: true },
  { name: 'Quasar Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/QuasarElemetal2.jpg'), clickable: true },
  
  { name: 'Reality Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/RealityElemental.jpg'), clickable: true },
  { name: 'Reality Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/RealityElemental2.jpg'), clickable: true },
  { name: 'Stories Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/StoriesElemental.jpg'), clickable: true },
  { name: 'Stories Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/StoriesElemental2.jpg'), clickable: true },
  
  { name: 'Rift Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/RiftElemental.jpg'), clickable: true },
  { name: 'Rift Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/RiftElemental2.jpg'), clickable: true },
  
  { name: 'Soul Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/SoulElemental.jpg'), clickable: true },
  { name: 'Soul Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/SoulElemental2.jpg'), clickable: true },
  
  { name: 'Spinjitzu Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/SpinjitzuElemental.jpg'), clickable: true },
  { name: 'Spinjitzu Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/SpinjitzuElemental2.jpg'), clickable: true },
  
  { name: 'Star Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/StarElemental.jpg'), clickable: true },
  { name: 'Star Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/StarElemental2.jpg'), clickable: true },
  
  { name: 'Storm Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/StormElemental.jpg'), clickable: true },
  { name: 'Storm Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/StormElemental2.jpg'), clickable: true },
  
  { name: 'Telekinisis Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/TelekinisisElemental.jpg'), clickable: true },
  { name: 'Telekinisis Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/TelekinisisElemental2.jpg'), clickable: true },
  
  { name: 'Thunder Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/ThunderElemental.jpg'), clickable: true },
  { name: 'Thunder Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/ThunderElemental2.jpg'), clickable: true },
  
  { name: 'Void Elemental', screen: '', image: require('../../assets/Armor/ElementalArmor/VoidElemental.jpg'), clickable: true },
  { name: 'Void Elemental 2', screen: '', image: require('../../assets/Armor/ElementalArmor/VoidElemental2.jpg'), clickable: true },
  { name: 'Void Elemental 3', screen: '', image: require('../../assets/Armor/ElementalArmor/VoidElemental3.jpg'), clickable: true },
  { name: 'Void Elemental 4', screen: '', image: require('../../assets/Armor/ElementalArmor/VoidElemental4.jpg'), clickable: true },
];

// Background music (shared across screens)
let backgroundSound = null;

const playBackgroundMusic = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/Superman.mp4'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      backgroundSound = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/Superman.mp4');
    }
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
    } catch (error) {
      console.error('Error stopping/unloading sound:', error);
    }
  }
};

const JusticeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [previewHero, setPreviewHero] = useState(null);

  // Handle audio on initial focus
  useEffect(() => {
    if (isFocused && !backgroundSound) {
      playBackgroundMusic();
    }

    // Cleanup on unmount
    return () => {
      if (navigation.getState().routes[navigation.getState().index].name === 'Home') {
        stopBackgroundMusic();
      }
    };
  }, [isFocused, navigation]);

  const handleHeroPress = async (hero) => {
    if (hero.clickable) {
      if (!hero.screen) {
        if (backgroundSound) {
          try {
            await backgroundSound.pauseAsync();
          } catch (error) {
            console.error('Error pausing sound on hero press:', error);
          }
        }
        console.log('Showing preview for hero:', hero.name || hero.codename || 'Unknown');
        setPreviewHero(hero); // Show modal if no screen
      } else {
        console.log('Navigating to screen:', hero.screen);
        navigation.navigate(hero.screen); // Navigate if screen exists
      }
    }
  };

  // Render Each Hero Card
  const renderHeroCard = (hero) => (
    <TouchableOpacity
      key={hero.name || hero.codename || hero.image.toString()} // Use name, codename, or image as key
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        hero.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => handleHeroPress(hero)}
      disabled={!hero.clickable}
    >
      {hero?.image && (
        <>
          <Image source={hero.image} style={styles.image} resizeMode="cover" />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.name}>{hero.name || hero.codename || 'Unknown'}</Text>
      {!hero.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  // Render Preview Card
  const renderPreviewCard = (hero) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={async () => {
        console.log('Closing preview modal');
        await playBackgroundMusic(); // Resume audio
        setPreviewHero(null);
      }}
    >
      <Image
        source={hero.image || require('../../assets/Armor/LoneRanger.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {hero.name || hero.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Justice.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Title above Back Button and Vigilante Button */}
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to Heroes screen');
            navigation.navigate('Heroes');
          }}
        >
          <Text style={[styles.header, { marginTop: 20, marginBottom: 60 }]}>Guardians of Justice</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          onPress={async () => {
            console.log('Navigating to Home');
            await stopBackgroundMusic();
            navigation.navigate('Home');
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        {/* Vigilante Button */}
        <TouchableOpacity
          onPress={async () => {
            console.log('Navigating to VigilanteScreen');
            await stopBackgroundMusic();
            navigation.navigate('VigilanteScreen');
          }}
          style={styles.vigilanteButton}
        >
          <Image
            source={require('../../assets/BackGround/Vigilantes.jpg')}
            style={styles.vigilanteImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Horizontal Scrollable Heroes Grid */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {heroes.map(renderHeroCard)}
          </ScrollView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={!!previewHero}
          transparent={true}
          animationType="fade"
          onRequestClose={async () => {
            console.log('Closing preview modal');
            await playBackgroundMusic(); // Resume audio
            setPreviewHero(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={async () => {
                console.log('Closing preview modal');
                await playBackgroundMusic(); // Resume audio
                setPreviewHero(null);
              }}
            >
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageScrollContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={SCREEN_WIDTH * 0.7 + 20}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewHero && renderPreviewCard(previewHero)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewName}>{previewHero?.name || previewHero?.codename || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.6)',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },
  vigilanteButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    padding: 5,
    borderRadius: 5,
  },
  vigilanteImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 1,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: horizontalSpacing,
  },
  clickable: {
    borderColor: 'yellow',
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: 'yellow',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingLeft: 20,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    width: '100%',
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default JusticeScreen;