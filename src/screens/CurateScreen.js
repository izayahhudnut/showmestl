import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Modal, TextInput, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CurateModal from '../components/CurateModal';
import { places } from '../data/dummyData';

const ExperienceCard = ({ experience, onPress }) => (
  <TouchableOpacity style={styles.experienceCard} onPress={onPress}>
    <View style={styles.experienceHeader}>
      <Text style={styles.experienceTitle}>{experience.title}</Text>
      <Text style={styles.experienceDate}>{experience.date}</Text>
    </View>
    
    <View style={styles.placesList}>
      {experience.places.map((place, index) => (
        <View key={index} style={styles.placeChip}>
          <Text style={styles.placeChipText}>{place}</Text>
        </View>
      ))}
    </View>
    
    {experience.description ? (
      <Text style={styles.experienceDescription} numberOfLines={2}>
        {experience.description}
      </Text>
    ) : null}
  </TouchableOpacity>
);

const CurateScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
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
  
  // Create pre-defined experiences for staff picks
  const foodExperience = {
    id: 'food-tour',
    title: 'Foodie Tour',
    date: 'Staff Pick',
    places: ['Louie', 'Brasserie by Niche', '801 Chophouse'],
    description: 'Explore the best culinary experiences in St. Louis',
    placeDetails: places.filter(place => 
      ['Louie', 'Brasserie by Niche', '801 Chophouse'].includes(place.name)
    )
  };
  
  const museumExperience = {
    id: 'museum-tour',
    title: 'Art & Culture',
    date: 'Staff Pick',
    places: ['Saint Louis Art Museum', 'The City Museum', 'Science Center'],
    description: 'Discover the artistic and cultural gems of St. Louis',
    placeDetails: places.filter(place => 
      ['Saint Louis Art Museum', 'The City Museum', 'Science Center'].includes(place.name)
    )
  };
  
  // Mock data for experiences
  const [savedExperiences, setSavedExperiences] = useState([
    {
      id: '1',
      title: 'Food & Wine Tour',
      date: 'Created Mar 5, 2025',
      places: ['Brasserie by Niche', 'Louie', '801 Chophouse'],
      description: 'A perfect evening of fine dining and wine tasting in St. Louis.'
    },
    {
      id: '2',
      title: 'Cultural Day',
      date: 'Created Feb 20, 2025',
      places: ['Saint Louis Art Museum', 'City Museum', 'Science Center'],
      description: 'Explore the best museums and cultural attractions in St. Louis.'
    }
  ]);

  const handleStartFromScratch = () => {
    setStartModalVisible(false);
    setPromptModalVisible(true);
  };

  const handleHavePlaceInMind = () => {
    setStartModalVisible(false);
    navigation.navigate('PlaceSearch', { 
      onPlaceSelect: (place) => {
        navigation.navigate('Compose', { 
          initialPlace: place,
          mode: 'place-first'
        });
      }
    });
  };

  const handleSubmitPrompt = () => {
    Keyboard.dismiss();
    setPromptModalVisible(false);
    navigation.navigate('Compose', { 
      initialPrompt: userPrompt,
      mode: 'prompt-first'
    });
  };
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleViewExperience = (experience) => {
    // Navigate to view the experience
    navigation.navigate('CurateResults', { 
      experience: experience
    });
  };

  // Filter experiences based on search query
  const filteredExperiences = useCallback(() => {
    if (!searchQuery.trim()) return savedExperiences;
    
    return savedExperiences.filter(exp => 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.places.some(place => place.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [savedExperiences, searchQuery]);

  const showEmptyState = savedExperiences.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Experiences</Text>
          <TouchableOpacity 
            style={styles.newButton}
            onPress={() => setStartModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="#3498db" />
            <Text style={styles.newButtonText}>New</Text>
          </TouchableOpacity>
        </View>
        
        {showEmptyState ? (
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F1751ec73ad3cb3313915e24c4382ee11ea4dc0d6c8d3062b362d81d5150fccbf_delete-lVjFs7YNXsxy3rypP7B6wzs3dhnJpS.jpg&w=3840&q=75' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>Design your perfect experience</Text>
            <Text style={styles.emptyText}>
              Create curated experiences by selecting places to visit in St. Louis.
              Share your favorite spots with friends or plan your next adventure.
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setStartModalVisible(true)}
            >
              <Text style={styles.createButtonText}>Create Experience</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Search Experiences Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#aaaaaa" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search your experiences"
                  placeholderTextColor="#aaaaaa"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#aaaaaa" />
                  </TouchableOpacity>
                )}
              </View>
              
              {filteredExperiences().map(experience => (
                <ExperienceCard 
                  key={experience.id}
                  experience={experience}
                  onPress={() => handleViewExperience(experience)}
                />
              ))}
              
              {searchQuery.length > 0 && filteredExperiences().length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search" size={50} color="#555555" />
                  <Text style={styles.noResultsText}>No experiences found</Text>
                </View>
              )}
            </View>
            
            {/* Recommended Experiences */}
            <View style={styles.sectionContainer}>
              <View style={styles.experienceHeader}>
                <View>
                  <Text style={styles.experienceHeaderSubtitle}>Staff picks</Text>
                  <Text style={styles.sectionTitle}>STL Favorites</Text>
                </View>
              </View>
              
              <View style={styles.experiencesGrid}>
                <TouchableOpacity 
                  style={styles.recommendedCard}
                  onPress={() => handleViewExperience(foodExperience)}
                >
                  <Image 
                    source={{ uri: places.find(p => p.name === 'Brasserie by Niche')?.image || 'https://via.placeholder.com/300' }} 
                    style={styles.recommendedImage} 
                  />
                  <Text style={styles.recommendedTitle}>Foodie Tour</Text>
                  <Text style={styles.recommendedSubtitle}>Local restaurants and bars</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.recommendedCard}
                  onPress={() => handleViewExperience(museumExperience)}
                >
                  <Image 
                    source={{ uri: places.find(p => p.name === 'The City Museum')?.image || 'https://via.placeholder.com/300' }} 
                    style={styles.recommendedImage} 
                  />
                  <Text style={styles.recommendedTitle}>Art & Culture</Text>
                  <Text style={styles.recommendedSubtitle}>Museums and galleries</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Spacer for bottom tabs */}
            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>
      
      {/* Start Modal: Choose between Start from Scratch or Have Place in Mind */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={startModalVisible}
        onRequestClose={() => setStartModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setStartModalVisible(false)}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Create Experience</Text>
            <Text style={styles.modalDescription}>
              How would you like to start building your St. Louis experience?
            </Text>
            
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleStartFromScratch}
            >
              <Ionicons name="create-outline" size={24} color="#ffffff" style={styles.optionIcon} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Start from scratch</Text>
                <Text style={styles.optionDescription}>Describe what you're looking for</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#aaaaaa" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleHavePlaceInMind}
            >
              <Ionicons name="location-outline" size={24} color="#ffffff" style={styles.optionIcon} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>I have a place in mind</Text>
                <Text style={styles.optionDescription}>Start with a specific location</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#aaaaaa" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Prompt Modal: Natural Language Prompt */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={promptModalVisible}
        onRequestClose={() => setPromptModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.centeredView} 
          activeOpacity={1}
          onPress={dismissKeyboard}
        >
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              dismissKeyboard();
              setPromptModalVisible(false);
            }}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Describe Your Experience</Text>
            <Text style={styles.modalDescription}>
              Tell us what you're looking for in natural language, and we'll curate an experience just for you.
            </Text>
            
            <TextInput
              style={styles.promptInput}
              placeholder="e.g., A romantic evening with dinner and jazz music"
              placeholderTextColor="#aaaaaa"
              multiline
              numberOfLines={4}
              value={userPrompt}
              onChangeText={setUserPrompt}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={dismissKeyboard}
            />
            
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Examples:</Text>
              <Text style={styles.exampleItem}>• Day out with kids in St. Louis</Text>
              <Text style={styles.exampleItem}>• Foodie tour of local restaurants</Text>
              <Text style={styles.exampleItem}>• Cultural day visiting museums and landmarks</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, !userPrompt ? styles.submitButtonDisabled : null]}
              onPress={handleSubmitPrompt}
              disabled={!userPrompt}
            >
              <Text style={styles.submitButtonText}>Create My Experience</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Keyboard Done Button removed - using keyboard return key instead */}
      
      <CurateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartFromScratch={handleStartFromScratch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#3498db',
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 16,
    color: '#3498db',
  },
  experienceCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  experienceDate: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#DDDDDD',
    marginTop: 10,
    lineHeight: 20,
  },
  placesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeChip: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  placeChipText: {
    fontSize: 12,
    color: '#DDDDDD',
  },
  experienceHeader: {
    marginBottom: 15,
  },
  experienceHeaderSubtitle: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  experiencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recommendedCard: {
    width: '48%',
    marginBottom: 20,
  },
  recommendedImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  recommendedSubtitle: {
    fontSize: 14, 
    color: '#aaaaaa',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  createButton: {
    backgroundColor: '#3498db',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  bottomSpacer: {
    height: 80,
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
  
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,

  },
  modalTitle: {
    fontSize: 24,
    marginTop: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#ffffff',
  },
  modalDescription: {
    fontSize: 16,
    color: '#dddddd',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  
  // Prompt Modal Styles
  promptInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    height: 120,
    color: '#FFFFFF',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  examplesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  exampleItem: {
    fontSize: 14,
    color: '#dddddd',
    marginBottom: 5,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#2a2a2a',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  
  // Search styles
  searchContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  noResultsText: {
    color: '#aaaaaa',
    fontSize: 16,
    marginTop: 10,
  },
});

export default CurateScreen;