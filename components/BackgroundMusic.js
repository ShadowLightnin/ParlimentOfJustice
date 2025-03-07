import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const BackgroundMusic = () => {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function playMusic() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/Halo.mp3'), // 🔥 Your Music File
        { shouldPlay: true, isLooping: true }
      );

      if (isMounted) setSound(sound);
      await sound.playAsync();
    }

    playMusic();

    return () => {
      isMounted = false;
      if (sound) sound.unloadAsync();
    };
  }, []);

  return null;
};

export default BackgroundMusic;
