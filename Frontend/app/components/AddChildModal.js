import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { faUser, faUsers, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as Animatable from "react-native-animatable";

export default function AddChildModal({
  setModalVisible,
  modalVisible,
  accessToken,
  getChildren,
}) {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    parent1Phone: false,
    parent2Phone: false,
  });

  const submitChild = () => {
    console.log("access token = ", accessToken);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      parent1_phone_number: data.parent1Phone,
      parent2_phone_number: data.parent2Phone,
      group_name: "קטנטנים",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/children", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        getChildren();
      })
      .catch((error) => console.log("error", error));
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    // console.log(Dimensions.get("window"));
  }, []);
  return (
    <KeyboardAvoidingView behavior={"height"} enabled style={styles.container}>
      <View style={styles.modal}>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <ScrollView>
            <Text style={styles.text_footer}>שם פרטי</Text>
            <View style={styles.action}>
              <FontAwesomeIcon icon={faUser} color="#05375a" size={20} />
              <TextInput
                placeholder=""
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setData({ ...data, firstName: val })}
              />
            </View>
            <Text style={[{ marginTop: 35 }, styles.text_footer]}>
              שם משפחה
            </Text>
            <View style={styles.action}>
              <FontAwesomeIcon icon={faUsers} color="#05375a" size={20} />
              <TextInput
                placeholder=""
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setData({ ...data, lastName: val })}
              />
            </View>
            <Text style={[{ marginTop: 35 }, styles.text_footer]}>
              טלפון הורה 1
            </Text>
            <View style={styles.action}>
              <FontAwesomeIcon icon={faPhone} color="#05375a" size={20} />
              <TextInput
                keyboardType="phone-pad"
                placeholder=""
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setData({ ...data, parent1Phone: val })}
                maxLength={10}
              />
            </View>
            <Text style={[{ marginTop: 35 }, styles.text_footer]}>
              טלפון הורה 2
            </Text>
            <View style={styles.action}>
              <FontAwesomeIcon icon={faPhone} color="#05375a" size={20} />
              <TextInput
                keyboardType="phone-pad"
                placeholder=""
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setData({ ...data, parent2Phone: val })}
                maxLength={10}
              />
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => submitChild()}
              >
                <LinearGradient
                  colors={["#08d4c4", "#01ab9d"]}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, { color: "white" }]}>
                    הוספה
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <View
                  style={[
                    styles.signIn,
                    { borderWidth: 2, borderColor: "red" },
                  ]}
                >
                  <Text style={[styles.textSign, { color: "red" }]}>ביטול</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    </KeyboardAvoidingView>
  );
}
const windowDimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: windowDimensions.width - 50,
    height: windowDimensions.height * 0.63,
    position: "absolute",
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
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  buttons: {
    justifyContent: "space-around",
    flexDirection: "row-reverse",
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
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 20,
    width: 100,
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
