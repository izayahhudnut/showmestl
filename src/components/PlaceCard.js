import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PlaceCard = ({ place, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(place)}>
      <Image source={{ uri: place.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{place.category}</Text>
        </View>
        <Text style={styles.rating}>★ {place.rating}</Text>
        <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)', // Light blue background
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.4)',
  },
  categoryText: {
    fontSize: 12,
    color: '#3498db',
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