import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./SplashScreen";
import SignUpScreen from "./SignUpScreen";
import SignInScreen from "./SignInScreen";
import SignUpScreenParent from "./SignUpScreenParent";

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation, setUser }) => (
  <RootStack.Navigator screenOptions={{ headerMode: false }}>
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
    <RootStack.Screen name="SignUpParent" component={SignUpScreenParent} />
  </RootStack.Navigator>
);

export default RootStackScreen;
