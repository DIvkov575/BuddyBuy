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
        label: theme.ratingConfig.good.label
      };
    } else if (rating === 2) {
      return {
        icon: theme.ratingConfig.neutral.icon,
        color: theme.ratingConfig.neutral.color,
        label: theme.ratingConfig.neutral.label
      };
    } else {
      return {
        icon: theme.ratingConfig.bad.icon,
        color: theme.ratingConfig.bad.color,
        label: theme.ratingConfig.bad.label
      };
    }
  };

  const ratingInfo = getRatingInfo();

  return (
    <View style={styles.ratingContainer}>
      <Ionicons 
        name={ratingInfo.icon} 
        size={16} 
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
      <View style={styles.contentContainer}>
        {item.imageUri ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={22} color={theme.colors.gray[400]} />
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          
          <RatingIndicator rating={item.rating} />
          
          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
        </View>
      </View>
      
      {!item.synced && (
        <View style={styles.syncBadge}>
          <Ionicons name="sync" size={12} color={theme.colors.white} style={styles.syncIcon} />
          <Text style={styles.syncText}>Syncing</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.ui.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    margin: theme.spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.gray[100],
    margin: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.sm,
    paddingLeft: 0,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: theme.spacing.xs / 2,
  },
  ratingText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  syncBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIcon: {
    marginRight: theme.spacing.xs / 2,
  },
  syncText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default ItemCard;