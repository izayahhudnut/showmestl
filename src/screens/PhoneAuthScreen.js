import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../components/Button';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovingCircles from '../components/MovingCircles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhoneAuthScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      // Since we're not using Firebase Phone Auth (due to billing requirement),
      // we'll simulate the verification process
      
      // Store phone number for verification reference
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
        // For demo purposes, alert the user about the fixed code
        alert('For demo purposes, use "123456" as your verification code.');
        // Navigate to verification screen
        navigation.navigate('VerifyCode');
      }, 1500);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MovingCircles />
      
      <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.contentContainer}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Enter your phone number</Text>
              <Text style={styles.subHeaderText}>We'll send you a verification code</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.phoneInputContainer}>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="(XXX) XXX-XXXX"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  autoFocus
                  value={phoneNumber}
                  onChangeText={(text) => {
                    // Strip any non-numeric characters
                    const cleaned = text.replace(/\D/g, '');
                    
                    // Remove the leading 1 if present (country code)
                    const withoutCountryCode = cleaned.startsWith('1') 
                      ? cleaned.substring(1) 
                      : cleaned;
                    
                    // Limit to 10 digits
                    setPhoneNumber(withoutCountryCode.slice(0, 10));
                  }}
                  textContentType="telephoneNumber"
                  autoCompleteType="tel"
                  keyboardAppearance="dark"
                />
              </View>
            </View>

            <Button 
              title={isLoading ? "Sending..." : "Send Code"}
              onPress={handleSendCode}
              style={[
                styles.sendCodeButton, 
                phoneNumber.length < 10 && styles.disabledButton
              ]}
              disabled={phoneNumber.length < 10 || isLoading}
            />
          </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  inputContainer: {
    marginBottom: 30,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingLeft: 0,
    paddingRight: 10,
  },
  sendCodeButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.4,
  },
});

export default PhoneAuthScreen;