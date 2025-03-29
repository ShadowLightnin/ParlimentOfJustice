import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { memberCategories } from './LegionairesMembers'; // Import memberCategories directly
import legionImages from './LegionairesImages'; // Import legionImages for image mapping

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 7 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 20 : 10;

export const LegionairesScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null); // State for preview modal

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/League.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header, Back, and Chat Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Legionnaires</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Category Sections */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {memberCategories.map((categoryData, categoryIndex) => {
            const rows = Math.ceil(categoryData.members.length / columns);

            return (
              <View key={categoryIndex} style={styles.categorySection}>
                {/* Category Header */}
                <Text style={styles.categoryHeader}>{categoryData.category}</Text>
                <View style={styles.divider} />

                {/* Grid of Members */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <View key={rowIndex} style={[styles.row, { marginBottom: verticalSpacing }]}>
                    {Array.from({ length: columns }).map((_, colIndex) => {
                      const memberIndex = rowIndex * columns + colIndex;
                      const memberName = categoryData.members[memberIndex];
                      if (!memberName) return <View key={colIndex} style={styles.cardSpacer} />;

                      const memberData = legionImages[memberName] || {
                        image: require('../../assets/Armor/PlaceHolder.jpg'),
                        clickable: false,
                      };

                      const member = {
                        name: memberName,
                        codename: categoryData.category,
                        screen: `Member${categoryIndex * 100 + memberIndex + 1}`,
                        image: memberData.image,
                        clickable: memberData.clickable,
                      };

                      return (
                        <TouchableOpacity
                          key={colIndex}
                          style={[
                            styles.card,
                            {
                              width: cardSize,
                              height: cardSize * cardHeightMultiplier,
                              marginHorizontal: horizontalSpacing / 2,
                              ...(member.clickable ? {} : styles.disabledCard),
                            },
                          ]}
                          onPress={() => member.clickable && setPreviewMember(member)}
                          disabled={!member.clickable}
                        >
                          {member.image && (
                            <>
                              <Image source={member.image} style={styles.characterImage} />
                              <View style={styles.transparentOverlay} />
                            </>
                          )}
                          <Text style={styles.codename}>{member.codename}</Text>
                          <Text style={styles.name}>{member.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>

        {/* Preview Modal */}
        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPress={() => setPreviewMember(null)}
            >
              <Image
                source={previewMember?.image || require('../../assets/Armor/PlaceHolder.jpg')}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <Text style={styles.previewCodename}>{previewMember?.codename}</Text>
              <Text style={styles.previewName}>{previewMember?.name}</Text>
              <View style={styles.transparentOverlay} />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 20,
    color: '#00b3ff',
  },
  scrollContainer: {
    paddingBottom: 20,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: verticalSpacing * 2,
    width: '100%',
  },
  categoryHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#00b3ff',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
  },
  cardSpacer: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    marginHorizontal: horizontalSpacing / 2,
  },
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewCodename: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  previewName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
});

export default LegionairesScreen;