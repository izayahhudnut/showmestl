import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PlaceCard = ({ place, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(place)}>
      <ImageBackground 
        source={{ uri: place.image }} 
        style={styles.card}
        imageStyle={styles.backgroundImage}
        blurRadius={25}
      >
        {/* Overlay gradient */}
        <LinearGradient
          colors={['rgba(18,18,18,0.7)', 'rgba(18,18,18,0.8)']}
          style={styles.gradientOverlay}
        />
        
        {/* Main image thumbnail */}
        <Image source={{ uri: place.image }} style={styles.image} />
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name}>{place.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
          <Text style={styles.rating}>★ {place.rating}</Text>
          <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    borderWidth: 0,
    overflow: 'hidden',
    height: 110, // Increased height to prevent content from being cut off
  },
  backgroundImage: {
    borderRadius: 12,
    opacity: 0.7,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    zIndex: 1,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    zIndex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(170, 164, 172, 0.4)',
  },
  categoryText: {
    fontSize: 12,
    color: 'rgba(176, 176, 176, 0.8)',
    fontWeight: '500',
  },
  rating: {
    fontSize: 14,
    color: '#ffb700',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#dddddd',
  },
});

export default PlaceCard;