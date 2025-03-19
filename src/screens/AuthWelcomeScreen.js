import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovingCircles from '../components/MovingCircles';
import Button from '../components/Button';

const AuthWelcomeScreen = ({ navigation }) => {
  const [displayText, setDisplayText] = useState('STL'); // Starting with STL
  const [cursorVisible, setCursorVisible] = useState(true);
  const neighborhoods = useRef([
    'STL',
    'Clayton',
    'Soulard',
    'The Grove',
    'CWE',
    'Dogtown',
    'The Hill',
    'Tower Grove',
    'Lafayette Square',
    'South Grand',
    'The Loop',
    'Benton Park'
  ]).current;
  
  const [currentNeighborhood, setCurrentNeighborhood] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingPause, setTypingPause] = useState(true); // Start with pause since we're showing STL
  
  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  useEffect(() => {
    let timeout;
    
    // Handle typing animation
    const handleTyping = () => {
      const currentText = neighborhoods[currentNeighborhood];
      
      if (isDeleting) {
        // Deleting phase
        if (displayText.length > 0) {
          // Continue deleting
          const newText = displayText.slice(0, -1);
          setDisplayText(newText);
          timeout = setTimeout(handleTyping, 5); // MAXIMUM SPEED for deleting
        } else {
          // Done deleting, move to the next neighborhood
          setIsDeleting(false);
          setCurrentNeighborhood((prev) => (prev + 1) % neighborhoods.length);
          timeout = setTimeout(handleTyping, 30); // Very minimal pause before typing next
        }
      } else if (typingPause) {
        // Pause after fully typing a neighborhood
        setTypingPause(false);
        setIsDeleting(true);
        timeout = setTimeout(handleTyping, 200); // Shorter pause before deleting
      } else {
        // Typing phase
        if (displayText.length < currentText.length) {
          // Continue typing
          const newText = currentText.slice(0, displayText.length + 1);
          setDisplayText(newText);
          timeout = setTimeout(handleTyping, 15); // MAXIMUM SPEED for typing
        } else {
          // Done typing, pause before deleting
          setTypingPause(true);
          timeout = setTimeout(handleTyping, 200); // Shorter pause after typing
        }
      }
    };
    
    // Start the animation after initial pause with STL
    timeout = setTimeout(handleTyping, 200);
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingPause, currentNeighborhood, neighborhoods]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MovingCircles />
      <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Show Me</Text>
              </View>
              <View style={styles.neighborhoodContainer}>
                <Text style={styles.neighborhoodText}>{displayText}</Text>
                <Text style={[styles.cursor, { opacity: cursorVisible ? 1 : 0 }]}>|</Text>
              </View>
            </View>
            
            <View style={styles.bottomContainer}>
              <Button 
                title="Get Started"
                onPress={() => navigation.navigate('PhoneAuth')}
                style={styles.getStartedButton}
              />
            </View>
          </View>
        </SafeAreaView>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  blurOverlay: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center vertically
    paddingHorizontal: 20,
    paddingBottom: 120, // Create space for bottom button
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoText: {
    fontSize: 36, // Smaller text size
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  neighborhoodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end', // Align text baselines
  },
  neighborhoodText: {
    fontSize: 36, // Smaller text size
    fontWeight: 'bold',
    color: '#FFFFFF',
    includeFontPadding: false, // Remove extra padding
    textAlign: 'center',
  },
  cursor: {
    fontSize: 40, // Adjusted to match smaller text
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40, // Match height adjustment
    marginBottom: -1, // Slight adjustment to align with text
    includeFontPadding: false, // Remove extra padding
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 50, // Position at bottom with padding
    paddingHorizontal: 20,
  },
  getStartedButton: {
    width: '100%',
  },
});

export default AuthWelcomeScreen;