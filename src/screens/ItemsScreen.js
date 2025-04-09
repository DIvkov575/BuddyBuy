import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useItems } from '../ItemContext';
import ItemCard from '../components/ItemCard';

const ItemsScreen = ({ navigation }) => {
  const { items, loading, syncing, syncWithRemote } = useItems();
  const [refreshing, setRefreshing] = useState(false);

  // Handle manual refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await syncWithRemote();
    setRefreshing(false);
  };

  // Handle item press - navigate to edit screen
  const handleItemPress = (item) => {
    navigation.navigate('AddItem', { item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Items</Text>
        {syncing && (
          <View style={styles.syncingContainer}>
            <ActivityIndicator size="small" color="#3498DB" />
            <Text style={styles.syncingText}>Syncing...</Text>
          </View>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading items...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
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
              <Text style={styles.emptyText}>No items yet</Text>
              <Text style={styles.emptySubtext}>Add your first item by tapping the + button below</Text>
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncingText: {
    marginLeft: 5,
    color: '#3498DB',
  },
  listContent: {
    padding: 15,
    paddingTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ItemsScreen;