import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Image, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { places } from '../data/dummyData';

const PlaceSearchScreen = ({ navigation, route }) => {
  const { onPlaceSelect } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Filter places based on the search query
  const searchPlaces = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Filter the places from our dummy data
    const filteredPlaces = places.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.category.toLowerCase().includes(query.toLowerCase()) ||
      (place.address && place.address.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(filteredPlaces);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    searchPlaces(text);
  };

  const handleSelectPlace = (place) => {
    if (onPlaceSelect) {
      // This is used when selecting a place to start an experience
      onPlaceSelect(place);
      // Automatically navigate back to the experience creation screen
      navigation.goBack();
    } else {
      // Fallback to directly navigating to place detail
      navigation.navigate('PlaceDetail', { place });
    }
  };

  const renderPlaceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.placeItem}
      onPress={() => handleSelectPlace(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.placeImage} 
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeDetails}>{item.category}</Text>
        {item.address && (
          <Text style={styles.placeAddress} numberOfLines={1}>{item.address}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#777777" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Places</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a place in St. Louis"
            placeholderTextColor="#777777"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery ? (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => handleSearch('')}
            >
              <Ionicons name="close-circle" size={20} color="#777777" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <FlatList
        data={searchResults}
        renderItem={renderPlaceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={50} color="#444444" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No places found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={50} color="#444444" style={styles.emptyIcon} />
              <Text style={styles.instructionText}>Search for a place in St. Louis</Text>
              <Text style={styles.emptySubtext}>Find restaurants, attractions, museums and more</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34, // To balance the header
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 5,
  },
  listContent: {
    padding: 15,
    paddingBottom: 50,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  placeDetails: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 13,
    color: '#777777',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default PlaceSearchScreen;