import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../AuthContext';

// Screens
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddItemScreen from '../screens/AddItemScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  // If app is loading auth status, show nothing
  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Authenticated screens
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: 'BuddyBuy',
                headerShown: false
              }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen 
              name="AddItem" 
              component={AddItemScreen} 
              options={({ route }) => ({ 
                title: route.params?.item ? 'Edit Item' : 'Add New Item',
                headerStyle: {
                  backgroundColor: '#2E86C1',
                },
                headerTintColor: '#fff',
              })}
            />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;