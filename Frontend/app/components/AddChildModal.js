import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { faUser, faUsers, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as Animatable from "react-native-animatable";
import ChildGroups from "./ChildGroups";
import * as Contacts from "expo-contacts";
import ContactsDropDown from "./ContactsDropdown";

export default function AddChildModal({
  setModalVisible,
  modalVisible,
  accessToken,
  getChildren,
  teacherGroup,
  fetchGroups,
}) {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    parent1Phone: false,
    parent2Phone: false,
  });
  const [selectedGroup, setGroup] = useState(teacherGroup);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [rawContacts, setRawContacts] = useState([]);
  const [selectedPhone1, setSelectedPhone1] = useState();
  const [selectedPhone2, setSelectedPhone2] = useState();
  const [phone1Id, setPhone1Id] = useState();
  const [phone2Id, setPhone2Id] = useState();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phone1Ref = useRef();
  const phone2Ref = useRef();

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
      group_name: selectedGroup,
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
    fetchGroups().then((groups) => setGroups(groups));
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        let { data } = await Contacts.getContactsAsync();

        console.log("before = ", data.length);
        data = data.filter(
          (obj) =>
            obj.firstName && obj.phoneNumbers && obj.phoneNumbers.length > 0
        );
        console.log("after = ", data.length);

        if (data.length > 0) {
          let contacts = data.map((obj) => {
            return { label: obj.firstName, value: obj.id };
          });

          setRawContacts(data);
          setContacts(contacts);
        }
      }
    })();
  }, []);

  useEffect(() => {
    console.log("id = ", phone1Id);
    let contact = rawContacts.filter((contact) => contact.id === phone1Id)[0];
    console.log(contact);
    if (contact) {
      setData((prevState) => {
        return { ...prevState, parent1Phone: contact.phoneNumbers[0].number };
      });
    }
  }, [phone1Id]);

  useEffect(() => {
    console.log("id = ", phone1Id);
    let contact = rawContacts.filter((contact) => contact.id === phone2Id)[0];
    console.log(contact);
    if (contact) {
      setData((prevState) => {
        return { ...prevState, parent2Phone: contact.phoneNumbers[0].number };
      });
    }
  }, [phone2Id]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.modal}>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
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
              onChangeText={(val) => setData({ ...data, firstName: val })}
            />
            <FontAwesomeIcon
              icon={faUser}
              color="#05375a"
              size={20}
              onPress={() => firstNameRef.current.focus()}
            />
          </View>
          <Text
            style={[{ marginTop: 35 }, styles.text_footer]}
            onPress={() => lastNameRef.current.focus()}
          >
            שם משפחה
          </Text>
          <View style={styles.action}>
            <TextInput
              ref={lastNameRef}
              placeholder=""
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => setData({ ...data, lastName: val })}
            />
            <FontAwesomeIcon
              icon={faUsers}
              color="#05375a"
              size={20}
              onPress={() => lastNameRef.current.focus()}
            />
          </View>
          <Text
            style={[{ marginTop: 35 }, styles.text_footer]}
            onPress={() => phone1Ref.current.focus()}
          >
            טלפון הורה 1
          </Text>
          <ContactsDropDown
            contacts={contacts}
            value={selectedPhone1}
            setValue={setSelectedPhone1}
            setId={setPhone1Id}
          />
          <View style={styles.action}>
            <TextInput
              keyboardType="phone-pad"
              placeholder=""
              ref={phone1Ref}
              style={styles.textInput}
              autoCapitalize="none"
              value={data.parent1Phone}
              onChangeText={(val) => setData({ ...data, parent1Phone: val })}
              maxLength={20}
            />
            <FontAwesomeIcon
              icon={faPhone}
              color="#05375a"
              size={20}
              onPress={() => phone1Ref.current.focus()}
            />
          </View>
          <Text
            style={[{ marginTop: 35 }, styles.text_footer]}
            onPress={() => phone2Ref.current.focus()}
          >
            טלפון הורה 2
          </Text>
          <ContactsDropDown
            contacts={contacts}
            value={selectedPhone2}
            setValue={setSelectedPhone2}
            setId={setPhone2Id}
          />
          <View style={styles.action}>
            <TextInput
              ref={phone2Ref}
              keyboardType="phone-pad"
              placeholder=""
              style={styles.textInput}
              autoCapitalize="none"
              value={data.parent2Phone}
              onChangeText={(val) => setData({ ...data, parent2Phone: val })}
              maxLength={20}
            />
            <FontAwesomeIcon
              icon={faPhone}
              color="#05375a"
              size={20}
              onPress={() => phone2Ref.current.focus()}
            />
          </View>
          <Text style={[{ marginTop: 35 }, styles.text_footer]}>
            קבוצת הילד/ה
          </Text>
          <ChildGroups
            value={selectedGroup}
            setValue={setGroup}
            groups={groups}
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <View
                style={[styles.signIn, { borderWidth: 2, borderColor: "red" }]}
              >
                <Text style={[styles.textSign, { color: "red" }]}>ביטול</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => submitChild()}
            >
              <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                style={styles.signIn}
              >
                <Text style={[styles.textSign, { color: "white" }]}>הוספה</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    // justifyContent: "center",

    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    marginTop: 10,
    width: windowDimensions.width - 10,
    height: windowDimensions.height - 20,
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
