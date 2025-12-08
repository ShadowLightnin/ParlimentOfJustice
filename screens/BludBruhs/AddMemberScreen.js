import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const AddMemberScreen = ({ route }) => {
  const navigation = useNavigation();
  const isYourUniverse = route.params?.isYourUniverse ?? true;
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Please grant permission to access the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const saveMember = () => {
    if (!name || !codename || !image) {
      Alert.alert('Error', 'Please provide a name, codename, and image.');
      return;
    }
    // Placeholder for saving logic (e.g., to AsyncStorage or a server)
    console.log('Saving member:', { name, codename, image });
    Alert.alert('Success', 'Member added successfully!');
    navigation.goBack();
  };

  const isDesktop = SCREEN_WIDTH > 600;

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Bludbruh2.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.header, isYourUniverse ? 
            { color: '#00FFFF', textShadowColor: '#fffb00', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 20 } : 
            { color: '#00FFFF', textShadowColor: '#fffb00', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 20 }]}>
            Add New Member
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <Text style={[styles.imagePickerText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>
                Select Image
              </Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { borderColor: isYourUniverse ? '#00b3ff' : '#800080' }]}
            placeholder="Enter Name"
            placeholderTextColor={isYourUniverse ? '#99ccff' : '#b266b2'}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { borderColor: isYourUniverse ? '#00b3ff' : '#800080' }]}
            placeholder="Enter Codename"
            placeholderTextColor={isYourUniverse ? '#99ccff' : '#b266b2'}
            value={codename}
            onChangeText={setCodename}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveMember}>
            <Text style={styles.saveButtonText}>Save Member</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.564)',
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagePickerButton: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: SCREEN_WIDTH * 0.8,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 10,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddMemberScreen;