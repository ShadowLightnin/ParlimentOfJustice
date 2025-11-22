import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ForgeCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.32 : SCREEN_WIDTH * 0.88;

  useEffect(() => {
    const update = () => setWindowWidth(Dimensions.get('window').width);
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  const images = member?.images?.length > 0
    ? member.images
    : [{ uri: require('../../assets/Armor/PlaceHolder.jpg'), name: 'Smith' }];

  const description = member?.description || 'A soul forged in fire and sweat.';

  const renderImageCard = (img, i) => (
    <TouchableOpacity
      key={i}
      style={[styles.card(isDesktop, windowWidth), img.clickable !== false && styles.clickable]}
    >
      <Image
        source={typeof img.uri === 'object' ? img.uri : { uri: img.uri }}
        style={styles.armorImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      {img.name && (
        <Text style={styles.cardName}>{img.name}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {member?.codename || member?.name || 'Smith'}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + 20}
          >
            {images.map(renderImageCard)}
          </ScrollView>
        </View>

        <View style={styles.about}>
          <Text style={styles.codename}>{member?.codename || 'Forgeborn'}</Text>
          <Text style={styles.name}>{member?.name || 'Unknown'}</Text>
          <Text style={styles.text}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { paddingBottom: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 3,
    borderBottomColor: '#ff6b35',
  },
  backBtn: {
    padding: 12,
    backgroundColor: 'rgba(255,107,53,0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  backText: { fontSize: 28, color: '#ffae42', fontWeight: 'bold' },
  title: { flex: 1, textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#ffae42', textShadowColor: '#ff6b35', textShadowRadius: 12 },

  imageContainer: { paddingVertical: 20, backgroundColor: '#111' },
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.32 : SCREEN_WIDTH * 0.88,
    height: isDesktop ? SCREEN_HEIGHT * 0.78 : SCREEN_HEIGHT * 0.68,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  }),
  clickable: { borderColor: '#ffae42' },
  armorImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  cardName: { position: 'absolute', bottom: 16, left: 16, fontSize: 18, color: '#ffae42', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 8 },

  about: {
    marginTop: 30,
    padding: 25,
    backgroundColor: '#111',
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  codename: { fontSize: 28, color: '#ffae42', textAlign: 'center', fontWeight: 'bold', textShadowColor: '#ff6b35', textShadowRadius: 10 },
  name: { fontSize: 22, color: '#fff', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  text: { fontSize: 17, color: '#ddd', textAlign: 'center', marginTop: 20, lineHeight: 26 },
});

export default ForgeCharacterDetail;