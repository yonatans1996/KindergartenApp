import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
export default function AddChildModal({
  childEditModal,
  setChildEditModal,
  accessToken,
  getChildren,
  id,
  childrenInfo,
}) {
  const submitChild = () => {
    setChildEditModal(!childEditModal);
  };

  const updateAttendance = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      id: id,
      is_present: !currentStatus,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/attendance", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("child id ", id, " updated successfully");
        getChildren();
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    // console.log("rendered child edit modal");
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", accessToken);
    // var requestOptions = {
    //   method: "GET",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };
    // fetch("https://api.kindergartenil.com/children?id=" + id, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log("child edit got info = ", result);
    //     setChildInfo(result);
    //   })
    //   .catch((error) =>
    //     console.log("child edit info fetch failed. error = ", error)
    //   );
  }, []);
  return (
    <KeyboardAvoidingView behavior={"height"} enabled style={styles.container}>
      <Image
        style={{ width: 80, height: 80, resizeMode: "contain" }}
        source={{
          uri: childInfo.photo_link
            ? childInfo.photo_link
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
        }}
      />
      <Text style={{ color: "white", fontSize: 20 }}>
        {childInfo.first_name}
        {childInfo.last_name}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => submitChild()}>
          <LinearGradient colors={["#08d4c4", "#01ab9d"]} style={styles.signIn}>
            <Text style={[styles.textSign, { color: "white" }]}>הוספה</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => setChildEditModal(!childEditModal)}
        >
          <View style={[styles.signIn, { borderWidth: 2, borderColor: "red" }]}>
            <Text style={[styles.textSign, { color: "red" }]}>ביטול</Text>
          </View>
        </TouchableOpacity>
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
