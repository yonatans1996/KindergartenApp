import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { AuthContext } from "../Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
const Groups = () => {
  const { user, setUser, getChildren } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showNewGroupInput, setShowGroupInput] = useState(false);
  const [showDeleteInput, setShowDeleteInput] = useState(false);

  const updateTeacherGroupInDB = (groupName) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      group_name: groupName,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://api.kindergartenil.com/teacher/update_group_name",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Teacher group updated in DB. ", result);
        getChildren();
      })
      .catch((error) =>
        console.log("error updating teacher group in DB: ", error)
      );
  };

  const addNewGroup = () => {
    if (groupName.length < 1) {
      setShowGroupInput(false);
      return;
    }
    let tempGroups = [...groups];
    let lastElement1 = tempGroups.pop();
    let lastElement2 = tempGroups.pop();
    tempGroups.push(
      { label: groupName, value: groupName },
      lastElement1,
      lastElement2
    );
    alert("הקבוצה " + groupName + " נוספה בהצלחה");
    setGroups(tempGroups);
    addGroupToDB(groupName);
    setGroupName("");
    setShowGroupInput(false);
  };

  const deleteGroup = () => {
    if (groupName === "Main Group" || groupName === user.group_name) {
      setShowDeleteInput(false);
      alert("לא ניתן למחוק קבוצה שיש בה ילדים או גננות");
      setGroupName("");
      return;
    }
    let found = false;
    let tempGroups = [...groups];
    let lastElement1 = tempGroups.pop();
    let lastElement2 = tempGroups.pop();

    tempGroups = tempGroups.filter((group) => {
      if (group.value !== groupName) {
        return true;
      }
      found = true;
      return false;
    });
    if (found == false) {
      alert("שם הקבוצה לא נמצא");
    } else {
      tempGroups.push(lastElement1, lastElement2);
      setGroups(tempGroups);
      deleteGroupFromDB(groupName);
      alert("הקבוצה " + groupName + " נמחקה בהצלחה");
    }
    setGroupName("");
    setShowDeleteInput(false);
  };

  const addGroupToDB = (groupName) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      group_name: groupName,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/groups", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Group added. " + result);
        fetchGroups();
      })
      .catch((error) => console.log("Group added error: ", error));
  };

  const deleteGroupFromDB = (groupName) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.accessToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      group_name: groupName,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/groups/delete", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Group deleted: ", result);
        fetchGroups();
      })
      .catch((error) => console.log("deleting gorup error: ", error));
  };

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
    console.log("Groups = ", groups);

    let groupsArr = [];
    groups.forEach((group) => groupsArr.push({ label: group, value: group }));
    groupsArr.push({ label: "הוספת קבוצה חדשה", value: "addGroup" });
    groupsArr.push({ label: "מחיקת קבוצה מהגן", value: "deleteGroup" });
    setGroups(groupsArr);
  };

  useEffect(() => {
    fetchGroups();
    console.log("Groups added.");
  }, []);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={groups}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="החלפת קבוצה בגן"
        searchPlaceholder="חיפוש..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
        }}
        onChange={(item) => {
          setIsFocus(false);
          if (item.value === "addGroup") {
            setShowGroupInput(true);
            setShowDeleteInput(false);
          } else if (item.value === "deleteGroup") {
            setShowDeleteInput(true);
            setShowGroupInput(false);
          } else {
            setShowGroupInput(false);
            setShowDeleteInput(false);
            updateTeacherGroupInDB(item.label);
            setUser({ ...user, group_name: item.value });
          }
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="team"
            size={20}
          />
        )}
      />
      {showNewGroupInput ? (
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 5,
            marginTop: 15,
          }}
        >
          <TextInput
            style={{
              direction: "rtl",
              textAlign: "right",
              flex: 1,
              backgroundColor: "#fff",
            }}
            direction="rtl"
            textAlign="right"
            placeholder="שם קבוצה"
            value={groupName}
            onChangeText={(name) => setGroupName(name)}
          />
          <TouchableOpacity onPress={() => addNewGroup()}>
            <Ionicons name="add-circle" color="green" size={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowGroupInput(false)}>
            <Ionicons name="close-circle" color="red" size={40} />
          </TouchableOpacity>
        </View>
      ) : null}
      {showDeleteInput ? (
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 5,
            marginTop: 15,
          }}
        >
          <TextInput
            style={{
              direction: "rtl",
              textAlign: "right",
              flex: 1,
              backgroundColor: "#fff",
            }}
            direction="rtl"
            textAlign="right"
            placeholder="שם הקבוצה למחיקה"
            value={groupName}
            onChangeText={(name) => setGroupName(name)}
          />
          <TouchableOpacity onPress={() => deleteGroup()}>
            <Ionicons name="add-circle" color="green" size={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDeleteInput(false)}>
            <Ionicons name="close-circle" color="red" size={40} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default Groups;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
