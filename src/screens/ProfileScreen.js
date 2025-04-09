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
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      )}
      
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#2E86C1" />
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
          <Ionicons name="sync" size={22} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Sync with Server</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={22} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#2E86C1" style={styles.backIcon} />
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
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#2E86C1',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  actionIcon: {
    marginRight: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  backIcon: {
    marginRight: 5,
  },
  backText: {
    color: '#2E86C1',
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default ProfileScreen;