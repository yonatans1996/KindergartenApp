import { StyleSheet, StatusBar } from "react-native";
import Tabs from "./navigation/Tabs";
import RootStackScreen from "./screens/RootStackScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthContext } from "./Context/AuthContext";
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

export default function App() {
  const [user, setUser] = useState({});
  const [children, setChildren] = useState([]);
  const [isLoadingChildren, setLoadingChildren] = useState(true);
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

  const getChildren = (newChild = null) => {
    if (newChild) {
      let tempChildren = children.map((child) =>
        child.child_id !== newChild.child_id
          ? child
          : { ...child, is_present: newChild.is_present }
      );
      setChildren(tempChildren);
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    fetch(
      "https://api.kindergartenil.com/kindergarten/group_chidren",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("got all children ");
        setChildren(result);
      })
      .catch((error) => console.log("error getting all children", error))
      .finally(() => setLoadingChildren(false));
  };

  useEffect(() => {}, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        children,
        setChildren,
        getChildren,
        setLoadingChildren,
        isLoadingChildren,
      }}
    >
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
