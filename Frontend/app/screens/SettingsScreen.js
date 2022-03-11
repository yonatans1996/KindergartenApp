import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

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
        console.log(
          "get kindergarden info result in setting screen = ",
          result
        );
        setkinderInfo(result);
      })
      .catch((error) =>
        console.log("get kindergarden info error in setting screen = ", error)
      );
  }, []);

  return (
    <View style={styles.container}>
      <Text>שם הגן: {kinderInfo.kindergarten_name}</Text>
      <Text>מזהה הגן: {kinderInfo.kindergarten_id}</Text>
      <StatusBar style="auto" />
    </View>
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
