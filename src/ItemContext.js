import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import * as FileSystem from 'expo-file-system';

const ItemContext = createContext({});

export const ItemProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load items from local storage on mount
  useEffect(() => {
    if (user) {
      loadItemsFromLocal();
      // Then sync with remote
      syncWithRemote();
    }
  }, [user]);

  // Load items from local storage
  const loadItemsFromLocal = async () => {
    try {
      setLoading(true);
      const localItems = await AsyncStorage.getItem(`items-${user.id}`);
      if (localItems) {
        setItems(JSON.parse(localItems));
      }
    } catch (error) {
      console.error('Error loading local items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save items to local storage
  const saveItemsToLocal = async (updatedItems) => {
    try {
      await AsyncStorage.setItem(`items-${user.id}`, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving local items:', error);
    }
  };

  // Add an item locally
  const addItem = async (newItem) => {
    try {
      setLoading(true);
      
      // Add a local ID and timestamp
      const itemWithId = {
        ...newItem,
        id: `local-${Date.now()}`,
        user_id: user.id,
        created_at: new Date().toISOString(),
        synced: false
      };
      
      const updatedItems = [...items, itemWithId];
      setItems(updatedItems);
      await saveItemsToLocal(updatedItems);
      
      // Try to sync immediately
      syncItem(itemWithId);
      
      return itemWithId;
    } catch (error) {
      console.error('Error adding item:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sync a single item with Supabase
  const syncItem = async (item) => {
    if (!user) return;
    
    try {
      // First upload any image if present
      let imageUrl = item.imageUri;
      if (item.imageUri && item.imageUri.startsWith('file://')) {
        imageUrl = await uploadImage(item.imageUri);
      }
      
      // Check if it's a new item (has a local ID) or an existing one
      if (item.id.startsWith('local-')) {
        // Create new item in Supabase
        const { data, error } = await supabase
          .from('items')
          .insert([
            {
              title: item.title,
              description: item.description,
              rating: item.rating,
              image_url: imageUrl,
              user_id: user.id
            }
          ])
          .select();
          
        if (error) throw error;
        
        // Update local item with server ID and mark as synced
        if (data && data[0]) {
          const updatedItems = items.map(i => 
            i.id === item.id 
              ? { ...i, id: data[0].id, synced: true, imageUri: imageUrl } 
              : i
          );
          setItems(updatedItems);
          await saveItemsToLocal(updatedItems);
        }
      } else {
        // Update existing item
        const { error } = await supabase
          .from('items')
          .update({
            title: item.title,
            description: item.description,
            rating: item.rating,
            image_url: imageUrl
          })
          .eq('id', item.id);
          
        if (error) throw error;
        
        // Mark as synced in local storage
        const updatedItems = items.map(i => 
          i.id === item.id 
            ? { ...i, synced: true, imageUri: imageUrl } 
            : i
        );
        setItems(updatedItems);
        await saveItemsToLocal(updatedItems);
      }
    } catch (error) {
      console.error('Error syncing item:', error);
    }
  };

  // Upload an image to Supabase Storage
  const uploadImage = async (uri) => {
    try {
      const fileExt = uri.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Read the file as base64
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      // Convert to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('item-images')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`
        });
        
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return uri; // Return original URI if upload fails
    }
  };

  // Sync all items with Supabase
  const syncWithRemote = async () => {
    if (!user) return;
    
    try {
      setSyncing(true);
      
      // First, get all items from Supabase
      const { data: remoteItems, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Map remote items to our local format
      const formattedRemoteItems = remoteItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        rating: item.rating,
        imageUri: item.image_url,
        user_id: item.user_id,
        created_at: item.created_at,
        synced: true
      }));
      
      // Get local items that aren't synced yet
      const localUnsyncedItems = items.filter(item => !item.synced);
      
      // Sync each unsynced item
      for (const item of localUnsyncedItems) {
        await syncItem(item);
      }
      
      // Update local storage with all items (remote + any remaining local)
      const updatedLocalItems = await loadUpdatedItems();
      setItems(updatedLocalItems);
      await saveItemsToLocal(updatedLocalItems);
    } catch (error) {
      console.error('Error syncing with remote:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Helper to get the most up-to-date items
  const loadUpdatedItems = async () => {
    try {
      // Get all items from Supabase
      const { data: remoteItems, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Format remote items
      const formattedRemoteItems = remoteItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        rating: item.rating,
        imageUri: item.image_url,
        user_id: item.user_id,
        created_at: item.created_at,
        synced: true
      }));
      
      // Get IDs of remote items
      const remoteIds = remoteItems.map(item => item.id);
      
      // Keep local items that don't exist remotely (still being synced)
      const localOnlyItems = items.filter(item => 
        item.id.startsWith('local-') && !remoteIds.includes(item.id)
      );
      
      // Combine remote and local-only items
      return [...formattedRemoteItems, ...localOnlyItems];
    } catch (error) {
      console.error('Error loading updated items:', error);
      return items; // Return current items if there's an error
    }
  };

  // Delete an item
  const deleteItem = async (itemId) => {
    try {
      setLoading(true);
      
      // Remove locally first
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      await saveItemsToLocal(updatedItems);
      
      // If it's a remote item (not local-only), delete from Supabase
      if (!itemId.startsWith('local-')) {
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', itemId);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an item
  const updateItem = async (itemId, updatedData) => {
    try {
      setLoading(true);
      
      // Update locally first
      const itemToUpdate = items.find(item => item.id === itemId);
      if (!itemToUpdate) throw new Error('Item not found');
      
      const updatedItem = { ...itemToUpdate, ...updatedData, synced: false };
      const updatedItems = items.map(item => 
        item.id === itemId ? updatedItem : item
      );
      
      setItems(updatedItems);
      await saveItemsToLocal(updatedItems);
      
      // Try to sync the updated item
      await syncItem(updatedItem);
      
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemContext.Provider 
      value={{ 
        items, 
        loading, 
        syncing,
        addItem, 
        deleteItem, 
        updateItem, 
        syncWithRemote 
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  return useContext(ItemContext);
};