import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList, 
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { places } from '../data/dummyData';
import MapView, { Marker } from 'react-native-maps';

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

// Component for one step in the experience curation
const StepCard = ({ 
  step, 
  stepIndex, 
  category, 
  currentPlaceIndex,
  places,
  onRegeneratePress, 
  onLockPress,
  isLocked,
  onSearchPlacePress,
  onReorderPress
}) => {
  // Filter places by category
  const filteredPlaces = places.filter(place => place.category === category) || [];
  const flatListRef = useRef(null);
  
  // Get the current place
  const currentPlace = filteredPlaces.length > 0 ? filteredPlaces[currentPlaceIndex % filteredPlaces.length] : null;
  
  // Scroll to current place when index changes
  useEffect(() => {
    if (filteredPlaces.length === 0) return;
    
    const safeIndex = currentPlaceIndex % filteredPlaces.length;
    
    if (flatListRef.current && filteredPlaces.length > 0) {
      try {
        flatListRef.current.scrollToIndex({
          index: safeIndex,
          animated: true,
          viewPosition: 0.5 // Center the item
        });
      } catch (error) {
        console.log("Error scrolling to index:", error);
      }
    }
  }, [currentPlaceIndex, filteredPlaces.length]);
  
  // Render a place card with a simple design
  const renderPlaceItem = ({ item, index }) => {
    if (!item) {
      return (
        <View style={styles.emptyPlacesContainer}>
          <Text style={styles.emptyPlacesText}>No place data available</Text>
        </View>
      );
    }
    
    // Function to truncate description text and add "Read More"
    const truncateDescription = (text, maxLength = 80) => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      
      // Find the last space before maxLength to avoid cutting words
      const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
      const truncateAt = lastSpace > 0 ? lastSpace : maxLength;
      
      return text.substring(0, truncateAt).trim() + "...";
    };
    
    const isSelected = index === currentPlaceIndex % filteredPlaces.length;
    
    return (
      <TouchableOpacity
        style={[
          styles.carouselItemContainer,
          isSelected ? styles.carouselItemSelected : null
        ]}
        onPress={() => {
          // Set this as the current place
          onRegeneratePress(index);
        }}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/300' }} 
          style={styles.carouselItemImage}
          resizeMode="cover"
          defaultSource={require('../../assets/placeholder.png')}
        />
        
        <View style={styles.carouselItemDetails}>
          <Text style={styles.carouselItemName} numberOfLines={1}>{item.name || "Unnamed Place"}</Text>
          <Text style={styles.carouselItemCategory}>{item.category || ""}</Text>
          
          {item.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.carouselItemDescription} numberOfLines={2}>
                {truncateDescription(item.description, 80)}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  // Show details popup
                  Alert.alert(
                    item.name,
                    `${item.address || ''}

Category: ${item.category || ''}
${item.description || ''}
${item.rating ? `Rating: ${item.rating}` : ''}`,
                    [
                      {
                        text: 'Select This Place',
                        onPress: () => {
                          // Lock this place
                          onRegeneratePress(index);
                          handleToggleLock(stepIndex);
                        },
                        style: 'default',
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          ) : (
            item.address ? (
              <Text style={styles.carouselItemAddress} numberOfLines={2}>
                {item.address}
              </Text>
            ) : null
          )}
          
          <View style={styles.carouselItemFooter}>
            {item.rating ? (
              <Text style={styles.carouselItemRating}>★ {item.rating}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.stepCard}>
      {/* Apple Music style card with drag handle on left and action buttons on right */}
      <View style={styles.stepHeaderRow}>
        <TouchableOpacity style={styles.dragHandle} onPress={onReorderPress}>
          <View style={styles.dragHandleLines}>
            <View style={styles.dragHandleLine} />
            <View style={styles.dragHandleLine} />
            <View style={styles.dragHandleLine} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {!isLocked && (
            <>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => onLockPress(stepIndex)}
              >
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onSearchPlacePress(stepIndex)}
              >
                <Ionicons name="search" size={20} color="#3498db" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
              >
                <Ionicons name="sparkles" size={20} color="#3498db" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      {isLocked && currentPlace ? (
        // Locked view - Apple Music style
        <View style={styles.lockedPlaceRow}>
          <Image 
            source={{ uri: currentPlace.image || 'https://via.placeholder.com/300' }} 
            style={styles.lockedPlaceImage}
            resizeMode="cover"
          />
          
          <View style={styles.lockedPlaceDetails}>
            <Text style={styles.lockedPlaceName}>{currentPlace.name}</Text>
            
            {currentPlace.address && (
              <View style={styles.addressRow}>
                <Text style={styles.lockedPlaceAddress} numberOfLines={1}>
                  {currentPlace.address}
                </Text>
                <TouchableOpacity style={styles.mapIcon}>
                  <Ionicons name="navigate" size={18} color="#3498db" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.lockedPlaceFooter}>
              <Text style={styles.lockedPlaceCategory}>{currentPlace.category}</Text>
              {currentPlace.rating && (
                <Text style={styles.lockedPlaceRating}>★ {currentPlace.rating}</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.unlockButton}
            onPress={() => onLockPress(stepIndex)}
          >
            <Ionicons name="close-circle" size={24} color="#777" />
          </TouchableOpacity>
        </View>
      ) : filteredPlaces.length > 0 ? (
        // Simple horizontal scrollable list
        <View style={styles.placesListView}>
          <FlatList
            ref={flatListRef}
            data={filteredPlaces}
            keyExtractor={(item, index) => (item?.id?.toString() || `place-${index}`)}
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.placesListContent}
            renderItem={renderPlaceItem}
            initialScrollIndex={currentPlaceIndex % filteredPlaces.length}
            getItemLayout={(data, index) => ({
              length: 240 + 20, // Card width + margin
              offset: (240 + 20) * index,
              index,
            })}
          />
        </View>
      ) : (
        <View style={styles.emptyPlacesContainer}>
          <Ionicons name="images-outline" size={40} color="#555" />
          <Text style={styles.emptyPlacesText}>No places available</Text>
          <TouchableOpacity 
            style={styles.searchForPlacesButton}
            onPress={() => onSearchPlacePress(stepIndex)}
          >
            <Text style={styles.searchForPlacesText}>Search for places</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// We removed the CategoryModal since we're now using step names instead of category selection

const ComposeScreen = ({ navigation, route }) => {
  const { initialPlace, initialPrompt, mode } = route.params || {};
  
  // State for the experience
  const [experienceName, setExperienceName] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // State for tracking selected step for search
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  
  // Default St. Louis coordinates
  const [mapRegion, setMapRegion] = useState({
    latitude: 38.6270,
    longitude: -90.1994,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // Reference to enable keyboard dismissal
  const scrollViewRef = useRef(null);
  
  // Setup keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  // Available categories from the data
  const categories = [...new Set(places.map(place => place.category))];
  
  // Initialize the experience based on the mode
  useEffect(() => {
    if (mode === 'place-first' && initialPlace) {
      // Start with the selected place as the first step
      setSteps([
        {
          category: initialPlace.category, 
          currentPlaceIndex: places.findIndex(p => p.id === initialPlace.id) || 0,
          isLocked: true
        }
      ]);
      
      // Add two more recommended steps based on common pairings
      setSteps(prev => [
        ...prev,
        { category: getRecommendedCategory(initialPlace.category, 0), currentPlaceIndex: 0, isLocked: false },
        { category: getRecommendedCategory(initialPlace.category, 1), currentPlaceIndex: 0, isLocked: false }
      ]);
      
      // Suggest a name based on the place
      setExperienceName('');
    } 
    else if (mode === 'prompt-first' && initialPrompt) {
      // This would connect to an API that processes the prompt
      // For now we'll just set up a mock response
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Generate experience based on prompt
        let suggestedSteps = [];
        
        // Simple parsing of the prompt for demo purposes
        if (initialPrompt.toLowerCase().includes('food') || initialPrompt.toLowerCase().includes('dining')) {
          suggestedSteps = [
            { category: 'Food & Drink', currentPlaceIndex: 0, isLocked: false },
            { category: 'Food & Drink', currentPlaceIndex: 1, isLocked: false }
          ];
        } 
        else if (initialPrompt.toLowerCase().includes('museum') || initialPrompt.toLowerCase().includes('art')) {
          suggestedSteps = [
            { category: 'Museums', currentPlaceIndex: 0, isLocked: false },
            { category: 'Food & Drink', currentPlaceIndex: 0, isLocked: false }
          ];
        }
        else if (initialPrompt.toLowerCase().includes('nature') || initialPrompt.toLowerCase().includes('park')) {
          suggestedSteps = [
            { category: 'Parks & Nature', currentPlaceIndex: 0, isLocked: false },
            { category: 'Food & Drink', currentPlaceIndex: 0, isLocked: false }
          ];
        }
        else {
          // Default experience
          suggestedSteps = [
            { category: 'Museums', currentPlaceIndex: 0, isLocked: false },
            { category: 'Food & Drink', currentPlaceIndex: 0, isLocked: false },
            { category: 'Parks & Nature', currentPlaceIndex: 0, isLocked: false }
          ];
        }
        
        // Don't set a default name
        setExperienceName('');
        setSteps(suggestedSteps);
        setLoading(false);
      }, 1500);
    }
    else {
      // Default starting steps for "start from scratch"
      setSteps([
        { category: 'Food & Drink', currentPlaceIndex: 0, isLocked: false },
        { category: 'Museums', currentPlaceIndex: 0, isLocked: false }
      ]);
      
      // Don't set a default name
      setExperienceName('');
    }
  }, [initialPlace, initialPrompt, mode]);
  
  // Function to get a recommended category based on the initial category
  const getRecommendedCategory = (initialCategory, position) => {
    // Simple logic to pair activities
    const pairings = {
      'Food & Drink': ['Museums', 'Parks & Nature'],
      'Museums': ['Food & Drink', 'Museums'],
      'Parks & Nature': ['Food & Drink', 'Museums']
    };
    
    return pairings[initialCategory]?.[position] || categories[0];
  };
  
  // Step name function removed

  // Handle search for a place
  const handleSearchPlace = (stepIndex) => {
    setSelectedStepIndex(stepIndex);
    // Navigate to the place search screen
    navigation.navigate('PlaceSearch', { 
      onPlaceSelect: (place) => {
        // Run the place selection logic on the next event cycle to ensure 
        // it completes after navigation back is finished
        setTimeout(() => {
          const updatedSteps = [...steps];
          const placeIndex = places.findIndex(p => p.id === place.id);
          
          if (placeIndex !== -1) {
            updatedSteps[stepIndex] = {
              ...updatedSteps[stepIndex],
              category: place.category,
              currentPlaceIndex: placeIndex,
              isLocked: true
            };
            setSteps(updatedSteps);
          }
        }, 0);
      }
    });
  };
  
  // Handle regenerating a step (showing a different place)
  const handleRegenerateStep = (stepIndex, newIndex) => {
    const updatedSteps = [...steps];
    
    // If a specific newIndex is provided (from carousel), use it
    // Otherwise increment the current index (from refresh button)
    if (newIndex !== undefined) {
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        currentPlaceIndex: newIndex
      };
    } else {
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        currentPlaceIndex: updatedSteps[stepIndex].currentPlaceIndex + 1
      };
    }
    
    setSteps(updatedSteps);
  };
  
  // Handle moving a step up in the order
  const handleMoveStepUp = (stepIndex) => {
    if (stepIndex <= 0) return;
    
    const updatedSteps = [...steps];
    const temp = updatedSteps[stepIndex];
    updatedSteps[stepIndex] = updatedSteps[stepIndex - 1];
    updatedSteps[stepIndex - 1] = temp;
    
    setSteps(updatedSteps);
  };
  
  // Handle moving a step down in the order
  const handleMoveStepDown = (stepIndex) => {
    if (stepIndex >= steps.length - 1) return;
    
    const updatedSteps = [...steps];
    const temp = updatedSteps[stepIndex];
    updatedSteps[stepIndex] = updatedSteps[stepIndex + 1];
    updatedSteps[stepIndex + 1] = temp;
    
    setSteps(updatedSteps);
  };
  
  // Show options for reordering and deleting when the drag handle is pressed
  const handleReorderPress = (stepIndex) => {
    Alert.alert(
      'Manage Step',
      'Choose an action',
      [
        {
          text: 'Move Up',
          onPress: () => handleMoveStepUp(stepIndex),
          style: 'default',
        },
        {
          text: 'Move Down',
          onPress: () => handleMoveStepDown(stepIndex),
          style: 'default',
        },
        {
          text: 'Delete Step',
          onPress: () => handleDeleteStep(stepIndex),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  // Delete a step
  const handleDeleteStep = (stepIndex) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(stepIndex, 1);
    setSteps(updatedSteps);
  };
  
  // Toggle lock status for a step
  const handleToggleLock = (stepIndex) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      isLocked: !updatedSteps[stepIndex].isLocked
    };
    setSteps(updatedSteps);
  };
  
  // Add a new step
  const handleAddStep = () => {
    // Find a category that's not already used, or default to first
    const usedCategories = steps.map(step => step.category);
    const availableCategory = categories.find(c => !usedCategories.includes(c)) || categories[0];
    
    setSteps([...steps, { 
      category: availableCategory, 
      currentPlaceIndex: 0,
      isLocked: false
    }]);
  };
  
  // Save the complete experience
  const handleSaveExperience = () => {
    const finalPlaces = steps.map(step => {
      const filteredPlaces = places.filter(place => place.category === step.category);
      return filteredPlaces[step.currentPlaceIndex % filteredPlaces.length];
    }).filter(Boolean); // Remove any undefined places
    
    // Format the date for display
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = selectedDate.toLocaleDateString('en-US', dateOptions);
    
    const newExperience = {
      id: Date.now().toString(),
      title: experienceName || 'Untitled Experience',
      date: formattedDate,
      time: selectedTime,
      places: finalPlaces.map(p => p.name),
      placeDetails: finalPlaces,
      createdAt: new Date().toISOString()
    };
    
    // Navigate to the results screen
    navigation.navigate('CurateResults', { experience: newExperience });
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Function to dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  // Handle tapping anywhere outside inputs to dismiss keyboard
  const handleScreenTouch = () => {
    Keyboard.dismiss();
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: '#121212'}} // Added background color to match app background
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Increased offset to better position the keyboard
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Experience</Text>
          <TouchableOpacity 
            onPress={handleSaveExperience}
            disabled={steps.length === 0}
            style={styles.saveButton}
          >
            <Text style={[
              styles.saveButtonText, 
              steps.length === 0 ? styles.saveButtonDisabled : {}
            ]}>Save</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Creating your experience...</Text>
            <ActivityIndicator size="large" color="#3498db" />
          </View>
        ) : (
          <ScrollView 
            ref={scrollViewRef}
            style={styles.content}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}
            onScrollBeginDrag={dismissKeyboard}
            scrollEventThrottle={16}
          >
            
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={styles.touchableWrapper}>
                <View style={styles.titleSection}>
                  <TextInput
                    style={styles.experienceTitleInput}
                    placeholder="Untitled event"
                    placeholderTextColor="#999999"
                    value={experienceName}
                    onChangeText={setExperienceName}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={dismissKeyboard}
                    enablesReturnKeyAutomatically={true}
                    multiline={false}
                    textAlign="center"
                    keyboardType="default"
                    keyboardAppearance="dark"
                  />
                </View>
                
                {/* Map with all locations - directly below title */}
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={mapRegion}
                    customMapStyle={darkMapStyle}
                  >
                    {steps.map((step, idx) => {
                      const filteredPlaces = places.filter(place => place.category === step.category);
                      const place = filteredPlaces[step.currentPlaceIndex % filteredPlaces.length];
                      
                      if (place) {
                        return (
                          <Marker
                            key={idx}
                            coordinate={{
                              latitude: 38.6270 + (idx * 0.002), // Using dummy coordinates since we don't have real ones
                              longitude: -90.1994 + (idx * 0.002), 
                            }}
                            title={step.stepName || `Step ${idx + 1}`}
                            description={place.name}
                            pinColor={idx === 0 ? "#3498db" : idx === 1 ? "#e74c3c" : "#2ecc71"}
                          />
                        );
                      }
                      return null;
                    })}
                  </MapView>
                </View>
                
                {/* Experience Description */}
                <View style={styles.experienceDescriptionContainer}>
                  <Text style={styles.experienceDescriptionText}>
                    This curated experience in St. Louis features {steps.length} unique locations for you to explore. 
                    You can customize this experience by adding, removing, or reordering steps to create your perfect itinerary.
                  </Text>
                </View>
                
                {/* Places selection comes later */}
                <View style={styles.placesListContainer}>
                  {steps.map((step, index) => (
                    <StepCard
                      key={index}
                      step={step}
                      stepIndex={index}
                      category={step.category}
                      currentPlaceIndex={step.currentPlaceIndex}
                      places={places}
                      isLocked={step.isLocked}
                      onRegeneratePress={() => handleRegenerateStep(index)}
                      onLockPress={() => handleToggleLock(index)}
                      onSearchPlacePress={() => handleSearchPlace(index)}
                      onReorderPress={() => handleReorderPress(index)}
                    />
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addStepButton}
                    onPress={handleAddStep}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.addStepText}>Add another step</Text>
                  </TouchableOpacity>
                </View>
                
         {/* Advanced Toggle Section */}
         <View style={styles.advancedSection}>
                  <TouchableOpacity 
                    style={styles.advancedToggleButton}
                    onPress={() => setShowAdvanced(!showAdvanced)}
                  >
                    <Text style={styles.advancedToggleText}>Set a Date</Text>
                    <Ionicons 
                      name={showAdvanced ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="#3498db" 
                    />
                  </TouchableOpacity>
                  
                  {showAdvanced && (
                    <View style={styles.dateTimeContainer}>
                      <Text style={styles.dateTimeTitle}>When would you like to go?</Text>
                      <View style={styles.dateTimeSelectors}>
                        <TouchableOpacity style={styles.dateSelector}>
                          <Ionicons name="calendar" size={20} color="#3498db" style={styles.dateTimeIcon} />
                          <Text style={styles.dateTimeText}>
                            {selectedDate.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                          </Text>
                          <Ionicons name="chevron-down" size={16} color="#777" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.timeSelector}>
                          <Ionicons name="time" size={20} color="#3498db" style={styles.dateTimeIcon} />
                          <Text style={styles.dateTimeText}>
                            {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})}
                          </Text>
                          <Ionicons name="chevron-down" size={16} color="#777" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                
                <View style={styles.bottomSpacer} />
              </View>
            </TouchableWithoutFeedback>
        </ScrollView>
      )}
      
      
      
    </SafeAreaView>
    </KeyboardAvoidingView>
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
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  saveButtonDisabled: {
    color: '#555555',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
  },
  touchableWrapper: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: -5,
    marginBottom: 10,
  },
  nameInput: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 15,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
  },
  descriptionInput: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  // Step Card Styles - Apple Music style
  stepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dragHandle: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandleLines: {
    height: 14,
    width: 18,
    justifyContent: 'space-between',
  },
  dragHandleLine: {
    height: 2,
    width: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#3498db',
    borderRadius: 12,
    marginRight: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  
  // Simple list styles
  placesListView: {
    height: 260, // Fixed height for the list container
    width: '100%',
    marginVertical: 10,
  },
  placesListContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  carouselItemContainer: {
    width: 240, // Fixed width
    height: 240, // Same height for square
    marginHorizontal: 10, // Space between items
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Match parent container background
    flexDirection: 'column',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  carouselItemSelected: {
    borderColor: '#3498db', // Highlight selected item
    borderWidth: 2,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  carouselItemImage: {
    width: '100%',
    height: 130, // Smaller image
  },
  carouselItemDetails: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-start', // Start from top
    alignItems: 'flex-start', // Left aligned text
    position: 'relative',
  },
  carouselItemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Right align rating
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  carouselItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
    width: '100%', // Full width
  },
  carouselItemCategory: {
    fontSize: 13,
    color: '#3498db',
    fontWeight: '500',
    marginBottom: 4,
    width: '100%', // Full width
  },
  carouselItemAddress: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 3,
    width: '100%', // Full width
  },
  carouselItemDescription: {
    fontSize: 12,
    color: '#DDDDDD',
    lineHeight: 16,
    marginBottom: 3,
    width: '100%', // Full width
  },
  carouselItemRating: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  descriptionContainer: {
    width: '100%',
    marginVertical: 4,
  },
  readMoreText: {
    color: '#3498db',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  selectPlaceButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty state
  emptyPlacesContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  emptyPlacesText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginVertical: 12,
  },
  searchForPlacesButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  searchForPlacesText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Old styles for backwards compatibility
  placePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeInfo: {
    marginLeft: 15,
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  placeRating: {
    fontSize: 14,
    color: '#f1c40f',
  },
  placeholderContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  
  // Add Step Button
  addStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addStepText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  
  // Category Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  categoryModal: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2,
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  
  // Title input
  titleSection: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  experienceTitleInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'transparent', // Removed the semi-transparent background
    paddingVertical: 15, 
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderBottomWidth: 1, // Changed to only bottom border
    borderBottomColor: 'rgba(255, 255, 255, 0.15)', // Subtle bottom border
    height: 75, // Fixed height to prevent spacing issues
    minHeight: 75,
  },
  
  // Map styles
  mapContainer: {
    height: 220,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
  // Experience description styles
  experienceDescriptionContainer: {
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 25,
    marginHorizontal: 5,
  },
  experienceDescriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  experienceDescriptionText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  
  // Date and time selection styles
  dateTimeContainer: {
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  dateTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  advancedSection: {
    marginBottom: 25,
    marginHorizontal: 5,
  },
  advancedToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 5,
  },
  advancedToggleText: {
    color: '#3498db',
    fontSize: 15,
    marginRight: 8,
    fontWeight: '500',
  },
  dateTimeSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateSelector: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  timeSelector: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dateTimeIcon: {
    marginRight: 8,
  },
  dateTimeText: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
  },
  
  // Places List with Blurry Blue Gradient
  placesListContainer: {    marginBottom: 25,
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  placeListItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  placeListImage: {
    width: 80,
    height: 80,
  },
  placeListDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  placeListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  placeListCategory: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 4,
  },
  placeListAddress: {
    fontSize: 13,
    color: '#AAAAAA',
  },
  
  // Section title (where you'll go)
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Step name input
  stepNameInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    padding: 8,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    marginRight: 110, // Increased this to avoid overlap with action buttons
    marginLeft: 10, // Increased from 4 since we removed the step number
  },
  
  // Locked place view - Apple Music style
  lockedPlaceRow: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    padding: 12,
    alignItems: 'center',
  },
  lockedPlaceImage: {
    width: 76,
    height: 76,
    borderRadius: 6,
  },
  lockedPlaceDetails: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  lockedPlaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lockedPlaceAddress: {
    fontSize: 13,
    color: '#BBBBBB',
    flex: 1,
    marginRight: 5,
  },
  mapIcon: {
    padding: 3,
  },
  lockedPlaceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lockedPlaceCategory: {
    fontSize: 13,
    color: '#3498db',
    fontWeight: '500',
  },
  lockedPlaceRating: {
    fontSize: 13,
    color: '#FFD700',
  },
  unlockButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Fixed button at bottom
  bottomButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 70, // Higher than tab bar
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.85)', // Semi-transparent dark background
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#3498db', // Strong blue color
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)', // Faded version of the blue
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  
  // Share section styles
  shareContainer: {
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
    marginHorizontal: 5,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.48,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 120, // Increased for fixed button
  },
  
  // Keyboard Done Button
  keyboardDoneButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
  },
  keyboardDoneText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ComposeScreen;