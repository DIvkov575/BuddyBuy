import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './AuthContext';
import { ItemProvider } from './ItemContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ItemProvider>
    </AuthProvider>
  );
}
