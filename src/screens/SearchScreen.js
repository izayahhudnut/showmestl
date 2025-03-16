import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PlaceCard from '../components/PlaceCard';
import { places, categories } from '../data/dummyData';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// St. Louis neighborhoods
const neighborhoods = [
  'All',
  'Downtown',
  'Central West End',
  'The Grove',
  'Soulard',
  'The Hill',
  'Lafayette Square',
  'Tower Grove',
  'Delmar Loop',
  'Cherokee Street',
  'Shaw',
  'Dogtown',
  'Forest Park Southeast',
];

// Distance options
const distanceOptions = [
  { value: 0, label: 'Any Distance' },
  { value: 1, label: '1 mile' },
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 20, label: '20 miles' },
];

// Custom dropdown component
const FilterDropdown = ({ label, options, selected, onSelect, icon }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name={icon} size={18} color="#3498db" style={styles.dropdownIcon} />
        <Text style={styles.dropdownButtonText} numberOfLines={1}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color="#999" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {options.map((option, index) => {
                const value = typeof option === 'object' ? option.value : option;
                const displayLabel = typeof option === 'object' ? option.label : option;
                const isSelected = selected === value;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionItem, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                      {displayLabel}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color="#3498db" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Toggle switch component
const ToggleSwitch = ({ label, isOn, onToggle, icon }) => {
  return (
    <TouchableOpacity 
      style={[styles.toggleContainer, isOn && styles.toggleContainerActive]} 
      onPress={onToggle}
    >
      <Ionicons name={icon} size={18} color={isOn ? "#fff" : "#3498db"} style={styles.toggleIcon} />
      <Text style={[styles.toggleText, isOn && styles.toggleTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

// View mode toggle component
const ViewModeToggle = ({ viewMode, onToggle }) => {
  return (
    <View style={styles.viewModeContainer}>
      <TouchableOpacity 
        style={[
          styles.viewModeButton, 
          viewMode === 'list' && styles.viewModeButtonActive
        ]}
        onPress={() => onToggle('list')}
      >
        <Ionicons name="list" size={20} color={viewMode === 'list' ? "#fff" : "#777"} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.viewModeButton,
          viewMode === 'tiktok' && styles.viewModeButtonActive
        ]}
        onPress={() => onToggle('tiktok')}
      >
        <Ionicons name="apps" size={20} color={viewMode === 'tiktok' ? "#fff" : "#777"} />
      </TouchableOpacity>
    </View>
  );
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  
  // Flat list ref for scrolling
  const listRef = useRef(null);
  
  useEffect(() => {
    filterPlaces();
  }, [searchQuery, selectedCategory, selectedNeighborhood, selectedDistance, isOpenNow]);

  const filterPlaces = () => {
    let result = places;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(place => place.category === selectedCategory);
    }
    
    // Filter by neighborhood
    if (selectedNeighborhood !== 'All') {
      // In a real app, we would have neighborhood data for each place
      // For now, we'll simulate this by using a substring match on the address
      result = result.filter(place => 
        place.address && place.address.includes(selectedNeighborhood)
      );
    }
    
    // Filter by distance
    if (selectedDistance > 0) {
      // In a real app, we would calculate actual distances from user's location
      // For now, we'll just simulate this with a random subset of places
      const maxDistance = selectedDistance;
      result = result.filter(place => {
        // Simulating distance calculation (in a real app, use geolocation)
        const simulatedDistance = Math.random() * 25; // Random distance up to 25 miles
        return simulatedDistance <= maxDistance;
      });
    }
    
    // Filter by open now
    if (isOpenNow) {
      // In a real app, we would check actual business hours
      // For now, we'll just simulate with a subset of places
      result = result.filter(_ => Math.random() > 0.3); // 70% chance place is "open"
    }
    
    setFilteredPlaces(result);
  };

  const handlePlacePress = (place) => {
    // Navigate to place details screen
    navigation.navigate('PlaceDetail', { place });
  };

  // TikTok style swipeable place view
  const renderTikTokView = ({ item, index }) => {
    return (
      <View style={styles.tikTokContainer}>
        <View style={styles.tikTokCard}>
          <View style={styles.tikTokImageContainer}>
            <TouchableOpacity 
              style={styles.tikTokImageTouchable}
              onPress={() => handlePlacePress(item)}
            >
              {item.image ? (
                <View style={styles.tikTokImage}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  <View style={styles.tikTokImageOverlay} />
                </View>
              ) : null}
              
              <View style={styles.tikTokContent}>
                <Text style={styles.tikTokName}>{item.name}</Text>
                <View style={styles.tikTokCategoryBadge}>
                  <Text style={styles.tikTokCategoryText}>{item.category}</Text>
                </View>
                
                <View style={styles.tikTokRatingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.tikTokRating}>{item.rating || "4.5"}</Text>
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

  // Get current filter label for display
  const getCategoryLabel = () => {
    return selectedCategory === 'All' ? 'Categories' : selectedCategory;
  };
  
  const getNeighborhoodLabel = () => {
    return selectedNeighborhood === 'All' ? 'Neighborhoods' : selectedNeighborhood;
  };
  
  const getDistanceLabel = () => {
    const option = distanceOptions.find(opt => opt.value === selectedDistance);
    return option ? option.label : 'Distance';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        
        {/* View Mode Toggle */}
        <ViewModeToggle 
          viewMode={viewMode}
          onToggle={setViewMode}
        />
      </View>
      
      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaaaaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          placeholderTextColor="#aaaaaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color="#aaaaaa"
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>
      
      {/* Filter Options */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {/* Category Filter */}
          <FilterDropdown
            label={getCategoryLabel()}
            options={['All', ...categories]}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            icon="restaurant-outline"
          />
          
          {/* Neighborhood Filter */}
          <FilterDropdown
            label={getNeighborhoodLabel()}
            options={neighborhoods}
            selected={selectedNeighborhood}
            onSelect={setSelectedNeighborhood}
            icon="location-outline"
          />
          
          {/* Distance Filter */}
          <FilterDropdown
            label={getDistanceLabel()}
            options={distanceOptions}
            selected={selectedDistance}
            onSelect={setSelectedDistance}
            icon="navigate-outline"
          />
          
          {/* Open Now Toggle */}
          <ToggleSwitch
            label="Open Now"
            isOn={isOpenNow}
            onToggle={() => setIsOpenNow(!isOpenNow)}
            icon="time-outline"
          />
        </ScrollView>
      </View>
      
      {/* Results count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
        </Text>
      </View>
      
      {/* Places List - Changes based on view mode */}
      {viewMode === 'list' ? (
        <FlatList
          ref={listRef}
          data={filteredPlaces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PlaceCard place={item} onPress={handlePlacePress} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#444" style={{marginBottom: 20}} />
              <Text style={styles.emptyText}>No places found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          ref={listRef}
          data={filteredPlaces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTikTokView}
          contentContainerStyle={styles.tikTokListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#444" style={{marginBottom: 20}} />
              <Text style={styles.emptyText}>No places found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          }
          snapToInterval={width} // For TikTok style snapping
          decelerationRate="fast"
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{flex: 1}} // Make sure it takes up all available space
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    paddingBottom: 0, // Remove bottom padding to avoid extra space
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // Search box
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 46,
    marginHorizontal: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#ffffff',
  },
  clearIcon: {
    padding: 5,
  },
  
  // Filters section
  filtersContainer: {
    marginBottom: 10,
  },
  filtersScrollContent: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  
  // Dropdown styles
  dropdownContainer: {
    marginRight: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    minWidth: 120,
  },
  dropdownIcon: {
    marginRight: 6,
  },
  dropdownButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  selectedOption: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: '#dddddd',
  },
  selectedOptionText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  
  // Toggle switch styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
  },
  toggleContainerActive: {
    backgroundColor: '#3498db',
  },
  toggleIcon: {
    marginRight: 6,
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // View mode toggle
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
  },
  viewModeButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#3498db',
  },
  
  // Results counter
  resultsContainer: {
    marginBottom: 5, // Reduced margin
    paddingHorizontal: 5,
  },
  resultsText: {
    fontSize: 14,
    color: '#999',
  },
  
  // List view
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  
  // TikTok style view
  tikTokListContent: {
    alignItems: 'center',
    paddingBottom: 80, // Add padding to ensure navbar doesn't cover content
  },
  tikTokContainer: {
    width: width,
    height: '100%',
    justifyContent: 'flex-start', // Changed from center to flex-start
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 0, // Reduced top padding
  },
  tikTokCard: {
    width: '100%',
    height: '95%', // Increased height
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 5, // Small margin to avoid crowding the results text
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
  },
  tikTokContent: {
    position: 'absolute',
    bottom: 40, // Increased to avoid navbar
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
    backgroundColor: 'rgba(52, 152, 219, 0.2)', // Light blue background
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
    color: '#ffffff',
    marginLeft: 5,
  },
  tikTokAddress: {
    fontSize: 16,
    color: '#dddddd',
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#aaaaaa',
  },
});

export default SearchScreen;