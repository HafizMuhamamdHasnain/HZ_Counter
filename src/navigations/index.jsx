import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import SingUp from '../screens/Singup';
import Landing from '../screens/Landing';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="SingUp"
            component={SingUp}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Landing"
            component={Landing}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppNavigation;
