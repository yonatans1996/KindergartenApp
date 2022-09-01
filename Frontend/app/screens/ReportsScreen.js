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
import * as Linking from "expo-linking";
import { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../Context/AuthContext";
import * as SecureStore from "expo-secure-store";
import MonthPickerModal from "../components/MonthPickerModal";
import * as WebBrowser from "expo-web-browser";
export default function ParentsScreen({ navigation }) {
  const [value, onChange] = useState(null);
  const { user } = useContext(AuthContext);
  const [reportLink, setReportLink] = useState("");

  const generateReport = () => {
    if (!value) {
      console.log("no date");
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const month = value.month() + 1;
    console.log(
      "downloading report url = ",
      "https://api.kindergartenil.com/kindergarten/attendance_spreadsheet?month=" +
        month
    );
    fetch(
      "https://api.kindergartenil.com/kindergarten/attendance_spreadsheet?month=" +
        month,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log("download url = ", result);
        Linking.openURL(result.replace(/['"]+/g, ""));
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>דוחות</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          דוח נוכחות חודשי של הגן
        </Text>
        <MonthPickerModal value={value} onChange={onChange} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => generateReport()}
        >
          <LinearGradient
            colors={value ? ["#08d4c4", "#01ab9d"] : ["#EBEBE4", "#EBEBE4"]}
            style={styles.signIn}
          >
            <Text style={[styles.textSign, { color: "white" }]}>
              הורדת הדוח
            </Text>
          </LinearGradient>
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
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 4,
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
