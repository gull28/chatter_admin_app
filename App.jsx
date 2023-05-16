import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {LandingPage} from './imports/client/LandingPage/LandingPage';
import {LoginPage} from './imports/client/LoginPage/LoginPage';
import {RegisterPage} from './imports/client/RegisterPage/RegisterPage';
import Toast from 'react-native-toast-message';
// npx react-native start
// npx react-native run-android

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerBackVisible: false}}>
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RegisterPage"
            component={RegisterPage}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};
export default App;
