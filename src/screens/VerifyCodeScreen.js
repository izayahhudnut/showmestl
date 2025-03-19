import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../components/Button';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovingCircles from '../components/MovingCircles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../App';

const VerifyCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRef = useRef(null);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Get stored phone number
    const getStoredData = async () => {
      const storedNumber = await AsyncStorage.getItem('phoneNumber');
      
      if (storedNumber) {
        setPhoneNumber(storedNumber);
      } else {
        alert('Phone number not found. Please try again.');
        navigation.goBack();
      }
    };

    getStoredData();
    
    // Focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    // Set up timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyCode = async () => {
    if (code.length < 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    
    try {
      // Since we're simulating, accept any 6-digit code
      // In a real app, this would validate with an API
      
      // For demo, let's just verify if code is 123456
      if (code === '123456') {
        // Use the login function from context to update auth state
        await login();
      } else {
        // Show error for any other code (in real app, this would come from API)
        setTimeout(() => {
          alert('Invalid verification code. Please try 123456.');
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      alert(`Verification failed: ${error.message}`);
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // This would require going back to the phone screen
    // For simplicity, we'll just alert the user
    alert('Please go back and request a new code');
    navigation.goBack();
  };

  // Format phone number for display
  const formatPhoneNumber = (number) => {
    if (!number) return '';
    
    // Basic US number formatting (XXX) XXX-XXXX
    if (number.length === 10) {
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
    }
    
    return number;
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
              <Text style={styles.headerText}>Enter verification code</Text>
              <Text style={styles.subHeaderText}>
                Enter code "123456" to verify {formatPhoneNumber(phoneNumber)}
              </Text>
            </View>

            <View style={styles.codeInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.codeInput}
                placeholder="123456"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                maxLength={6}
                keyboardAppearance="dark"
              />
            </View>

            <Button 
              title={isLoading ? "Verifying..." : "Verify Code"}
              onPress={handleVerifyCode}
              style={[
                styles.verifyButton, 
                code.length < 6 && styles.disabledButton
              ]}
              disabled={code.length < 6 || isLoading}
            />

            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>Resend code in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
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
  codeInputContainer: {
    marginBottom: 30,
  },
  codeInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 8,
    height: 55,
  },
  verifyButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.4,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  timerText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  resendText: {
    color: 'rgba(150, 80, 170, 0.8)',
    fontSize: 16,
  },
});

export default VerifyCodeScreen;