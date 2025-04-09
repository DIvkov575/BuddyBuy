import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useItems } from '../ItemContext';

const RatingStars = ({ rating }) => {
  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3].map(star => (
        <Text 
          key={star} 
          style={[styles.star, star <= rating ? styles.filled : styles.empty]}
        >
          ★
        </Text>
      ))}
    </View>
  );
};

const ItemCard = ({ item, onPress }) => {
  const { deleteItem } = useItems();

  const handleDelete = () => {
    deleteItem(item.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      {item.imageUri && (
        <Image 
          source={{ uri: item.imageUri }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <RatingStars rating={item.rating} />
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        {!item.synced && (
          <View style={styles.syncBadge}>
            <Text style={styles.syncText}>Syncing...</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 18,
    marginRight: 2,
  },
  filled: {
    color: '#FFD700',
  },
  empty: {
    color: '#D3D3D3',
  },
  deleteButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  syncBadge: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#3498DB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  syncText: {
    color: '#fff',
    fontSize: 10,
  },
});

export default ItemCard;