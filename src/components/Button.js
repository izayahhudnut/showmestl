import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, Easing, Dimensions, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur'; 

const AnimatedCircle = ({ size, color, duration, startPosition, endPosition }) => {
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Setup smoother animation with easing
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.42, 0, 0.58, 1), // Custom bezier curve for smoother motion
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

  // Platform-specific circle rendering
  if (Platform.OS === 'ios') {
    // On iOS we can use BlurView for a true blur effect
    return (
      <Animated.View
        style={[
          styles.circleContainer,
          {
            width: size,
            height: size,
            transform: [{ translateX }, { translateY }],
          },
        ]}
      >
        <View style={[styles.innerCircle, { backgroundColor: color }]} />
        <BlurView 
          style={StyleSheet.absoluteFill}
          intensity={50} // Higher intensity = more blur
          tint="default"
        />
      </Animated.View>
    );
  } else {
    // On Android we'll simulate blur with opacity and shadow
    return (
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: size / 2,
            transform: [{ translateX }, { translateY }],
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 20,
            shadowOpacity: 0.8,
            elevation: 20,
          },
        ]}
      />
    );
  }
};

const Button = ({ title, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >

      
      <View style={styles.gradientContainer}>
        {/* Background gradient - dark gray */}
        <LinearGradient
          colors={['#333333', '#222222', '#111111']} // Dark gray gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        {/* Much larger circles with smoother animations - using random colors */}
        <AnimatedCircle
          size={400} // Significantly larger
          color="rgba(255, 87, 51, 0.4)" // Orange-red
          duration={25000} // Longer for smoother motion
          startPosition={{ x: -150, y: -150 }}
          endPosition={{ x: 50, y: 50 }}
        />
        <AnimatedCircle
          size={450}
          color="rgba(46, 204, 113, 0.3)" // Green
          duration={28000}
          startPosition={{ x: 100, y: -200 }}
          endPosition={{ x: -100, y: 100 }}
        />
        <AnimatedCircle
          size={500}
          color="rgba(52, 152, 219, 0.5)" // Blue
          duration={30000}
          startPosition={{ x: 150, y: 100 }}
          endPosition={{ x: -150, y: -100 }}
        />
        <AnimatedCircle
          size={550}
          color="rgba(241, 196, 15, 0.4)" // Yellow
          duration={32000}
          startPosition={{ x: -200, y: 50 }}
          endPosition={{ x: 200, y: -150 }}
        />
        <AnimatedCircle
          size={500}
          color="rgba(231, 76, 60, 0.35)" // Red
          duration={27000}
          startPosition={{ x: 0, y: 200 }}
          endPosition={{ x: 100, y: -200 }}
        />

        {/* Dark overlay */}
        <View style={styles.darkOverlay} />
        
     
      </View>

      {/* Button text content */}
      <View style={styles.contentContainer}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 64,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  // Regular circle style (for Android)
  circle: {
    position: 'absolute',
    opacity: 0.8,
    // Blur is simulated with shadow and opacity
  },
  // For iOS blur implementation
  circleContainer: {
    position: 'absolute',
    borderRadius: 1000, // Very large to ensure circular shape
    overflow: 'hidden',
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 1000, // Very large to ensure circular shape
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(101, 100, 100, 0.90)',
    zIndex: 1,
  },

  contentContainer: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Button;