import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

// Create noise component using the noise.png image
const NoiseOverlay = () => {
  return (
    <View style={styles.noiseContainer}>
      <Image 
        source={require('../../assets/noise.png')} 
        style={styles.noiseImage}
        resizeMode="repeat"
      />
    </View>
  );
};

const MovingCircles = () => {
  // Create animated values for each circle
  const circle1Position = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle2Position = React.useRef(new Animated.ValueXY({ x: width, y: height / 3 })).current;
  const circle3Position = React.useRef(new Animated.ValueXY({ x: width / 2, y: height })).current;
  
  // Color animations
  const circle1Color = React.useRef(new Animated.Value(0)).current;
  const circle2Color = React.useRef(new Animated.Value(0)).current;
  const circle3Color = React.useRef(new Animated.Value(0)).current;

  const animateCircles = () => {
    // Create random destinations within screen bounds
    const getRandomPosition = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    });

    // Animate all circles
    const duration = 15000; // 15 seconds per movement

    Animated.parallel([
      // Position animations
      Animated.timing(circle1Position, {
        toValue: getRandomPosition(),
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(circle2Position, {
        toValue: getRandomPosition(),
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(circle3Position, {
        toValue: getRandomPosition(),
        duration,
        useNativeDriver: false,
      }),
      
      // Color animations
      Animated.timing(circle1Color, {
        toValue: Math.random(),
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(circle2Color, {
        toValue: Math.random(),
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(circle3Color, {
        toValue: Math.random(),
        duration,
        useNativeDriver: false,
      }),
    ]).start(() => animateCircles()); // Loop the animation
  };

  useEffect(() => {
    animateCircles();
    // Clean up animations on unmount
    return () => {
      circle1Position.stopAnimation();
      circle2Position.stopAnimation();
      circle3Position.stopAnimation();
    };
  }, []);

  // Interpolate colors for gradients
  const circle1BackgroundColor = circle1Color.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      'rgba(255, 87, 51, 0.3)',    // Orange-red
      'rgba(46, 204, 113, 0.3)',   // Green
      'rgba(52, 152, 219, 0.3)',   // Blue
      'rgba(241, 196, 15, 0.3)',   // Yellow
      'rgba(231, 76, 60, 0.3)',    // Red
      'rgba(155, 89, 182, 0.3)'    // Purple
    ],
  });

  const circle2BackgroundColor = circle2Color.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      'rgba(26, 188, 156, 0.3)',   // Turquoise
      'rgba(230, 126, 34, 0.3)',   // Orange
      'rgba(41, 128, 185, 0.3)',   // Blue
      'rgba(142, 68, 173, 0.3)',   // Purple
      'rgba(39, 174, 96, 0.3)',    // Green
      'rgba(211, 84, 0, 0.3)'      // Dark Orange
    ],
  });

  const circle3BackgroundColor = circle3Color.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      'rgba(22, 160, 133, 0.3)',   // Green
      'rgba(243, 156, 18, 0.3)',   // Orange
      'rgba(192, 57, 43, 0.3)',    // Red
      'rgba(52, 73, 94, 0.3)',     // Dark Blue
      'rgba(155, 89, 182, 0.3)',   // Purple
      'rgba(41, 128, 185, 0.3)'    // Blue
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          {
            left: circle1Position.x,
            top: circle1Position.y,
            backgroundColor: circle1BackgroundColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            left: circle2Position.x,
            top: circle2Position.y,
            backgroundColor: circle2BackgroundColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          {
            left: circle3Position.x,
            top: circle3Position.y,
            backgroundColor: circle3BackgroundColor,
          },
        ]}
      />
      <NoiseOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  noiseContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  noiseImage: {
    width: '100%',
    height: '100%',
    opacity: .95,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000, // Make it a circle
  },
  circle1: {
    width: 300,
    height: 300,
    transform: [{ translateX: -150 }, { translateY: -150 }], // Center the circle on its position
  },
  circle2: {
    width: 400,
    height: 400,
    transform: [{ translateX: -200 }, { translateY: -200 }],
  },
  circle3: {
    width: 350,
    height: 350,
    transform: [{ translateX: -175 }, { translateY: -175 }],
  },
});

export default MovingCircles;