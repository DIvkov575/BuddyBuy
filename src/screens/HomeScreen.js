import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useItems } from '../ItemContext';
import ItemCard from '../components/ItemCard';
import Fuse from 'fuse.js';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { items, loading, syncing, syncWithRemote } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Setup fuzzy search with Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ['title', 'description'],
      includeScore: true,
      threshold: 0.4,
    });
  }, [items]);

  // Handle manual refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await syncWithRemote();
    setRefreshing(false);
  };

  // Handle item press - navigate to detail screen
  const handleItemPress = (item) => {
    navigation.navigate('AddItem', { item });
  };

  // Get filtered items based on search query using fuzzy search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [fuse, searchQuery, items]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BuddyBuy</Text>
        <View style={styles.headerRight}>
          {syncing && (
            <ActivityIndicator size="small" color="#3498DB" style={styles.syncIndicator} />
          )}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
          >
            <Ionicons name="person" size={24} color="#2E86C1" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={handleItemPress} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching items' : 'No items yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search' : 'Add your first item by tapping the + button'}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  syncIndicator: {
    marginRight: 8,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;