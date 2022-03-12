
import { StyleSheet, StatusBar } from "react-native";
import Tabs from "./navigation/Tabs";
import RootStackScreen from "./screens/RootStackScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthContext } from "./screens/AuthContext";
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

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
    <AuthContext.Provider value={{ user, setUser }}>
      {user.accessToken ? (
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      ) : (
        <PaperProvider>
          <NavigationContainer>
            <StatusBar backgroundColor="#009387" barStyle="light-content" />
            <RootStackScreen />
          </NavigationContainer>
        </PaperProvider>
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
