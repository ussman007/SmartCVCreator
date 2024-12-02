import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './src/redux/store';


// Screens
import HomeScreen from './src/screens/HomeScreen';
import TemplateSelectionScreen from './src/screens/TemplateSelectionScreen';
import CVEditorScreen from './src/screens/CVEditorScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import { theme } from './src/utilis/theme';

const Stack = createStackNavigator();

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Smart CV Creator' }}
            />
            <Stack.Screen 
              name="TemplateSelection" 
              component={TemplateSelectionScreen}
              options={{ title: 'Choose Template' }}
            />
            <Stack.Screen 
              name="CVEditor" 
              component={CVEditorScreen}
              options={{ title: 'Create Your CV' }}
            />
            <Stack.Screen 
              name="Preview" 
              component={PreviewScreen}
              options={{ title: 'Preview CV' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;