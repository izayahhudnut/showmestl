import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ScrollView, 
  FlatList, 
  Dimensions, 
  Modal
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const VIEWPORT_WIDTH = width;
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = 220;
const SPACING = 10;
const INACTIVE_ITEM_SCALE = 0.8;
const INACTIVE_ITEM_OPACITY = 0.6;

// Categories for places
const PLACE_CATEGORIES = [
  { id: 'dinner', label: 'Dinner' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'activity', label: 'Activity' },
  { id: 'entertainment', label: 'Entertainment' },
];

// Component for the scrollable venue selection - Apple Music style carousel
const VenueCarousel = ({ places, onSelect, currentIndex, setCurrentIndex }) => {
  const flatListRef = useRef(null);

  // Ensure the initial position is centered on the current index
  useEffect(() => {
    if (flatListRef.current && places.length > 0 && currentIndex < places.length) {
      try {
        // Use scrollToIndex which is more reliable
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: false,
          viewPosition: 0.5
        });
      } catch (error) {
        // Fallback if scrollToIndex fails
        const centerPosition = (currentIndex * (ITEM_WIDTH + SPACING * 2));
        flatListRef.current.scrollToOffset({
          offset: centerPosition,
          animated: false,
        });
      }
    }
  }, [places]);

  const renderItem = ({ item, index }) => {
    // Simplified renderItem without animations

    return (
      <View
        style={[
          styles.venueItemWrapper,
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => {
            // Scroll to this item when tapped
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index,
                animated: true,
              });
            }
            onSelect(item);
          }}
          style={styles.venueItemContainer}
        >
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/300' }}
            defaultSource={require('../../assets/placeholder.png')}
            style={styles.venueImage}
            resizeMode="cover"
          />
          <View style={styles.venueDetails}>
            <Text style={styles.venueName}>{item.name}</Text>
            <Text style={styles.venueType}>{item.type || item.category}</Text>
            <Text style={styles.venueAddress}>{item.address || 'St. Louis, MO'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const getItemLayout = (_, index) => ({
    length: ITEM_WIDTH + SPACING * 2,
    offset: (ITEM_WIDTH + SPACING * 2) * index - ((VIEWPORT_WIDTH - ITEM_WIDTH) / 2) + SPACING,
    index,
  });
  
  // Removed Animated.event for handleScroll
  
  const handleMomentumScrollEnd = (event) => {
    // Calculate which item is centered based on scroll position
    const contentOffset = event.nativeEvent.contentOffset.x;
    const centerOffset = (VIEWPORT_WIDTH - ITEM_WIDTH) / 2 - SPACING;
    const index = Math.round((contentOffset + centerOffset) / (ITEM_WIDTH + SPACING * 2));
    
    // Ensure index is within bounds
    const validIndex = Math.max(0, Math.min(index, places.length - 1));
    
    if (validIndex !== currentIndex) {
      setCurrentIndex(validIndex);
      onSelect(places[validIndex]);
    }
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={places}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContentContainer}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToInterval={ITEM_WIDTH + SPACING * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        renderItem={renderItem}
      />
    </View>
  );
};

