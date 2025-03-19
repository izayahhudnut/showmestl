import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { places } from '../data/dummyData';

// Import local image assets
const categoryImages = {
  'Food & Drink': require('../../assets/art/food.webp'),
  'Museums': require('../../assets/art/musuems.jpg'),
  'Parks & Nature': require('../../assets/art/park.jpg'),
};

const CategoryCard = ({ image, title, onPress, useLocalImage = false }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <Image 
      source={useLocalImage ? image : { uri: image }} 
      style={styles.categoryImage} 
    />
    <View style={styles.categoryOverlay}>
      <Text style={styles.categoryTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const PlaceCard = ({ place, onPress }) => (
  <TouchableOpacity style={styles.placeCard} onPress={() => onPress(place)}>
    <Image source={{ uri: place.image }} style={styles.placeImage} />
    <Text style={styles.placeTitle}>{place.name}</Text>
    <Text style={styles.placeSubtitle}>{place.category}</Text>
  </TouchableOpacity>
);

// Helper function to get the correct image based on index
const getExperienceImage = (index) => {
  switch (index) {
    case 1:
      return require('../../assets/art/1.png');
    case 2:
      return require('../../assets/art/2.png');
    case 3:
      return require('../../assets/art/3.png');
    case 4:
      return require('../../assets/art/4.png');
    case 5:
      return require('../../assets/art/5.png');
    default:
      return require('../../assets/placeholder.png');
  }
};

const ExperienceCard = ({ index, title, subtitle }) => {
  return (
    <TouchableOpacity style={styles.experienceCard}>
      <Image source={getExperienceImage(index)} style={styles.experienceImage} />
      <Text style={styles.experienceTitle}>{title}</Text>
      <Text style={styles.experienceSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};


const renderTikTokView = ({ item, navigation, category }) => {
  return (
    <View style={styles.tikTokContainer}>
      <View style={styles.tikTokCard}>
        <View style={styles.tikTokImageContainer}>
          <TouchableOpacity 
            style={styles.tikTokImageTouchable}
            onPress={() => navigation.navigate('PlaceDetail', { place: item })}
          >
            <View style={styles.tikTokImage}>
              <Image 
                source={{ uri: item.image }} 
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={styles.tikTokImageOverlay} />
            </View>
            
            <View style={styles.tikTokContent}>
              <Text style={styles.tikTokName}>{item.name}</Text>
              <View style={styles.tikTokCategoryBadge}>
                <Text style={styles.tikTokCategoryText}>{item.category}</Text>
              </View>
              
              <View style={styles.tikTokRatingContainer}>
                <Text style={styles.tikTokRating}>★ {item.rating || "4.5"}</Text>
              </View>
              
              {item.address ? (
                <Text style={styles.tikTokAddress} numberOfLines={1}>
                  {item.address}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PlaylistView = ({ title, places, navigation, onBackPress }) => {
  const { width } = Dimensions.get('window');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playlistContainer}>
        <View style={styles.playlistHeader}>
          <TouchableOpacity onPress={onBackPress}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.playlistTitle}>{title}</Text>
        </View>
        
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderTikTokView({ item, navigation, category: title })}
          snapToInterval={width}
          decelerationRate="fast"
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{flex: 1}}
        />
      </View>
    </SafeAreaView>
  );
};

const DiscoverScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Filter places by category
  const foodAndDrinkPlaces = places.filter(place => place.category === 'Food & Drink');
  const museumPlaces = places.filter(place => place.category === 'Museums');
  const parksAndNaturePlaces = places.filter(place => place.category === 'Parks & Nature');
  
  // Get sample items for category cards
  const foodSample = foodAndDrinkPlaces.length > 0 ? foodAndDrinkPlaces[0] : null;
  const museumSample = museumPlaces.length > 0 ? museumPlaces[0] : null;
  const parkSample = parksAndNaturePlaces.length > 0 ? parksAndNaturePlaces[0] : null;

  if (selectedCategory) {
    const categoryPlaces = places.filter(place => 
      place.category === selectedCategory
    );
    
    return (
      <PlaylistView 
        title={selectedCategory} 
        places={categoryPlaces}
        navigation={navigation}
        onBackPress={() => setSelectedCategory(null)}
      />
    );
  }

  const handlePlacePress = (place) => {
    navigation.navigate('PlaceDetail', { place });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover STL</Text>
        </View>

        {/* Top Category Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          <CategoryCard 
            image={categoryImages['Food & Drink']}
            title="Food & Drink" 
            onPress={() => setSelectedCategory('Food & Drink')}
            useLocalImage={true}
          />
          <CategoryCard 
            image={categoryImages['Museums']}
            title="Museums" 
            onPress={() => setSelectedCategory('Museums')}
            useLocalImage={true}
          />
          <CategoryCard 
            image={categoryImages['Parks & Nature']}
            title="Parks & Nature" 
            onPress={() => setSelectedCategory('Parks & Nature')}
            useLocalImage={true}
          />
        </ScrollView>

        {/* Food & Drink Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Food & Drink</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('Food & Drink')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesContainer}
          >
            {foodAndDrinkPlaces.slice(0, 5).map(place => (
              <PlaceCard 
                key={place.id}
                place={place}
                onPress={handlePlacePress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Museums Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Museums</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('Museums')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesContainer}
          >
            {museumPlaces.slice(0, 5).map(place => (
              <PlaceCard 
                key={place.id}
                place={place}
                onPress={handlePlacePress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Experiences Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.experienceHeader}>
            <View>
              <Text style={styles.experienceHeaderSubtitle}>Curated for you</Text>
              <Text style={styles.sectionTitle}>Experiences</Text>
            </View>
          </View>
          
          <View style={styles.experiencesGrid}>
            <ExperienceCard 
              index={1}
              title="Nature Day" 
              subtitle="Explore St. Louis parks" 
            />
            <ExperienceCard 
              index={2}
              title="Art & Culture" 
              subtitle="Museums and galleries" 
            />
            <ExperienceCard 
              index={3}
              title="Foodie Tour" 
              subtitle="Local restaurants and bars" 
            />
          </View>
        </View>

        {/* Spacer for bottom tabs */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  categoryCard: {
    width: 180,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  placesContainer: {
    paddingBottom: 10,
  },
  placeCard: {
    width: 160,
    marginRight: 15,
  },
  placeImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  placeSubtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginTop: 2,
  },
  experienceHeader: {
    marginBottom: 15,
  },
  experienceHeaderSubtitle: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  experiencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  experienceCard: {
    width: '48%',
    marginBottom: 20,
  },
  experienceImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  experienceSubtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginTop: 2,
  },
  bottomSpacer: {
    height: 80,
  },
  playlistContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  playlistHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    fontSize: 16,
    color: '#3498db',
    marginRight: 20,
  },
  playlistTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  
  
  // TikTok style view
  tikTokContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  tikTokCard: {
    width: '100%',
    height: '95%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 5,
  },
  tikTokImageContainer: {
    flex: 1,
  },
  tikTokImageTouchable: {
    flex: 1,
  },
  tikTokImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tikTokImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.5)',
  },
  tikTokContent: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
    padding: 15,
    borderRadius: 12,
  },
  tikTokName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tikTokCategoryBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.4)',
  },
  tikTokCategoryText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  tikTokRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tikTokRating: {
    fontSize: 16,
    color: '#ffb700',
  },
  tikTokAddress: {
    fontSize: 16,
    color: '#dddddd',
  },
});

export default DiscoverScreen;