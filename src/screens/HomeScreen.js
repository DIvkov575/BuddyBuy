import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useItems } from '../ItemContext';
import ItemCard from '../components/ItemCard';
import Fuse from 'fuse.js';
import theme from '../styles/theme';

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
            <ActivityIndicator size="small" color={theme.colors.secondary} style={styles.syncIndicator} />
          )}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="person" size={24} color={theme.colors.primary} />
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
          <ActivityIndicator size="large" color={theme.colors.secondary} />
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
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching items' : 'No items yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery 
                  ? 'Try a different search' 
                  : 'Add your first item by tapping the + button'
                }
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
    ...theme.commonStyles.container,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingTop: 50, // Safe area for iOS
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  profileButton: {
    padding: theme.spacing.xs,
  },
  syncIndicator: {
    marginRight: theme.spacing.sm,
  },
  searchBar: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.md,
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  addButtonText: {
    fontSize: theme.typography.fontSizes.xxl,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

export default HomeScreen;