// Component for a category selection dropdown
const CategorySelector = ({ selectedCategory, categories, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categorySelector}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.categoryText}>{selectedCategory.label}</Text>
        <Ionicons name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.categoryDropdown}>
            <Text style={styles.dropdownTitle}>Select Category</Text>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  selectedCategory.id === category.id && styles.selectedOption,
                ]}
                onPress={() => {
                  onSelect(category);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    selectedCategory.id === category.id && styles.selectedOptionText,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Component for a step (a category and its venue selection)
const StepSection = ({ 
  step, 
  onLock, 
  onChangeCategory, 
  onSelectVenue,
  setCurrentIndex
}) => {
  return (
    <View style={styles.stepSection}>
      <View style={styles.stepHeader}>
        <CategorySelector
          selectedCategory={step.category}
          categories={PLACE_CATEGORIES}
          onSelect={(category) => onChangeCategory(step.id, category)}
        />
        <TouchableOpacity 
          style={styles.lockButton} 
          onPress={() => onLock(step.id)}
        >
          <Ionicons 
            name={step.locked ? "lock-closed" : "lock-open"} 
            size={22} 
            color="#000" 
          />
        </TouchableOpacity>
      </View>
      
      <VenueCarousel
        places={step.places}
        onSelect={(venue) => onSelectVenue(step.id, venue)}
        currentIndex={step.currentIndex}
        setCurrentIndex={(index) => setCurrentIndex(step.id, index)}
      />
    </View>
  );
};

// Event Item Component
const EventItem = ({ place, index, time }) => {
  // Calculate estimated time based on index - using 12hr format
  const estimatedTime = time ? 
    new Date(`2000-01-01T${time}`).getHours() + index : 
    19 + index; // Default starting at 7pm
  
  // Format time in 12-hour format with AM/PM
  const formattedHour = estimatedTime > 12 ? estimatedTime - 12 : estimatedTime === 0 ? 12 : estimatedTime;
  const amPm = estimatedTime >= 12 ? 'PM' : 'AM';
  const formattedTime = `${formattedHour}:00 ${amPm}`;
  
  const handleOpenMaps = (address) => {
    // In a real app, this would use Linking.openURL
    alert(`Opening maps for: ${address}`);
  };
  
  return (
    <View style={styles.eventItem}>
      <View style={styles.eventTimeColumn}>
        <Text style={styles.eventTime}>{formattedTime}</Text>
        {index < 10 && (
          <View style={styles.timeConnector} />
        )}
      </View>
      
      <View style={styles.eventContentColumn}>
        <View style={styles.eventCard}>
          <Image 
            source={{ uri: place.image || 'https://via.placeholder.com/300' }} 
            style={styles.eventImage}
            resizeMode="cover"
          />
          
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{place.name}</Text>
            <Text style={styles.eventCategory}>{place.category}</Text>
            
            <View style={styles.addressRow}>
              <Text style={styles.eventAddress} numberOfLines={1}>
                {place.address}
              </Text>
              <TouchableOpacity 
                style={styles.navigateButton}
                onPress={() => handleOpenMaps(place.address)}
              >
                <Ionicons name="navigate" size={20} color="#3498db" />
              </TouchableOpacity>
            </View>
            
            {place.rating && (
              <Text style={styles.eventRating}>★ {place.rating}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// Main screen component
const CurateResultsScreen = ({ navigation, route }) => {
  const experience = route.params?.experience || {};
  const [selectedDate, setSelectedDate] = useState(
    experience.date ? 
    new Date(experience.date) : 
    new Date()
  );
  
  const [selectedTime, setSelectedTime] = useState(
    experience.time || "19:00"
  );
  
  // Handle navigation to maps
  const handleOpenMaps = (address) => {
    // In a real app, this would use Linking.openURL with maps
    alert(`Opening maps to navigate to: ${address}`);
  };
  
  // Handle share
  const handleShare = () => {
    // In a real app, this would use Share API
    alert('Sharing experience...');
  };
  
  // Handle add to calendar
  const handleAddToCalendar = () => {
    // In a real app, this would use Calendar API
    alert('Adding to calendar...');
  };
  
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
        <Text style={styles.headerTitle}>Experience Details</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Experience Title */}
        <Text style={styles.experienceTitle}>{experience.title || "Untitled Experience"}</Text>
        
        {/* Date and Time - Minimal Style */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>
            <Ionicons name="calendar-outline" size={16} color="#999" /> {experience.date || "Today"}
          </Text>
          <Text style={styles.timeText}>
            <Ionicons name="time-outline" size={16} color="#999" /> {experience.time ? 
              new Date(`2000-01-01T${experience.time}`).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'}) : 
              "7:00 PM"}
          </Text>
        </View>
        
        {/* Minimal Action Links */}
        <View style={styles.actionLinksContainer}>
          <TouchableOpacity 
            style={styles.actionLink}
            onPress={handleAddToCalendar}
          >
            <Ionicons name="calendar-outline" size={20} color="#3498db" />
            <Text style={styles.actionLinkText}>Add to Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionLink}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={20} color="#3498db" />
            <Text style={styles.actionLinkText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />
        
        {/* Places List (no timeline) */}
        <View style={styles.itineraryContainer}>
          <Text style={styles.sectionTitle}>Places</Text>
          
          <View style={styles.placesContainer}>
            {experience.placeDetails && experience.placeDetails.map((place, index) => (
              <View key={index} style={styles.placeCard}>
                <Image 
                  source={{ uri: place.image || 'https://via.placeholder.com/300' }} 
                  style={styles.placeImage}
                  resizeMode="cover"
                />
                
                <View style={styles.placeContent}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeCategory}>{place.category}</Text>
                  
                  <View style={styles.addressRow}>
                    <Text style={styles.placeAddress} numberOfLines={1}>
                      {place.address}
                    </Text>
                    <TouchableOpacity 
                      style={styles.navigateButton}
                      onPress={() => handleOpenMaps(place.address)}
                    >
                      <Ionicons name="navigate" size={20} color="#3498db" />
                    </TouchableOpacity>
                  </View>
                  
                  {place.rating && (
                    <Text style={styles.placeRating}>★ {place.rating}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
        
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  actionButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  
  // Experience title and date/time
  experienceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    opacity: 0.8,
  },
  dateText: {
    fontSize: 15,
    color: '#DDDDDD',
    marginRight: 20,
  },
  timeText: {
    fontSize: 15,
    color: '#DDDDDD',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 25,
  },
  
  // Places section
  itineraryContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  placesContainer: {
    paddingHorizontal: 5,
    paddingVertical: 15, // Added more vertical padding
  },
  
  // Place Cards
  placeCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24, // Increased spacing between cards
    flexDirection: 'row',
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  placeImage: {
    width: 120,
    height: 120,
  },
  placeContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  placeAddress: {
    fontSize: 14,
    color: '#888888',
    flex: 1,
    marginRight: 8,
  },
  placeRating: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventAddress: {
    fontSize: 14,
    color: '#888888',
    flex: 1,
    marginRight: 8,
  },
  navigateButton: {
    padding: 6,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: 12,
  },
  eventRating: {
    fontSize: 14,
    color: '#FFD700',
  },
  
  // Minimal action links
  actionLinksContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 5,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionLinkText: {
    color: '#3498db',
    fontSize: 15,
    marginLeft: 6,
  },
  
  // Other
  bottomSpacer: {
    height: 100,
  },
});

export default CurateResultsScreen;