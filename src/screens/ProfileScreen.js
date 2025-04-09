import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useItems } from '../ItemContext';
import theme from '../styles/theme';

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

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={theme.commonStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.infoCard}>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.value} numberOfLines={1}>{user?.id}</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{items.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {items.filter(item => !item.synced).length}
            </Text>
            <Text style={styles.statLabel}>Pending Sync</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSync}
        >
          <Ionicons name="sync" size={22} color={theme.colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Sync with Server</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={22} color={theme.colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.primary} style={styles.backIcon} />
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.version}>BuddyBuy v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 BuddyBuy</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.commonStyles.scrollContainer,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginTop: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  infoCard: {
    ...theme.commonStyles.card,
    marginHorizontal: theme.spacing.md,
  },
  profileInfo: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    paddingTop: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  dangerButton: {
    backgroundColor: theme.colors.danger,
  },
  actionIcon: {
    marginRight: theme.spacing.sm,
  },
  actionText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
  },
  backIcon: {
    marginRight: theme.spacing.xs,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.md,
  },
  footer: {
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
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