import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { useEffect, useState, useContext } from "react";
import Children from "../components/Children";
import { AuthContext } from "../Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ChildCalendar from "../components/ChildCalendar";
export default function ParentScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [isUpload, setUpload] = useState(false);
  const childInfo = { child_id: "0b0b78ec-d179-42ec-ba05-21b8b22be349" };
  const accessToken = "11";
  const submitChild = () => {
    setChildEditModal(!childEditModal);
  };

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

  let currentDate = new Date();
  currentDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear().toString().slice(-2)}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>שלום יונתן</Text>
      </View>

      <View style={styles.footer}>
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
        </View>
        <View style={{ flex: 1, width: "90%" }}>
          <View
            style={{
              borderColor: "black",
              borderWidth: 1,
              backgroundColor: " #b3fff0",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              החלף תמונה
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={() => takePhotoFromCamera()}
                style={{ width: "48%" }}
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
                style={{ marginTop: 15, marginBottom: 15, width: "48%" }}
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
          </View>

          <ChildCalendar childInfo={childInfo} accessToken={accessToken} />
        </View>
        <Text onPress={() => setUser({})}>התנתקות</Text>
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
    alignItems: "center",
    flex: 6,
    backgroundColor: "#e3fff5",
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
