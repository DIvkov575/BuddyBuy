import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  primary: '#2E86C1',
  secondary: '#3498DB',
  success: '#2ECC71',
  danger: '#E74C3C',
  warning: '#F39C12',
  info: '#1ABC9C',
  light: '#ECF0F1',
  dark: '#34495E',
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    100: '#F7F9FA',
    200: '#E1E5EA',
    300: '#CBD1D8',
    400: '#A9B1BD',
    500: '#76808F',
    600: '#5C6676',
    700: '#434A57',
    800: '#2F353F',
    900: '#1C2028',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    muted: '#999999',
  },
  background: {
    primary: '#F5F5F5',
    card: '#FFFFFF',
  },
  transparent: 'transparent',
};

// Typography
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    huge: 36,
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
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
  round: 100,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
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
  textInput: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSuccess: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDanger: {
    backgroundColor: colors.danger,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.md,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
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
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
});

// Rating configuration
export const ratingConfig = {
  good: {
    icon: 'thumbs-up',
    color: colors.success,
  },
  neutral: {
    icon: 'remove',
    color: colors.gray[500],
  },
  bad: {
    icon: 'thumbs-down',
    color: colors.danger,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  commonStyles,
  ratingConfig,
};