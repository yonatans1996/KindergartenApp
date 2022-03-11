import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  LogBox,
} from "react-native";
import React from "react";
import { useEffect, useState, useContext } from "react";
import Children from "../components/Children";
import { AuthContext } from "./AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AddChildModal from "../components/AddChildModal";
export default function HomeScreen() {
  const [children, setChildren] = useState([]);
  const [teacher, setTeacher] = useState("...");
  const { user, setUser } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const getChildren = () => {
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
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    getChildren();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/teacher", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("get teacher result = ", result);
        setUser({ ...result, accessToken: user.accessToken });
      })
      .catch((error) => console.log("error2", error));

    fetch("https://api.kindergartenil.com/kindergarten/info", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("get kindergarden info result = ", result);
        setTeacher(result.kindergarten_name);
      })
      .catch((error) => console.log("get kindergarden info error = ", error));
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <AddChildModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          accessToken={user.accessToken}
          getChildren={getChildren}
        />
      </Modal>

      <View style={styles.header}>
        <Text style={styles.h1}>גן {teacher}</Text>
        <Text style={styles.h2}>שלום {user ? user.first_name : "..."}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.swipe}>
          <Ionicons name="swap-vertical" color="black" size={20} />
          <Text>החליקו למעלה לרענון</Text>
        </View>
        <Children
          children={children}
          accessToken={user.accessToken}
          getChildren={getChildren}
        />

        <View style={styles.button}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={styles.signIn}
            >
              <Ionicons name="add" color="#fff" size={20} />
              <Text style={styles.textSign}>הוספת ילד חדש</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text
            style={{ textAlign: "center", paddingTop: 15 }}
            onPress={() => setUser({})}
          >
            התנתקות
          </Text>
        </View>
      </View>
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
    display: "flex",
    flex: 4,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
  swipe: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -15,
    marginBottom: 5,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  h2: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  button: {
    alignItems: "center",
    marginTop: 30,
  },
});
