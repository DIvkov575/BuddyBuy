import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  ActivityIndicator, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useItems } from '../ItemContext';
import ItemCard from '../components/ItemCard';
import GradientBackground from '../components/GradientBackground';
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
    <GradientBackground>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BuddyBuy</Text>
          <View style={styles.headerRight}>
            {syncing && (
              <ActivityIndicator size="small" color={theme.colors.white} style={styles.syncIndicator} />
            )}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="person" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={theme.colors.gray[500]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor={theme.colors.gray[500]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
          
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
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
                  colors={[theme.colors.primary.main]}
                  tintColor={theme.colors.primary.main}
                />
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons 
                    name={searchQuery ? "search-outline" : "list-outline"} 
                    size={48} 
                    color={theme.colors.gray[400]} 
                  />
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
            <Ionicons name="add" size={28} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...theme.commonStyles.header,
    backgroundColor: 'transparent',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.heading,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.white,
  },
  profileButton: {
    padding: theme.spacing.xs,
  },
  syncIndicator: {
    marginRight: theme.spacing.sm,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.ui.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xl * 2,
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
    height: 300,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.md,
  },
  addButton: {
    ...theme.commonStyles.floatingActionButton,
  },
});

export default HomeScreen;