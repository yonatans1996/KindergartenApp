import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons";
import { faPhone, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { text } from "@fortawesome/fontawesome-svg-core";
import * as AWS from "aws-sdk/global";
import md5 from "react-native-md5";
import Checkbox from "expo-checkbox";
import { AuthContext } from "../Context/AuthContext";
import * as SecureStore from "expo-secure-store";
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

export default function SignInScreen({ navigation }) {
  const [data, setData] = useState({
    phone: "",
    password: "",
    checkPhone: false,
    showPass: false,
  });
  const { user, setUser } = useContext(AuthContext);
  const [rememberUser, setRememberUser] = useState(true);
  const phoneRef = useRef();
  const passRef = useRef();
  const handlePassword = (val) => {
    setData({ ...data, password: val });
  };
  const showPassword = () => {
    setData({ ...data, showPass: !data.showPass });
  };
  const phoneInputChange = (val) => {
    if (String(val).match(/^05[0-9][0-9]{7}$/)) {
      setData({ ...data, phone: val, checkPhone: true });
    } else {
      setData({ ...data, phone: val, checkPhone: false });
    }
  };
  async function saveUserToDevice(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  async function getUserFromDevice(key) {
    return SecureStore.getItemAsync(key);
  }
  async function deleteUserFromDevice(key) {
    let result = await SecureStore.deleteItemAsync(key);
    console.log("Deleted key: ", key, "result: ", result);
  }
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
        var accessToken = result.getIdToken().getJwtToken();
        console.log("accessToken = ", accessToken);
        console.log("REsult = ", JSON.stringify(result));
        setUser({ accessToken });
        if (rememberUser) {
          saveUserToDevice("password", data.password);
        }
        saveUserToDevice("phone", data.phone);
      },

      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
        console.log(JSON.stringify(err));
      },
    });
  };

  useEffect(() => {
    console.log("Rendered SignInScreen");
    getUserFromDevice("password").then((result) => {
      setData((prevState) => {
        return { ...prevState, password: result };
      });
    });
    getUserFromDevice("phone").then((result) =>
      setData((prevState) => {
        return { ...prevState, phone: result };
      })
    );
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>ברוכים השבים!</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text
          style={styles.text_footer}
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
            maxLength={10}
            ref={phoneRef}
            keyboardType="phone-pad"
            placeholder=""
            value={data.phone}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => phoneInputChange(val)}
          />
          <FontAwesomeIcon
            icon={faPhone}
            color="#05375a"
            size={20}
            style={{ marginRight: 5 }}
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
            style={{ paddingRight: 5 }}
            name={data.showPass ? "eye" : "eye-off"}
            color={data.showPass ? "green" : "gray"}
            size={20}
            onPress={() => showPassword()}
          />
          <TextInput
            placeholder=""
            secureTextEntry={!data.showPass}
            value={data.password}
            style={styles.textInput}
            ref={passRef}
            autoCapitalize="none"
            onChangeText={(pass) => handlePassword(pass)}
          />
          <FontAwesomeIcon
            icon={faLock}
            color="#05375a"
            size={20}
            onPress={() => passRef.current.focus()}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Checkbox
            value={rememberUser}
            onValueChange={(val) => {
              setRememberUser(val);
              if (!val) deleteUserFromDevice("password");
            }}
          />
          <Text
            onPress={() => setRememberUser(!rememberUser)}
            style={{
              paddingRight: 5,
            }}
          >
            זכור אותי
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleSignIn()}>
          <LinearGradient colors={["#08d4c4", "#01ab9d"]} style={styles.signIn}>
            <Text style={[styles.textSign, { color: "white" }]}>התחברות</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.singUp}
          onPress={() => navigation.navigate("SignUpScreen")}
        >
          <Text style={[styles.textSign, { color: "#009387" }]}>הרשמה</Text>
        </TouchableOpacity>
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
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
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
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
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
    marginTop: Platform.OS === "ios" ? 0 : -12,
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
});
