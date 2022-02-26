import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { useEffect, useState, useContext } from "react";
import Children from "../components/Children";
import { AuthContext } from "./AuthContext";
export default function HomeScreen() {
  const [children, setChildren] = useState([]);
  const [teacher, setTeacher] = useState();
  const {user, setUser} = useContext(AuthContext);
  useEffect(() => {
    // var requestOptions = {
    //   method: "GET",
    //   redirect: "follow",
    // };

    // fetch(
    //   "https://57o33wv6q6.execute-api.us-east-1.amazonaws.com/dev/kindergarten-mock",
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     setChildren(result.children);
    //   })
    //   .catch((error) => console.log("error", error));
      var myHeaders = new Headers();
myHeaders.append("Authorization", user.accessToken);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

  fetch("https://api.kindergartenil.com/teacher", requestOptions)
  .then(response => response.json())
  .then(result => {
    setUser({...result, accessToken: user.accessToken});
  })
  .catch(error => console.log('error2', error));
  
      
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>גן רימון</Text>
        <Image
          style={{ width: 80, height: 80 }}
          source={{
            uri: "https://st2.depositphotos.com/1472273/8613/v/950/depositphotos_86130252-stock-illustration-multicolor-kindergarten-logo.jpg",
          }}
        />
        <Text style={{ paddingTop: 20, ...styles.h2 }}>הגננת {user? user.first_name: "..."}</Text>
      </View>
      <Children children={children} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#cc6666",
    width: "100%",
    alignItems: "center",
    padding: 30,
    paddingTop: 50,
    paddingBottom: 10,
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
