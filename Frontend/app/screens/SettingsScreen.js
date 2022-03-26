import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import * as Animatable from "react-native-animatable";
import Groups from "../components/Groups";

export default function SettingsScreen() {
  const [kinderInfo, setkinderInfo] = useState({});
  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch("https://api.kindergartenil.com/kindergarten/info", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setkinderInfo(result);
      })
      .catch((error) =>
        console.log("get kindergarden info error in setting screen = ", error)
      );
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
          הגדרות
        </Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text>שם הגן: {kinderInfo.kindergarten_name}</Text>
        <Text>מזהה הגן: {kinderInfo.kindergarten_id}</Text>
        <Text>שם קבוצה: {user.group_name}</Text>
        <Groups />
        <Text
          style={{ textAlign: "center", paddingTop: 15 }}
          onPress={() => setUser({})}
        >
          התנתקות
        </Text>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
    alignItems: "center",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 3,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
});
