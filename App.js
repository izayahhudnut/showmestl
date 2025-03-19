import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { View, StyleSheet, Platform, TouchableOpacity, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from './src/config/theme';

// Apply default props to fix placeholder text spacing issues
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
  spellCheck: false,
  autoCorrect: false,
  fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
  letterSpacing: 0, // Prevent weird character spacing
};

// Import original screens
import DiscoverScreen from './src/screens/DiscoverScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';
import ComposeScreen from './src/screens/ComposeScreen';
import PlaceSearchScreen from './src/screens/PlaceSearchScreen';
import CurateResultsScreen from './src/screens/CurateResultsScreen';
import CurateScreen from './src/screens/CurateScreen';
import EventsScreen from './src/screens/EventsScreen';

// Import new screens
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import auth screens
import AuthWelcomeScreen from './src/screens/AuthWelcomeScreen';
import PhoneAuthScreen from './src/screens/PhoneAuthScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom tab bar component with blur effect
const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={styles.tabBarContainer}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get the icon name
          let iconName;
          if (route.name === 'For You') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = isFocused ? 'search' : 'search-outline';
          } else if (route.name === 'Curate') {
            iconName = isFocused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Profile') {
            iconName = isFocused ? 'person' : 'person-outline';
          } else if (route.name === 'Events') {
            iconName = isFocused ? 'calendar' : 'calendar-outline';
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? '#ffffff' : '#bbbbbb'}
              />
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? '#ffffff' : '#bbbbbb' }
              ]}>
                {label}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

// Stack navigators for each tab
const DiscoverStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
    <Stack.Screen 
      name="PlaceDetail" 
      component={PlaceDetailScreen} 
      options={{
        animation: 'slide_from_right',
      }}
    />
  </Stack.Navigator>
);

// Search stack navigator
const SearchStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SearchMain" component={SearchScreen} />
    <Stack.Screen 
      name="PlaceDetail" 
      component={PlaceDetailScreen} 
      options={{
        animation: 'slide_from_right',
      }}
    />
  </Stack.Navigator>
);



// Curate stack navigator
const CurateStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="CurateMain" component={CurateScreen} />
    <Stack.Screen name="Compose" component={ComposeScreen} />
    <Stack.Screen name="PlaceSearch" component={PlaceSearchScreen} />
    <Stack.Screen name="CurateResults" component={CurateResultsScreen} />
  </Stack.Navigator>
);

const EventsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="EventsMain" component={EventsScreen} />
  </Stack.Navigator>
);

// Profile stack navigator
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen 
      name="PlaceDetail" 
      component={PlaceDetailScreen} 
      options={{
        animation: 'slide_from_right',
      }}
    />
    <Stack.Screen 
      name="CurateResults" 
      component={CurateResultsScreen} 
      options={{
        animation: 'slide_from_right',
      }}
    />
  </Stack.Navigator>
);

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Welcome" component={AuthWelcomeScreen} />
    <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
  </Stack.Navigator>
);

// Main App with Tabs
const MainApp = () => (
  <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen name="For You" component={DiscoverStack} />
    <Tab.Screen name="Search" component={SearchStack} />
    <Tab.Screen name="Curate" component={CurateStack} />
    <Tab.Screen name="Events" component={EventsStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

// Create a context to manage auth state globally
import { createContext } from 'react';
export const AuthContext = createContext();

// Root Navigator
const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    // You could show a splash screen here
    return null;
  }

  // Create auth context value
  const authContext = {
    isAuthenticated,
    login: async () => {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    },
    logout,
  };

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainApp" component={MainApp} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingTop: 12,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  activeIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginTop: 4,
  }
});