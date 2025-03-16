import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PlaceCard from '../components/PlaceCard';
import { places } from '../data/dummyData';
import { StatusBar } from 'expo-status-bar';

// In a real app, favorites would be stored in state management or async storage
// For this demo, we'll just use a subset of the dummy data
const FavoritesScreen = () => {
  const navigation = useNavigation();
  // Mock favorites - in a real app, this would be managed with proper state
  const [favorites, setFavorites] = useState(places.slice(0, 3));

  const handlePlacePress = (place) => {
    // Navigate to the same place detail screen
    navigation.navigate('PlaceDetail', { place });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
      </View>
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlaceCard 
            place={item} 
            onPress={handlePlacePress}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't added any favorites yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 10,

  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
    marginHorizontal: 10,

  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
  },
});

export default FavoritesScreen;