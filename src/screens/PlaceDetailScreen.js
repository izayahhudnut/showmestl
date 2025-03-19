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
    <View style={styles.container}>
      {/* Status bar safe area with content-matching background */}
      <SafeAreaView style={styles.statusBarSafeArea} />
      
      <StatusBar style="light" />
      
      {/* Background Image - Blurred version of the place image */}
      <Image 
        source={{ uri: place.image }} 
        style={styles.backgroundImage}
        blurRadius={50}
        defaultSource={require('../../assets/placeholder.png')}
      />
      <View style={styles.backgroundOverlay} />
      
      {/* Header Image that extends into status bar */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: place.image }} 
          style={styles.headerImage}
          defaultSource={require('../../assets/placeholder.png')}
        />
        <View style={styles.imageGradient} />
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Place Name and Category Badge */}
        <View style={styles.titleContainer}>
          <View style={styles.titleMain}>
            <Text style={styles.placeTitle}>{place.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{place.category}</Text>
            </View>
          </View>
        </View>
        
        {/* Rating and Address */}
        <View style={styles.detailsContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.placeRating}>{place.rating}</Text>
          </View>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={18} color="#aaaaaa" />
            <Text style={styles.placeAddress}>{place.address}</Text>
          </View>
          {place.website && (
            <TouchableOpacity style={styles.websiteButton} onPress={handleWebsite}>
              <Ionicons name="globe-outline" size={18} color="#aaaaaa" />
              <Text style={styles.websiteText}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Curate', { place })}>
            <Ionicons name="sparkles-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Curate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="paper-plane-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={liked ? "#E74C3C" : "#ffffff"} 
            />
            <Text style={styles.actionButtonText}>Favorite</Text>
          </TouchableOpacity>
        </View>
        
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{place.description}</Text>
        </View>
        
        {/* Map */}
        <View style={styles.mapContainer}>
          <View style={styles.mapHeaderContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity 
              style={styles.directionsButton} 
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate-outline" size={18} color="rgba(150, 80, 170, 0.8)" />
              <Text style={styles.directionsText}>Get Directions</Text>
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
                pinColor="#ffffff"
              />
            </MapView>
          </View>
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Bottom SafeArea padding */}
      <SafeAreaView style={{backgroundColor: 'transparent'}} />
    </View>
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
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%', 
    opacity: 0.6,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18,18,18,0.7)',
  },
  imageContainer: {
    width: '100%',
    height: 400, // Further increased height for a more prominent image
    position: 'relative',
    marginTop: 0, // Start below the status bar area
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18,18,18,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 90, // Moved below status bar/notch area
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(18,18,18,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 9,
  },
  titleMain: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(170, 164, 172, 0.4)',
  },
  categoryBadgeText: {
    fontSize: 14,
    color: 'rgba(243, 243, 243, 0.8)',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeRating: {
    fontSize: 16,
    color: '#ffb700',
    marginLeft: 6,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeAddress: {
    fontSize: 15,
    color: '#dddddd',
    marginLeft: 6,
    flex: 1,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  websiteText: {
    fontSize: 15,
    color: '#aaaaaa',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 6,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#dddddd',
    lineHeight: 22,
  },
  mapContainer: {
    marginBottom: 24,
  },
  mapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  directionsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
    fontSize: 14,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomSpacer: {
    height: 40,
  },
  statusBarSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18,18,18,0.9)',
    zIndex: 10,
  },
});

export default PlaceDetailScreen;