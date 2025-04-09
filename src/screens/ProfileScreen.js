import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useItems } from '../ItemContext';
import GradientBackground from '../components/GradientBackground';
import theme from '../styles/theme';

const ActionButton = ({ icon, title, onPress, type = 'primary', disabled = false }) => {
  const buttonStyle = type === 'primary' 
    ? styles.actionButton 
    : [styles.actionButton, styles.dangerButton];
  
  return (
    <TouchableOpacity
      style={[buttonStyle, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={22} color={theme.colors.white} style={styles.actionIcon} />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
};

const StatCard = ({ icon, value, label }) => {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={theme.colors.primary.main} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { items, syncWithRemote } = useItems();
  const [loading, setLoading] = useState(false);
  
  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            setLoading(true);
            try {
              const success = await signOut();
              if (success) {
                // The auth listener in AuthContext will redirect to sign in
              }
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Force sync with server
  const handleSync = async () => {
    setLoading(true);
    try {
      await syncWithRemote();
      Alert.alert('Success', 'Your items have been synced with the server.');
    } catch (error) {
      console.error('Error syncing:', error);
      Alert.alert('Error', 'Failed to sync with server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pendingSyncCount = items.filter(item => !item.synced).length;

  return (
    <GradientBackground>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {loading && (
        <View style={theme.commonStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.white} />
        </View>
      )}
      
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color={theme.colors.white} />
            </View>
            <Text style={styles.userName}>{user?.email}</Text>
            <Text style={styles.userId}>ID: {user?.id?.substring(0, 8)}...</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <StatCard 
              icon="list" 
              value={items.length} 
              label="Total Items" 
            />
            <StatCard 
              icon="sync" 
              value={pendingSyncCount} 
              label="Pending Sync" 
            />
          </View>
          
          <View style={styles.sectionTitle}>
            <Ionicons name="settings-outline" size={20} color={theme.colors.text.primary} />
            <Text style={styles.sectionTitleText}>Account</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <ActionButton 
              icon="sync"
              title="Sync with Server"
              onPress={handleSync}
              disabled={loading}
            />
            
            <ActionButton 
              icon="log-out"
              title="Sign Out"
              onPress={handleSignOut}
              type="danger"
              disabled={loading}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.version}>BuddyBuy v1.0.0</Text>
            <Text style={styles.copyright}>© 2025 BuddyBuy</Text>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl + theme.spacing.lg, // For status bar
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.heading,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.white,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    marginTop: theme.spacing.md,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  userName: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userId: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    backgroundColor: theme.colors.ui.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    width: '45%',
    ...theme.shadows.small,
  },
  statIcon: {
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.heading,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitleText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  actionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    backgroundColor: theme.colors.primary.main,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  dangerButton: {
    backgroundColor: theme.colors.status.danger,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionIcon: {
    marginRight: theme.spacing.sm,
  },
  actionText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.semibold,
    fontSize: theme.typography.fontSizes.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  version: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.muted,
  },
  copyright: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
});

export default ProfileScreen;