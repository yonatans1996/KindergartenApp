import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { useEffect, useState, useContext } from "react";
import Children from "../components/Children";
import { AuthContext } from "../Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AddChildModal from "../components/AddChildModal";
import LottieView from "lottie-react-native";
export default function HomeScreen() {
  const [groups, setGroups] = useState([]);
  const [teacher, setTeacher] = useState("...");
  const {
    user,
    setUser,
    children,
    getChildren,
    attendance,
    isLoadingChildren,
    setLoadingChildren,
  } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  let currentDate = new Date();
  currentDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear().toString().slice(-2)}`;
  const fetchGroups = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let groups = await fetch(
      "https://api.kindergartenil.com/groups",
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log("error fetching groups: ", error));
    groups = groups.groups_in_kindergarten;
    setGroups(groups);
    return groups;
  };

  useEffect(() => {
    getChildren();
    fetchGroups();
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
        setUser({ ...result, ...user });
      })
      .catch((error) => console.log("error2", error));

    fetch("https://api.kindergartenil.com/kindergarten/info", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("get kindergarden info result = ", result);
        setTeacher(result.kindergarten_name);
      })
      .catch((error) => console.log("get kindergarden info error = ", error));

    setTimeout(() => console.log("USER OBJECT = ", user), 3000);
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
          teacherGroup={user.group_name}
          getChildren={getChildren}
          fetchGroups={fetchGroups}
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
        {!isLoadingChildren && (
          <View style={styles.date}>
            <Ionicons name="calendar" color="#009387" size={20} />
            <Text> {currentDate}</Text>
            <Text> | נוכחים: {children.length} / </Text>
            <Text>{attendance}</Text>
          </View>
        )}

        {!isLoadingChildren ? (
          <Children
            children={children}
            accessToken={user.accessToken}
            getChildren={getChildren}
          />
        ) : (
          <LottieView
            autoPlay={true}
            loop={true}
            style={{}}
            source={require("../Lotties/loading-saving.json")}
          />
        )}

        <View style={styles.button}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>הוספת ילד חדש</Text>
              <Ionicons name="add" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
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
  date: {
    flexDirection: "row",
    textAlign: "right",
    marginTop: -5,
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
