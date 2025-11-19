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
import { memberCategories } from './ConstollationMembers';
import constollationImages from './ConstollationImages';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

const categoryGroups = [
  { title: "Doctors", categories: ["Doctors"] },
  { title: "College", categories: ["IT", "Software"] },
  { title: "High School", categories: ["High School 10th", "BoM Seminary 10th", "High School 11th", "D&C Seminary 11th", "High School 12th", "OT Seminary 12th"] },
  { title: "Jr High", categories: ["Jr. High 7th", "Jr. High 8th", "Jr. High 9th", "NT Seminary 9th"] },
  { title: "Elementary", categories: ["Elementary"] },
  { title: "Influencers", categories: ["Influencers"] },
  { title: "Acquaintances", categories: ["Acquaintances"] },
];

export const ConstollationScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = (member) => {
    if (member.clickable) {
      if (member.screen && member.screen !== '') {
        navigation.navigate(member.screen);
      } else {
        setPreviewMember(member);
      }
    }
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        {
          width: cardSize,
          height: cardSize * cardHeightMultiplier,
          marginHorizontal: horizontalSpacing / 2,
        },
        !member.clickable && styles.disabledCard,
        {
          borderWidth: 2,
          borderColor: '#00b3ff',
          backgroundColor: 'rgba(0, 179, 255, 0.1)',
          shadowColor: '#00b3ff',
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 10,
        },
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      <Image source={member.image} style={styles.characterImage} resizeMode="cover" />
      <Text style={styles.codename}>{member.codename || ''}</Text>
      <Text style={styles.name}>{member.name}</Text>
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => setPreviewMember(null)}
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../assets/BackGround/Constollation.jpg')} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Constollation</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {categoryGroups.map((group, groupIndex) => {
            const groupCategories = memberCategories.filter(category => 
              group.categories.includes(category.category)
            );
            if (groupCategories.length === 0) return null;

            return (
              <View key={groupIndex} style={styles.categorySection}>
                <Text style={styles.categoryHeader}>{group.title}</Text>
                <View style={styles.divider} />
                {groupCategories.map((categoryData, categoryIndex) => {
                  const rows = Math.ceil(categoryData.members.length / columns);

                  return (
                    <View key={categoryIndex}>
                      {Array.from({ length: rows }).map((_, rowIndex) => (
                        <View key={rowIndex} style={[styles.row, { marginBottom: verticalSpacing }]}>
                          {Array.from({ length: columns }).map((_, colIndex) => {
                            const memberIndex = rowIndex * columns + colIndex;
                            const memberObj = categoryData.members[memberIndex];
                            if (!memberObj || !memberObj.name) return <View key={colIndex} style={styles.cardSpacer} />;

                            const member = {
                              name: memberObj.name,
                              codename: memberObj.codename,
                              category: categoryData.category,
                              screen: memberObj.screen || '',
                              image: constollationImages[memberObj.name]?.image || require('../../assets/Armor/PlaceHolder.jpg'),
                              clickable: constollationImages[memberObj.name]?.clickable || false,
                            };

                            return renderMemberCard(member);
                          })}
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>

        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewMember(null)}
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
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
                <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
                <Text style={styles.previewCategory}>{previewMember?.category || 'Unknown'}</Text>
              </View>
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
    justifyContent: 'center',
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardSpacer: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    marginHorizontal: horizontalSpacing / 2,
  },
  disabledCard: {
    opacity: 0.6,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  codename: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  name: {
    position: 'absolute',
    bottom: 34,
    left: 10,
    fontSize: 12,
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
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
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
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
  previewCodename: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
  },
  previewCategory: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ConstollationScreen;