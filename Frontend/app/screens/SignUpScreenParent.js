import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useState, useContext } from "react";
import React, { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  faUser,
  faUsers,
  faLock,
  faPhone,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import md5 from "react-native-md5";
import { AuthContext } from "../Context/AuthContext";
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

export default function SignUpScreenParent({ navigation }) {
  const [checked, setChecked] = React.useState("first");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneRef = useRef();
  const passRef = useRef();
  const [data, setData] = useState({
    email: "",
    password: "",
    checkPassword: false,
    checkFirstName: false,
    checkLastName: false,
    checkPhone: false,
    showPass: false,
    checkKinderName: false,
    firstName: "",
    lastName: "",
    phone: "",
    kinderName: "",
    kindergartenId: "",
    checkKindergartenId: false,
  });
  const { user, setUser } = useContext(AuthContext);
  const firstNameInputChange = (val) => {
    if (val.length > 1) {
      setData({ ...data, firstName: val, checkFirstName: true });
    } else {
      setData({ ...data, firstName: val, checkFirstName: false });
    }
  };
  const lastNameInputChange = (val) => {
    if (val.length > 1) {
      setData({ ...data, lastName: val, checkLastName: true });
    } else {
      setData({ ...data, lastName: val, checkLastName: false });
    }
  };
  const phoneInputChange = (val) => {
    if (String(val).match(/^05[0-9][0-9]{7}$/)) {
      setData({ ...data, phone: val, checkPhone: true });
    } else {
      setData({ ...data, phone: val, checkPhone: false });
    }
  };
  const handlePassword = (val) => {
    setData({ ...data, password: val, checkPassword: val.length > 3 });
  };
  const showPassword = () => {
    setData({ ...data, showPass: !data.showPass });
  };
  const newKindergartenHandle = async (val) => {
    let isKinderId = val.length === 8 ? await isKinderIdExists(val) : false;
    console.log("checked = ", checked);
    setData({ ...data, kindergartenId: val, checkKindergartenId: isKinderId });
  };
  const kinderNameHandle = (val) => {
    let checked = val.length > 1;
    setData({ ...data, kinderName: val, checkKinderName: checked });
  };
  const isKinderIdExists = async (kinderId) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const result = await fetch(
      "https://api.kindergartenil.com/kindergarten/exist?kindergarten_id=" +
        kinderId,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) =>
        console.log("error checking if kindergarten id exists: ", error)
      );
    console.log(result);
    return result;
  };
  const handleRegister = () => {
    if (
      !data.checkFirstName ||
      !data.checkLastName ||
      !data.checkPhone ||
      !data.checkPassword ||
      (checked === "second" && !data.checkKindergartenId) ||
      (checked === "first" && !data.checkKinderName)
    ) {
      Alert.alert("", "אחד או יותר מהשדות לא מלאים כמו שצריך");
      return;
    }

    console.log("registering");
    const hashedPassword = md5.hex_md5(data.password);
    const phoneWithPrefix = `+972${data.phone.slice(1, data.phone.length)}`;
    var poolData = {
      UserPoolId: "us-east-1_PokjeshX3", // Your user pool id here
      ClientId: "36d8opu7j2e9illge6vlfjdu9h", // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    userPool.signUp(phoneWithPrefix, hashedPassword, null, null, (err, res) => {
      if (err) {
        alert(err.message);
        console.log(JSON.stringify(err));
        return;
      }
      Alert.alert("מיד תועברו למסך הראשי", "ההרשמה הושלמה בהצלחה");
      handleSignIn();
    });
  };
  const handleSignIn = () => {
    const hashedPassword = md5.hex_md5(data.password);
    const phoneWithPrefix = `+972${data.phone.slice(1, data.phone.length)}`;
    var authenticationData = {
      Username: phoneWithPrefix,
      Password: hashedPassword,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var poolData = {
      UserPoolId: "us-east-1_PokjeshX3", // Your user pool id here
      ClientId: "36d8opu7j2e9illge6vlfjdu9h", // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: phoneWithPrefix,
      Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        // var accessToken = result.getAccessToken().getJwtToken();
        var accessToken = result.getIdToken().getJwtToken();
        console.log("accesstoken = ", accessToken);
        console.log("login after sign up successfully");
        addTeacherToDB(accessToken);
      },

      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
        console.log(JSON.stringify(err));
      },
    });
  };
  const addTeacherToDB = (accessToken) => {
    console.log("adding teacher to db");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");
    if (checked === "first") {
      data.kindergartenId = null;
    }
    var raw = JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      kindergarten_id: data.kindergartenId,
      group_number: "1",
      kindergarten_name: data.kinderName,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log("raw data = ", raw);

    fetch("https://api.kindergartenil.com/teacher/signup", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("added teacher to db succsessfuly");
        setUser({ accessToken, type: "parent" });
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>ברוכים הבאים!</Text>
      </View>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <ScrollView>
          <Text
            style={styles.text_footer}
            onPress={() => firstNameRef.current.focus()}
          >
            שם פרטי
          </Text>
          <View style={styles.action}>
            <TextInput
              ref={firstNameRef}
              placeholder=""
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => firstNameInputChange(val)}
            />
            {data.checkFirstName ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
            <FontAwesomeIcon
              icon={faUser}
              color="#05375a"
              size={20}
              onPress={() => firstNameRef.current.focus()}
            />
          </View>

          <Text
            style={[{ marginTop: 35 }, styles.text_footer]}
            onPress={() => phoneRef.current.focus()}
          >
            טלפון
          </Text>
          <View style={styles.action}>
            {data.checkPhone ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
            <TextInput
              keyboardType="phone-pad"
              placeholder=""
              style={styles.textInput}
              autoCapitalize="none"
              ref={phoneRef}
              onChangeText={(val) => phoneInputChange(val)}
              maxLength={10}
            />

            <FontAwesomeIcon
              icon={faPhone}
              color="#05375a"
              size={20}
              onPress={() => phoneRef.current.focus()}
            />
          </View>
          <Text
            style={[{ marginTop: 35 }, styles.text_footer]}
            onPress={() => passRef.current.focus()}
          >
            סיסמה
          </Text>
          <View style={styles.action}>
            <Feather
              name={data.showPass ? "eye" : "eye-off"}
              color={data.showPass ? "green" : "gray"}
              size={20}
              onPress={() => showPassword()}
            />
            {data.checkPassword ? (
              <Animatable.View animation="bounceIn">
                <Feather
                  name="check-circle"
                  color="green"
                  size={20}
                  style={{ paddingRight: 5 }}
                />
              </Animatable.View>
            ) : null}
            <TextInput
              placeholder=""
              secureTextEntry={!data.showPass}
              style={styles.textInput}
              autoCapitalize="none"
              ref={passRef}
              onChangeText={(pass) => handlePassword(pass)}
            />
            <FontAwesomeIcon
              icon={faLock}
              color="#05375a"
              size={20}
              onPress={() => passRef.current.focus()}
            />
          </View>
          <View style={[styles.radioBox, { marginTop: 35 }]}></View>
          {checked === "first" && (
            <Animatable.View style={styles.action} animation="slideInUp">
              <TextInput
                placeholder="שם הגן"
                style={[styles.textInput, { marginTop: 0 }]}
                autoCapitalize="none"
                onChangeText={(val) => kinderNameHandle(val)}
              />
              {data.checkKinderName ? (
                <Animatable.View animation="bounceIn">
                  <Feather
                    name="check-circle"
                    color="green"
                    size={20}
                    style={{ paddingLeft: 8 }}
                  />
                </Animatable.View>
              ) : null}
            </Animatable.View>
          )}

          <View style={styles.radioBox}>
            <Text
              onPress={() => setChecked("second")}
              style={styles.text_footer}
            >
              מספר מזהה של הגן
            </Text>
            <RadioButton
              value="first"
              status={checked === "second" ? "checked" : "unchecked"}
              onPress={() => setChecked("second")}
            />
          </View>
          {checked === "second" && (
            <Animatable.View style={styles.action} animation="slideInDown">
              <TextInput
                placeholder="אם לא ידוע לכם, בקשו מהגננת"
                style={[styles.textInput, { marginTop: 0 }]}
                autoCapitalize="none"
                maxLength={8}
                onChangeText={(val) => newKindergartenHandle(val)}
              />
              {data.checkKindergartenId ? (
                <Animatable.View animation="bounceIn">
                  <Feather
                    name="check-circle"
                    color="green"
                    size={20}
                    style={{ paddingLeft: 8 }}
                  />
                </Animatable.View>
              ) : null}
              {data.checkKindergartenId == false &&
              data.kindergartenId.length === 8 ? (
                <Animatable.View animation="bounceIn">
                  <Feather
                    name="x-circle"
                    color="red"
                    size={20}
                    style={{ paddingLeft: 8 }}
                  />
                </Animatable.View>
              ) : null}
            </Animatable.View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRegister()}
          >
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={styles.signIn}
            >
              <Text style={[styles.textSign, { color: "white" }]}>הרשמה</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.singUp}
            onPress={() => navigation.navigate("SignInScreen")}
          >
            <Text style={[styles.textSign, { color: "#009387" }]}>
              התחברות לחשבון קיים
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 6,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 0,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingRight: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  singUp: {
    borderColor: "#009387",
    borderWidth: 1,
    marginTop: 15,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  radioBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
