import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, StatusBar } from 'react-native';
import SearchPage from './SearchPage';
import ConnectedPage from './ConnectedPage';

export type RootStackParamList = {
  Search: undefined;
  Connected: { deviceId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const APP_BACKGROUND = '#fcf9f9ff';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: APP_BACKGROUND,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar backgroundColor={APP_BACKGROUND} barStyle="dark-content" />
        
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="Search" component={SearchPage} />
            <Stack.Screen name="Connected" component={ConnectedPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
});

