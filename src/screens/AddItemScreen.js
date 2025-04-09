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
import { useItems } from '../ItemContext';

const AddItemScreen = ({ navigation, route }) => {
  const { addItem, updateItem } = useItems();
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Item' : 'Add New Item'}</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter item title"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter item description"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3].map(star => (
            <TouchableOpacity 
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text 
                style={[styles.star, star <= rating ? styles.filled : styles.empty]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Image</Text>
        <View style={styles.imageOptions}>
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={styles.buttonText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.button}>
            <Text style={styles.buttonText}>Take Photo</Text>
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
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditing ? 'Update Item' : 'Add Item'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starButton: {
    marginRight: 10,
  },
  star: {
    fontSize: 36,
  },
  filled: {
    color: '#FFD700',
  },
  empty: {
    color: '#D3D3D3',
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: 80,
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2ECC71',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddItemScreen;