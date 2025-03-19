import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PlaceCard from '../components/PlaceCard';
import { places } from '../data/dummyData';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../App';

// Favorite place item that looks like a song in Apple Music
const FavoritePlaceItem = ({ place, onPress, index }) => {
  return (
    <TouchableOpacity style={styles.favoritePlaceItem} onPress={() => onPress(place)}>
      <Text style={styles.placeIndex}>{index + 1}</Text>
      <Image source={{ uri: place.image }} style={styles.placeItemImage} />
      <View style={styles.placeItemInfo}>
        <Text style={styles.placeItemName}>{place.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{place.category}</Text>
        </View>
      </View>
      <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
    </TouchableOpacity>
  );
};

// Playlist item that looks like an album in Apple Music
const PlaylistItem = ({ playlist, onPress }) => {
  // Determine cover image from the first place in the playlist
  const coverImage = playlist.places && playlist.places.length > 0 
    ? places.find(p => p.name === playlist.places[0])?.image 
    : 'https://via.placeholder.com/300';

  return (
    <TouchableOpacity style={styles.playlistCard} onPress={() => onPress(playlist)}>
      <Image 
        source={{ uri: coverImage }} 
        style={styles.playlistImage} 
      />
      <Text style={styles.playlistTitle}>{playlist.title}</Text>
      <Text style={styles.playlistSubtitle}>{playlist.places.length} places</Text>
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  
  // Mock user data
  const [user, setUser] = useState({
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/300?img=8",
    favorites: places.slice(0, 5), // Mock favorite places
    playlists: [
      {
        id: '1',
        title: 'Foodie Tour',
        date: 'Created Mar 5, 2025',
        places: ['Brasserie by Niche', 'Louie', '801 Chophouse'],
        description: 'A perfect evening of fine dining and wine tasting in St. Louis.'
      },
      {
        id: '2',
        title: 'Cultural Day',
        date: 'Created Feb 20, 2025',
        places: ['Saint Louis Art Museum', 'The City Museum', 'Science Center'],
        description: 'Explore the best museums and cultural attractions in St. Louis.'
      },
      {
        id: '3',
        title: 'Nature Enthusiast',
        date: 'Created Jan 15, 2025',
        places: ['Forest Park', 'Missouri Botanical Garden', 'Saint Louis Zoo'],
        description: 'A day outdoors enjoying the natural beauty of St. Louis.'
      },
      {
        id: '4',
        title: 'Nightlife Adventure',
        date: 'Created Dec 5, 2024',
        places: ['Up-Down STL', 'Three Sixty Rooftop Bar', 'The Foundry'],
        description: 'Experience the vibrant nightlife scene in St. Louis.'
      }
    ]
  });

  const handlePlacePress = (place) => {
    // Navigate to place details screen
    navigation.navigate('PlaceDetail', { place });
  };

  const handlePlaylistPress = (playlist) => {
    // Navigate to the playlist/experience detail screen
    navigation.navigate('CurateResults', { experience: playlist });
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => {
            try {
              // Use the logout function from AuthContext
              logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          <Text style={styles.profileName}>{user.name}</Text>
          <View style={styles.profileButtonsRow}>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Favorite Places Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite Places</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {user.favorites.length > 0 ? (
            <View style={styles.favoritesContainer}>
              {user.favorites.map((place, index) => (
                <FavoritePlaceItem 
                  key={place.id} 
                  place={place} 
                  index={index}
                  onPress={handlePlacePress} 
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't added any favorite places yet</Text>
            </View>
          )}
        </View>
        
        {/* Playlists Section - Styled like Apple Music albums */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {user.playlists.length > 0 ? (
            <View style={styles.playlistsGrid}>
              {user.playlists.map(playlist => (
                <PlaylistItem 
                  key={playlist.id} 
                  playlist={playlist} 
                  onPress={handlePlaylistPress} 
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't created any playlists yet</Text>
            </View>
          )}
        </View>
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  profileButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(150, 80, 170, 0.8)',
    marginRight: 10,
  },
  editProfileText: {
    color: 'rgba(150, 80, 170, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Section Styles
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAllText: {
    color: 'rgba(150, 80, 170, 0.8)',
    fontSize: 15,
  },
  
  // Favorite Place Items (Song-like)
  favoritesContainer: {
    marginBottom: 10,
  },
  favoritePlaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  placeIndex: {
    width: 30,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  placeItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 15,
  },
  placeItemInfo: {
    flex: 1,
  },
  placeItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  
  // Category Badge
  categoryBadge: {
    backgroundColor: 'rgba(150, 80, 170, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(150, 80, 170, 0.4)',
  },
  categoryText: {
    fontSize: 12,
    color: 'rgba(150, 80, 170, 0.8)',
    fontWeight: '500',
  },
  
  // Playlists Grid (Album-like)
  playlistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  playlistCard: {
    width: '48%', // Almost half the width with some spacing
    marginBottom: 20,
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1, // Square image
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  playlistSubtitle: {
    fontSize: 14,
    color: '#888888',
  },
  
  // Empty States
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
  },
  
  // Spacing
  bottomSpacer: {
    height: 80, // For tab bar
  },
});

export default ProfileScreen;