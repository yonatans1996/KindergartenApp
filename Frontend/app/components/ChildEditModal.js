import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as mime from "react-native-mime-types";
import * as ImageManipulator from "expo-image-manipulator";
import ChildCalendar from "./ChildCalendar";
export default function AddChildModal({
  childEditModal,
  setChildEditModal,
  accessToken,
  getChildren,
  childInfo,
}) {
  const [image, setImage] = useState(null);
  const [isUpload, setUpload] = useState(false);

  const submitChild = () => {
    setChildEditModal(!childEditModal);
  };

  const deleteConfirmationAlert = () =>
    Alert.alert("האם למחוק ילד/ה?", "פעולה זו אינה הפיכה", [
      {
        text: "לא",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "כן", onPress: () => deleteChild() },
    ]);
  //UIImagePickerControllerQualityType.IFrame1280x720
  const takePhotoFromCamera = async () => {
    let image = await ImagePicker.launchCameraAsync({
      mediaTypes: "Images",
      quality: 0.1,
      aspect: [4, 4],
      allowsEditing: true,
    });

    console.log("image = ", image);
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: "jpeg" }
    );
    console.log("new image = ", resizedPhoto);
    setImage(resizedPhoto);
  };

  const uploadToS3 = async () => {
    setUpload(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let s3Param = await fetch(
      "https://api.kindergartenil.com/child/upload_photo_link?child_id=" +
        childInfo.child_id,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log("error getting s3 link. ", error));

    console.log("s3 link = ", s3Param.url);

    var formdata = new FormData();
    formdata.append("key", s3Param.fields.key);
    formdata.append("AWSAccessKeyId", s3Param.fields.AWSAccessKeyId);
    formdata.append("policy", s3Param.fields.policy);
    formdata.append("signature", s3Param.fields.signature);
    const newImageUri = "file:///" + image.uri.split("file:/").join("");
    formdata.append("file", {
      uri: newImageUri,
      type: mime.lookup(newImageUri),
      name: newImageUri.split("/").pop(),
    });
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      body: formdata,
    };

    fetch("https://kindergarten-photos.s3.amazonaws.com/", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("uploaded image to s3. " + result);
        setTimeout(() => {
          setUpload(false);
          setImage(false);
        }, 2000);
        getChildren();
      })
      .catch((error) => console.log("error", error));
  };

  const takePhotoFromGallery = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      quality: 0.1,
      aspect: [4, 4],
      allowsEditing: true,
    });
    console.log("image = ", image);
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: "jpeg" }
    );
    console.log("new image = ", resizedPhoto);
    setImage(resizedPhoto);
  };

  const deleteChild = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id: childInfo.child_id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.kindergartenil.com/children/delete", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Deleted child successfully", result);
        getChildren();
        setChildEditModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    console.log("child modal open of = ", childInfo);
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        {image && !image.cancelled ? (
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity onPress={() => uploadToS3()}>
              <Feather name="check-circle" color="green" size={80} />
            </TouchableOpacity>
            <ImageBackground
              style={{
                width: 150,
                height: 150,
                resizeMode: "cover",
                display: "flex",
                justifyContent: "flex-start",
              }}
              imageStyle={{ borderRadius: 10 }}
              source={{
                uri: image.uri,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  backgroundColor: "rgba(193, 193, 193, 0.61)",
                }}
              >
                נא לאשר את שינוי התמונה
              </Text>
            </ImageBackground>

            <TouchableOpacity onPress={() => setImage(null)}>
              <Feather name="x-circle" color="red" size={80} />
            </TouchableOpacity>
          </View>
        ) : (
          <ImageBackground
            style={{ width: 150, height: 150, resizeMode: "cover" }}
            imageStyle={{ borderRadius: 10 }}
            source={{
              uri: childInfo.photo_link
                ? childInfo.photo_link
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
            }}
          ></ImageBackground>
        )}
        {isUpload && (
          <ActivityIndicator
            size="large"
            color="#08d4c4"
            animating={isUpload}
          />
        )}
        <Text style={{ color: "white", fontSize: 20 }}>
          {childInfo.first_name} {childInfo.last_name}
        </Text>
        {/* <Text style={{ color: "white", fontSize: 16 }}>
          קבוצה: {childInfo.group_name}
        </Text> */}
      </View>
      <View style={{ flex: 1, width: "90%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => takePhotoFromCamera()}
            style={{ marginTop: 15, flex: 1, marginLeft: 10, marginRight: 10 }}
          >
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={{ borderRadius: 30 }}
            >
              <Text
                style={[
                  styles.textSign,
                  { color: "white", textAlign: "center", padding: 10 },
                ]}
              >
                צלם תמונה
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => takePhotoFromGallery()}
            style={{ marginTop: 15, flex: 1, marginLeft: 10, marginRight: 10 }}
          >
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={{ borderRadius: 30 }}
            >
              <Text
                style={[
                  styles.textSign,
                  { color: "white", textAlign: "center", padding: 10 },
                ]}
              >
                בחר תמונה מגלריה
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => deleteConfirmationAlert()}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          <LinearGradient
            colors={["#e33232", "#e86868"]}
            style={{ borderRadius: 30 }}
          >
            <Text
              style={[
                styles.textSign,
                { color: "white", textAlign: "center", padding: 10 },
              ]}
            >
              מחיקת הילד/ה מהגן
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View>
          {(childInfo.parent1_phone_number != "" ||
            childInfo.parent2_phone_number != "") && (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 18,
                marginTop: -10,
                fontWeight: "bold",
              }}
            >
              מספרי טלפון של הורים
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {childInfo.parent1_phone_number ? (
                <>
                  <Text
                    style={{ color: "white" }}
                    onPress={() =>
                      Linking.openURL("tel://" + childInfo.parent1_phone_number)
                    }
                  >
                    {"0" + childInfo.parent1_phone_number.slice(4)}
                  </Text>
                  <Feather name="phone" color="#08d4c4" size={20} />
                </>
              ) : null}
            </View>
            <View style={{ flexDirection: "row" }}>
              {childInfo.parent2_phone_number ? (
                <>
                  <Text
                    style={{ color: "white" }}
                    onPress={() =>
                      Linking.openURL("tel://" + childInfo.parent2_phone_number)
                    }
                  >
                    {"0" + childInfo.parent2_phone_number.slice(4)}
                  </Text>
                  <Feather name="phone" color="#08d4c4" size={20} />
                </>
              ) : null}
            </View>
          </View>
        </View>
        <ChildCalendar childInfo={childInfo} accessToken={accessToken} />
      </View>

      {/* <View style={styles.button}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => takePhotoFromCamera()}
        >
          <LinearGradient colors={["#08d4c4", "#01ab9d"]} style={styles.signIn}>
            <Text
              style={[styles.textSign, { color: "white", textAlign: "center" }]}
            >
              צלם תמונה
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View> */}
      {/* <View style={styles.button}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => takePhotoFromGallery()}
        >
          <LinearGradient colors={["#08d4c4", "#01ab9d"]} style={styles.signIn}>
            <Text
              style={[styles.textSign, { color: "white", textAlign: "center" }]}
            >
              {" "}
              בחר תמונה מגלריה
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View> */}
      {/* <View style={styles.buttons}>
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
      </View> */}
    </View>
  );
}
const windowDimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#789c8a",
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
    fontSize: 13,
    fontWeight: "bold",
  },
});
