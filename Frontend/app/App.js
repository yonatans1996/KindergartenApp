import { StyleSheet, Text, View } from "react-native";
import Tabs from "./navigation/Tabs";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
} from 'amazon-cognito-identity-js';
export default function App() {
  const [user,setUser] = useState({id:""});
  var poolData = {
    UserPoolId: "us-east-1_ZjbeuItjC", // Your user pool id here
    ClientId: '2stjdkn1fmpskfms81355bs3ie', // Your client id here
  };
  var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var attributeList = [];

var dataEmail = {
	Name: 'email',
	Value: 'email@mydomain.com',
};

var dataPhoneNumber = {
	Name: 'phone_number',
	Value: '+15555555555',
};
var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
	dataPhoneNumber
);

const dataUser = {
  Name: "name",
  Value: "yonatan"
}
const dataLname = {
  Name: "family_name",
  Value: "Shtalhaim"
}

attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);
attributeList.push(dataUser);
attributeList.push(dataLname);

var authenticationData = {
	Username: 'test3@gmail.com',
	Password: '123ABCabc!',
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
	authenticationData
);


var userData = {
	Username: 'test3@gmail.com',
	Pool: userPool,
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
	onSuccess: function(result) {
		var accessToken = result.getAccessToken().getJwtToken();

		//POTENTIAL: Region needs to be set if not already set previously elsewhere.
		AWS.config.region = '<region>';

		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1_ZjbeuItjC', // your identity pool id here
			Logins: {
				// Change the key below according to the specific region your user pool is in.
				'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result
					.getIdToken()
					.getJwtToken(),
			},
		});

		//refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
		AWS.config.credentials.refresh(error => {
			if (error) {
				console.error(error);
			} else {
				// Instantiate aws sdk service objects now that the credentials have been updated.
				// example: var s3 = new AWS.S3();
				console.log('Successfully logged!');
			}
		});
	},

	onFailure: function(err) {
		alert(err.message || JSON.stringify(err));
	},
});

// userPool.signUp('test3@gmail.com', '123ABCabc!', attributeList, null, function(
// 	err,
// 	result
// ) {
// 	if (err) {
// 		alert(err.message || JSON.stringify(err));
// 		return;
// 	}
// 	var cognitoUser = result.user;
// 	console.log('user name is ' + JSON.stringify(cognitoUser));
// });
  return (
      <>
    {user.id ? 
      (<NavigationContainer>
        <Tabs />
      </NavigationContainer>): <Login />}
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
