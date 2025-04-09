import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * A reusable gradient background component that can be used across the app
 * @param {Object} props - Component props
 * @param {Array} props.colors - Gradient colors array (optional, defaults to primary gradient)
 * @param {String} props.type - Preset gradient type: 'primary', 'secondary', 'accent' (optional)
 * @param {Object} props.style - Additional styles for the container
 * @param {React.ReactNode} props.children - Child components
 */
const GradientBackground = ({ 
  colors, 
  type = 'primary', 
  style, 
  children 
}) => {
  // Determine gradient colors based on type or use custom colors
  const gradientColors = colors || theme.colors[type].gradient;
  
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;