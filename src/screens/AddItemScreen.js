import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useItems } from '../ItemContext';
import theme from '../styles/theme';

const RatingSelector = ({ rating, setRating }) => {
  const options = [
    { value: 1, label: 'Bad', icon: 'thumbs-down', color: theme.colors.danger },
    { value: 2, label: 'Neutral', icon: 'remove', color: theme.colors.gray[500] },
    { value: 3, label: 'Good', icon: 'thumbs-up', color: theme.colors.success },
  ];

  return (
    <View style={styles.ratingSelector}>
      {options.map(option => (
        <TouchableOpacity 
          key={option.value}
          style={[
            styles.ratingOption,
            rating === option.value && { backgroundColor: option.color + '20' } // Add transparent background when selected
          ]}
          onPress={() => setRating(option.value)}
        >
          <Ionicons 
            name={option.icon} 
            size={28} 
            color={rating === option.value ? option.color : theme.colors.gray[400]} 
          />
          <Text style={[
            styles.ratingLabel,
            rating === option.value && { color: option.color, fontWeight: theme.typography.fontWeights.bold }
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const AddItemScreen = ({ navigation, route }) => {
  const { addItem, updateItem, deleteItem } = useItems();
  const editItem = route.params?.item;
  
  const [title, setTitle] = useState(editItem?.title || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [rating, setRating] = useState(editItem?.rating || 0);
  const [imageUri, setImageUri] = useState(editItem?.imageUri || null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!editItem;

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating for your item.');
      return;
    }

    try {
      setLoading(true);
      
      const itemData = {
        title,
        description,
        rating,
        imageUri
      };
      
      if (isEditing) {
        await updateItem(editItem.id, itemData);
        Alert.alert('Success', 'Item updated successfully!');
      } else {
        await addItem(itemData);
        Alert.alert('Success', 'Item added successfully!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              const success = await deleteItem(editItem.id);
              if (success) {
                Alert.alert('Success', 'Item deleted successfully!');
                navigation.goBack();
              } else {
                throw new Error('Failed to delete item');
              }
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
        {loading && (
          <View style={theme.commonStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        <Text style={styles.title}>{isEditing ? 'Preview' : 'Add New Item'}</Text>

        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
          />
        </View>

        <View style={styles.formGroup}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rating</Text>
          <RatingSelector rating={rating} setRating={setRating} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image</Text>
          <View style={styles.imageOptions}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
              <Ionicons name="images-outline" size={18} color={theme.colors.white} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
              <Ionicons name="camera-outline" size={18} color={theme.colors.white} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {imageUri && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {isEditing ? 'Save Changes' : 'Add Item'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.disabledButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.white} style={styles.buttonIcon} />
            <Text style={styles.deleteButtonText}>Delete Item</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  outerContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: 'Center'
  },
  innerContainer: {
    maxWidth: 800,
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  input: {
    ...theme.commonStyles.textInput,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingOption: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
  },
  ratingLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    flex: 0.48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: theme.spacing.xs,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
  },
  imagePreview: {
    position: 'relative',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: 80,
    backgroundColor: theme.colors.danger,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.md,
  },
  submitButton: {
    backgroundColor: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.md,
  },
  deleteButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.md,
  },
});

export default AddItemScreen;