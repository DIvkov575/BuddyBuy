import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BuddyBuy</Text>
      
      <Text style={styles.userInfo}>
        Logged in as: {user?.email}
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Items')}
      >
        <Text style={styles.buttonText}>View My Items</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E86C1',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#E74C3C',
    marginTop: 20,
  },
});

export default HomeScreen;