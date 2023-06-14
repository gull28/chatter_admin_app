import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {LandingPage} from './imports/client/LandingPage/LandingPage';
import {LoginPage} from './imports/client/LoginPage/LoginPage';
import {RegisterPage} from './imports/client/RegisterPage/RegisterPage';
import Toast from 'react-native-toast-message';
import {ReportPage} from './imports/client/ReportPage/ReportPage';
import {ProfilePage} from './imports/client/ProfilePage/ProfilePage';
import {MenuPage} from './imports/client/MenuPage/MenuPage';
import {DeleteAccountPage} from './imports/client/DeleteAccountPage/DeleteAccountPage';

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
          <Stack.Screen
            name="MenuPage"
            component={MenuPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ReportPage"
            component={ReportPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProfilePage"
            component={DeleteAccountPage}
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
