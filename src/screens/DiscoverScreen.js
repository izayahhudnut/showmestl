import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { places } from '../data/dummyData';

const CategoryCard = ({ image, title, onPress }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.categoryImage} />
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

const ExperienceCard = ({ image, title, subtitle }) => (
  <TouchableOpacity style={styles.experienceCard}>
    <Image source={{ uri: image }} style={styles.experienceImage} />
    <Text style={styles.experienceTitle}>{title}</Text>
    <Text style={styles.experienceSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const PlaylistView = ({ title, places, navigation, onBackPress }) => (
  <SafeAreaView style={styles.container}>

  <View style={styles.playlistContainer}>
    <View style={styles.playlistHeader}>
      <TouchableOpacity onPress={onBackPress}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.playlistTitle}>{title}</Text>
    </View>
    <ScrollView contentContainerStyle={styles.playlistItemsContainer}>
      {places.map(place => (
        <TouchableOpacity 
          key={place.id} 
          style={styles.playlistItem}
          onPress={() => navigation.navigate('PlaceDetail', { place })}
        >
          <Image source={{ uri: place.image }} style={styles.playlistItemImage} />
          <View style={styles.playlistItemContent}>
            <Text style={styles.playlistItemTitle}>{place.name}</Text>
            <Text style={styles.playlistItemSubtitle}>{place.address}</Text>
            <Text style={styles.playlistItemRating}>★ {place.rating}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
</SafeAreaView>
);

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
          {foodSample && (
            <CategoryCard 
              image={foodSample.image}
              title="Food & Drink" 
              onPress={() => setSelectedCategory('Food & Drink')}
            />
          )}
          {museumSample && (
            <CategoryCard 
              image={museumSample.image}
              title="Museums" 
              onPress={() => setSelectedCategory('Museums')}
            />
          )}
          {parkSample && (
            <CategoryCard 
              image={parkSample.image}
              title="Parks & Nature" 
              onPress={() => setSelectedCategory('Parks & Nature')}
            />
          )}
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
              image={parkSample ? parkSample.image : 'https://via.placeholder.com/300'}
              title="Nature Day" 
              subtitle="Explore St. Louis parks" 
            />
            <ExperienceCard 
              image={museumSample ? museumSample.image : 'https://via.placeholder.com/300'}
              title="Art & Culture" 
              subtitle="Museums and galleries" 
            />
            <ExperienceCard 
              image={foodSample ? foodSample.image : 'https://via.placeholder.com/300'}
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
    color: '#3498db',
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
  },
  playlistItemsContainer: {
    padding: 15,
  },
  playlistItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    overflow: 'hidden',
  },
  playlistItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  playlistItemContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  playlistItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playlistItemSubtitle: {
    fontSize: 14,
    color: '#dddddd',
    marginTop: 4,
  },
  playlistItemRating: {
    fontSize: 14,
    color: '#ffb700',
    marginTop: 4,
  },
});

export default DiscoverScreen;