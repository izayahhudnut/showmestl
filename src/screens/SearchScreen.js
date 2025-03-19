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
  Image,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
        <BlurView intensity={20} tint="dark" style={styles.blurOverlay} />
        <Ionicons name={icon} size={18} color="#ffffff" style={styles.dropdownIcon} />
        <Text style={styles.dropdownButtonText} numberOfLines={1}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color="#ffffff" />
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
                      <Ionicons name="checkmark" size={18} color="rgba(150, 80, 170, 0.8)" />
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
      <BlurView intensity={20} tint="dark" style={styles.blurOverlay} />
      <Ionicons name={icon} size={18} color="#ffffff" style={styles.toggleIcon} />
      <Text style={[styles.toggleText, isOn && styles.toggleTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

// Animated circle for view mode toggle (simplified from Button.js)
const AnimatedCircle = ({ size, color, duration, startPosition, endPosition }) => {
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: duration,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [startPosition.x, endPosition.x],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [startPosition.y, endPosition.y],
  });

  return (
    <Animated.View
      style={[
        styles.viewModeCircle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    />
  );
};

// Enhanced view mode toggle component
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
        <View style={styles.viewModeGradientContainer}>
          <LinearGradient
            colors={['#333333', '#222222', '#111111']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.viewModeGradient}
          />
          
          {/* Smaller circles for the toggle button */}
          <AnimatedCircle
            size={70}
            color="rgba(255, 87, 51, 0.4)"
            duration={25000}
            startPosition={{ x: -30, y: -30 }}
            endPosition={{ x: 10, y: 10 }}
          />
          <AnimatedCircle
            size={90}
            color="rgba(46, 204, 113, 0.3)"
            duration={28000}
            startPosition={{ x: 20, y: -40 }}
            endPosition={{ x: -20, y: 20 }}
          />
          <AnimatedCircle
            size={100}
            color="rgba(52, 152, 219, 0.5)"
            duration={30000}
            startPosition={{ x: 30, y: 20 }}
            endPosition={{ x: -30, y: -20 }}
          />
          
          <View style={styles.viewModeDarkOverlay} />
        </View>
        <Ionicons name="list" size={22} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.viewModeButton,
          viewMode === 'tiktok' && styles.viewModeButtonActive
        ]}
        onPress={() => onToggle('tiktok')}
      >
        <View style={styles.viewModeGradientContainer}>
          <LinearGradient
            colors={['#333333', '#222222', '#111111']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.viewModeGradient}
          />
          
          {/* Smaller circles for the toggle button */}
          <AnimatedCircle
            size={80}
            color="rgba(241, 196, 15, 0.4)"
            duration={27000}
            startPosition={{ x: -40, y: 10 }}
            endPosition={{ x: 40, y: -30 }}
          />
          <AnimatedCircle
            size={100}
            color="rgba(231, 76, 60, 0.35)"
            duration={32000}
            startPosition={{ x: 0, y: 40 }}
            endPosition={{ x: 20, y: -40 }}
          />
          <AnimatedCircle
            size={70}
            color="rgba(155, 89, 182, 0.45)"
            duration={29000}
            startPosition={{ x: 30, y: 0 }}
            endPosition={{ x: -30, y: -20 }}
          />
          
          <View style={styles.viewModeDarkOverlay} />
        </View>
        <Ionicons name="apps" size={22} color="#fff" />
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
        <TouchableOpacity 
          style={styles.tikTokCard}
          onPress={() => handlePlacePress(item)}
        >
          <ImageBackground 
            source={{ uri: item.image }} 
            style={styles.tikTokCard}
            blurRadius={35}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(18,18,18,0.3)', 'rgba(18,18,18,0.7)']}
              style={styles.tikTokGradient}
            />
            
            {/* Main Image */}
            <Image 
              source={{ uri: item.image }} 
              style={styles.tikTokMainImage}
              resizeMode="cover"
            />
            
            {/* Content */}
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
          </ImageBackground>
        </TouchableOpacity>
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

  // Empty state component with proper padding
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#444" style={{marginBottom: 20}} />
      <Text style={styles.emptyText}>No places found</Text>
      <Text style={styles.emptySubText}>Try adjusting your filters</Text>
    </View>
  );

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
        <Ionicons name="search" size={20} color="#ffffff" style={styles.searchIcon} />
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
            color="#ffffff"
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
          contentContainerStyle={filteredPlaces.length === 0 ? styles.emptyListContent : styles.listContent}
          ListEmptyComponent={EmptyListComponent}
        />
      ) : (
        <FlatList
          ref={listRef}
          data={filteredPlaces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTikTokView}
          contentContainerStyle={filteredPlaces.length === 0 ? styles.emptyTikTokContent : styles.tikTokListContent}
          ListEmptyComponent={EmptyListComponent}
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
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // Increased from 10 to 20 to match DiscoverScreen
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
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 46,
    marginHorizontal: 20, // Increased from 5 to 20 to match DiscoverScreen spacing
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 10,
    color: '#ffffff',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 8,
    paddingLeft: 0,
    paddingRight: 8,
  },
  clearIcon: {
    padding: 5,
  },
  
  // Filters section
  filtersContainer: {
    marginBottom: 10,
    paddingHorizontal: 15, // Added horizontal padding
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
    backgroundColor: 'rgba(50, 50, 50, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    minWidth: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  dropdownIcon: {
    marginRight: 6,
    color: '#ffffff',
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
    backgroundColor: 'rgba(150, 80, 170, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: '#dddddd',
  },
  selectedOptionText: {
    color: 'rgba(150, 80, 170, 0.8)',
    fontWeight: 'bold',
  },
  
  // BlurView for filters
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },

  // Toggle switch styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  toggleContainerActive: {
    backgroundColor: 'rgba(150, 80, 170, 0.3)',
    borderColor: 'rgba(150, 80, 170, 0.4)',
  },
  toggleIcon: {
    marginRight: 6,
    color: '#ffffff',
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
  
  // View mode toggle - enhanced version
  viewModeContainer: {
    flexDirection: 'row',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 3,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  viewModeButtonActive: {
    backgroundColor: 'rgba(150, 80, 170, 0.4)',
  },
  viewModeGradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 20,
  },
  viewModeGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  viewModeCircle: {
    position: 'absolute',
    opacity: 0.8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.5,
    elevation: 8,
  },
  viewModeDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(101, 100, 100, 0.90)',
    zIndex: 1,
  },
  
  // Results counter
  resultsContainer: {
    marginBottom: 5, // Reduced margin
    paddingHorizontal: 20, // Changed to 20 to match other elements
  },
  resultsText: {
    fontSize: 14,
    color: '#999',
  },
  
  // List view
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 20, // Changed from 5 to 20 to match DiscoverScreen
  },
  
  // Empty list content styles with proper padding
  emptyListContent: {
    flex: 1,
    paddingHorizontal: 15, // Explicitly set to 15
  },
  
  emptyTikTokContent: {
    flex: 1,
    paddingHorizontal: 15, // Explicitly set to 15
    width: width, // Make sure it takes full width
  },
  
  // TikTok style view
  tikTokListContent: {
    alignItems: 'center',
    paddingBottom: 80, // Add padding to ensure navbar doesn't cover content
  },
  tikTokContainer: {
    width: width,
    height: '100%',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  tikTokCard: {
    width: '100%',
    height: '95%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 5,
    borderWidth: 0,
  },
  tikTokGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  tikTokMainImage: {
    width: '92%',
    height: '70%',
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
    borderWidth: 0,
  },
  tikTokContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
    borderWidth: 0,
    backdropFilter: 'blur(8px)',
  },
  tikTokName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tikTokCategoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(170, 164, 172, 0.4)',
  },
  tikTokCategoryText: {
    fontSize: 14,
    color: 'rgba(242, 240, 243, 0.8)',
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
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 15,
    paddingTop: 100,
    width: '100%', // Ensures the container takes full width
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center', // Center text horizontally
  },
  emptySubText: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center', // Center text horizontally
  },
});

export default SearchScreen;