import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const PlaceDetailScreen = ({ route, navigation }) => {
  // Get place details from route params
  const place = route.params?.place || {
    id: '1',
    name: 'Louies',
    category: 'Dining',
    rating: 4.5,
    address: '123 Main Street, St. Louis, MO',
    description: 'Labore sunt veniam amet est. Minim nisi dolor eu ad incididunt cillum elit ex ut. Dolore exercitation nulla tempor consequat aliquip occaecat. Nisi id ipsum irure aute. Deserunt sit aute irure quis nulla eu consequat fugiat Lorem sunt magna et consequat labore.',
    image: 'https://via.placeholder.com/150',
    website: 'https://example.com'
  };

  // Default St. Louis coordinates
  const defaultCoordinates = {
    latitude: 38.6270,
    longitude: -90.1994,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // In a real app, you would save this preference to your backend or local storage
    // Then use it for your recommendation algorithm
  };

  const handleShare = () => {
    // In a real app, this would use the Share API
    console.log('Sharing:', place.name);
  };

  const handleWebsite = () => {
    // Open the website if available
    if (place.website) {
      Linking.openURL(place.website);
    } else {
      console.log('No website available for:', place.name);
    }
  };

  const handleGetDirections = () => {
    // Open in maps app
    const address = encodeURIComponent(place.address);
    const url = `https://maps.google.com/maps?q=${address}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: place.image }} 
          style={styles.headerImage}
          defaultSource={require('../../assets/placeholder.png')}
        />
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Place Name and Actions */}
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.placeTitle}>{place.name}</Text>
            <Text style={styles.placeCategory}>{place.category}</Text>
            <Text style={styles.placeRating}>★ {place.rating}</Text>
            <Text style={styles.placeAddress}>{place.address}</Text>
          </View>
          <View style={styles.actionIconsContainer}>
            <TouchableOpacity 
              style={styles.actionIconButton}
              onPress={handleLike}
            >
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={24} 
                color={liked ? "#E74C3C" : "#ffffff"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionIconButton}
              onPress={handleWebsite}
            >
              <Ionicons name="globe-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.curateButton}>
            <Text style={styles.curateButtonText}>Curate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#ffffff" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* Description */}
        <Text style={styles.description}>{place.description}</Text>
        
        {/* Map */}
        <View style={styles.mapContainer}>
          <View style={styles.mapHeaderContainer}>
            <Text style={styles.mapTitle}>Location</Text>
            <TouchableOpacity 
              style={styles.directionsButton} 
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate-outline" size={18} color="#3498db" />
              <Text style={styles.directionsText}>Directions</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={defaultCoordinates}
              customMapStyle={darkMapStyle}
            >
              <Marker
                coordinate={{
                  latitude: defaultCoordinates.latitude,
                  longitude: defaultCoordinates.longitude,
                }}
                title={place.name}
                description={place.address}
                pinColor="#3498db"
              />
            </MapView>
          </View>
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Dark mode map style
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  placeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 4,
  },
  placeRating: {
    fontSize: 16,
    color: '#ffb700',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 16,
    color: '#dddddd',
  },
  actionIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    padding: 8,
    marginLeft: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  curateButton: {
    backgroundColor: '#3498db', 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 15,
  },
  curateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  shareButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    color: '#dddddd',
    lineHeight: 24,
    marginBottom: 20,
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsText: {
    color: '#3498db',
    marginLeft: 5,
    fontSize: 14,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // Removed voting container styles
  bottomSpacer: {
    height: 40, // Reduced spacing now that we don't have voting buttons
  },
});

export default PlaceDetailScreen;