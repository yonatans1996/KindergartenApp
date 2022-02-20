import { StyleSheet, Text, View } from "react-native";
import Tabs from "./navigation/Tabs";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as AWS from "aws-sdk/global";
import md5 from "react-native-md5";
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
export default function App() {
  const [user, setUser] = useState({ id: "123" });
  var cognitoUser = {};
  var poolData = {
    UserPoolId: "us-east-1_xVUdvWsda", // Your user pool id here
    ClientId: "1tstgcmlboes6e6kbcj3fae4s1", // Your client id here
  };
  var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
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

  const createUser = (fname, lname, email, phone, password) => {
    password = md5.hex_md5(password);
    phone = `+972${phone.slice(1, phone.length)}`;
    var attributeList = [];

    var dataEmail = {
      Name: "email",
      Value: email,
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );

    const dataUser = {
      Name: "name",
      Value: fname,
    };
    const dataLname = {
      Name: "family_name",
      Value: lname,
    };

    attributeList.push(attributeEmail);
    attributeList.push(dataUser);
    attributeList.push(dataLname);
    userPool.signUp(
      phone,
      password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          console.log(JSON.stringify(err));
          alert(err.message || JSON.stringify(err));
          return;
        }
        cognitoUser = result.user;
        console.log("user name is " + JSON.stringify(cognitoUser));
      }
    );
  };

  useEffect(() => {
    // var authenticationData = {
    // 	Username: '+972547972636',
    // 	Password: '123456',
    // };
    // var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    // 	authenticationData
    // );
    // var userData = {
    // 	Username: '+972547972636',
    // 	Pool: userPool,
    // };
    // var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    // cognitoUser.authenticateUser(authenticationDetails, {
    // 	onSuccess: function(result) {
    // 		var accessToken = result.getAccessToken().getJwtToken();
    // 		console.log(JSON.stringify(result));
    // 		//POTENTIAL: Region needs to be set if not already set previously elsewhere.
    // 		AWS.config.region = 'us-east-1';
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // 	IdentityPoolId: 'us-east-1_xVUdvWsda', // your identity pool id here
    // 	Logins: {
    // 		// Change the key below according to the specific region your user pool is in.
    // 		'cognito-idp.us-east-1.amazonaws.com/xVUdvWsda': result
    // 			.getIdToken()
    // 			.getJwtToken(),
    // 	},
    // });
    //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
    // 			AWS.config.credentials.refresh(error => {
    // 				if (error) {
    // 					console.error(error);
    // 				} else {
    // 					// Instantiate aws sdk service objects now that the credentials have been updated.
    // 					// example: var s3 = new AWS.S3();
    // 					console.log('Successfully logged!');
    // 				}
    // 			});
    // 		},
    // 		onFailure: function(err) {
    // 			alert(err.message || JSON.stringify(err));
    // 			console.log(JSON.stringify(err))
    // 		},
    // 	});
  }, []);

  return (
    <>
      {user.id ? (
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      ) : (
        <Login acceptSms={acceptSms} />
      )}
    </>
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
