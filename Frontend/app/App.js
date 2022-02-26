import { StyleSheet, Text, View, StatusBar } from "react-native";
import Tabs from "./navigation/Tabs";
import Login from "./screens/Login";
import RootStackScreen from "./screens/RootStackScreen";
import {
  NavigationContainer,
  createDrawerNavigator,
} from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import * as AWS from "aws-sdk/global";
import md5 from "react-native-md5";
import { AuthContext } from "./screens/AuthContext";
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

import RootStack from "./screens/RootStackScreen";
export default function App() {
  const [user, setUser] = useState({});
  var cognitoUser = {};
  var poolData = {
    UserPoolId: "us-east-1_PokjeshX3", // Your user pool id here
    ClientId: "36d8opu7j2e9illge6vlfjdu9h", // Your client id here
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const acceptSms = (sms) => {
    cognitoUser.confirmRegistration(sms, true, function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log("call result: " + result);
    });
  };

  useEffect(() => {}, []);
  return (
    <AuthContext.Provider value={{user, setUser}}>
      {user.accessToken ? (
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      ) : (

          <NavigationContainer>
            <StatusBar backgroundColor="#009387" barStyle="light-content" />
            <RootStackScreen />
          </NavigationContainer>

      )}
      </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
