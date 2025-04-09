import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

const RatingIndicator = ({ rating }) => {
  const getRatingInfo = () => {
    if (rating === 3) {
      return {
        icon: theme.ratingConfig.good.icon,
        color: theme.ratingConfig.good.color,
        label: 'Good'
      };
    } else if (rating === 2) {
      return {
        icon: theme.ratingConfig.neutral.icon,
        color: theme.ratingConfig.neutral.color,
        label: 'Neutral'
      };
    } else {
      return {
        icon: theme.ratingConfig.bad.icon,
        color: theme.ratingConfig.bad.color,
        label: 'Bad'
      };
    }
  };

  const ratingInfo = getRatingInfo();

  return (
    <View style={styles.ratingContainer}>
      <Ionicons 
        name={ratingInfo.icon} 
        size={18} 
        color={ratingInfo.color} 
        style={styles.ratingIcon}
      />
      <Text style={[styles.ratingText, { color: ratingInfo.color }]}>
        {ratingInfo.label}
      </Text>
    </View>
  );
};

const ItemCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(item)} 
      activeOpacity={0.7}
    >
      {item.imageUri && (
        <Image 
          source={{ uri: item.imageUri }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        
        <RatingIndicator rating={item.rating} />
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        {!item.synced && (
          <View style={styles.syncBadge}>
            <Text style={styles.syncText}>Syncing...</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  syncBadge: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.md,
  },
  syncText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.xs,
  },
});

export default ItemCard;