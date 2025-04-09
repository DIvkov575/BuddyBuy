import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  // Primary colors
  primary: {
    light: '#5DADE2', // Light blue
    main: '#3498DB',  // Main blue
    dark: '#2E86C1',  // Dark blue
    gradient: ['#3498DB', '#2980B9'],
  },
  secondary: {
    light: '#2ECC71', // Light green
    main: '#27AE60',  // Main green
    dark: '#229954',  // Dark green
    gradient: ['#2ECC71', '#27AE60'],
  },
  accent: {
    light: '#F39C12', // Light orange
    main: '#E67E22',  // Main orange
    dark: '#D35400',  // Dark orange
    gradient: ['#F39C12', '#D35400'],
  },
  
  // UI colors
  ui: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    divider: '#E9ECEF',
  },
  
  // Text colors
  text: {
    primary: '#2C3E50',
    secondary: '#5D6D7E',
    muted: '#95A5A6',
    light: '#FFFFFF',
  },
  
  // Status colors
  status: {
    success: '#2ECC71',
    warning: '#F39C12',
    danger: '#E74C3C',
    info: '#3498DB',
  },
  
  // Grayscale
  gray: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  
  // Essentials
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    heading: 24,
    title: 28,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  lineHeights: {
    xs: 1.2,
    sm: 1.4,
    md: 1.6,
    lg: 1.8,
    xl: 2,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 1000,
};

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 3,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5.5,
    elevation: 6,
  },
};

// Z-index
export const zIndex = {
  base: 0,
  elevated: 1,
  dropdown: 10,
  navbar: 100,
  modal: 1000,
  toast: 2000,
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.ui.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.lg, // For status bar
    paddingBottom: spacing.md,
    zIndex: zIndex.navbar,
  },
  title: {
    fontSize: typography.fontSizes.heading,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.secondary,
  },
  textInput: {
    backgroundColor: colors.ui.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    ...shadows.small,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  buttonPrimary: {
    backgroundColor: colors.primary.main,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary.main,
  },
  buttonDanger: {
    backgroundColor: colors.status.danger,
  },
  buttonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.semibold,
    fontSize: typography.fontSizes.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    ...shadows.small,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ui.card,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: zIndex.modal,
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.divider,
    marginVertical: spacing.md,
  },
});

// Rating configuration
export const ratingConfig = {
  good: {
    icon: 'thumbs-up',
    color: colors.status.success,
    label: 'Good',
  },
  neutral: {
    icon: 'remove',
    color: colors.gray[500],
    label: 'Neutral',
  },
  bad: {
    icon: 'thumbs-down',
    color: colors.status.danger,
    label: 'Bad',
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  commonStyles,
  ratingConfig,
};