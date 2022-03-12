import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as FileSystem from 'expo-file-system';
import base64 from 'react-native-base64'
import axios from "axios"
export default function AddChildModal({
  childEditModal,
  setChildEditModal,
  accessToken,
  getChildren,
  childInfo,
}) {
  const [image, setImage] = useState(null);
  const submitChild = () => {
    setChildEditModal(!childEditModal);
  };
  const takePhotoFromCamera = async () => {
    let image = await ImagePicker.launchCameraAsync({ mediaTypes: "Images", quality:0.3 });

    // console.log("image = ", image);
    setImage(image);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let s3Url = await fetch(
      "https://api.kindergartenil.com/child/upload_photo_link?child_id=" +
        childInfo.child_id,
      requestOptions
    )
      .then((response) => response.text())
      .catch((error) => console.log("error getting s3 link. ", error));
      s3Url = s3Url.replace('"', '');
      s3Url = s3Url.replace('"', '');
      console.log("s3 link = ",s3Url)
      const imageBody = await getBlob(image.uri)
      var requestOptions = {
        method: 'PUT',
        body: imageBody,
        headers:{'Content-Type': ''}
      };
      
      fetch(s3Url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
  };

  const getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
};

  const takePhotoFromGallery = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
    });
    console.log("image = ", image);
    setImage(image);
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
    console.log("child modal open of = ", childInfo);
    setImage(childInfo.photo_link);
  }, []);
  return (
    <KeyboardAvoidingView behavior={"height"} enabled style={styles.container}>
      <ImageBackground
        style={{ width: 80, height: 80, resizeMode: "cover" }}
        imageStyle={{ borderRadius: 10 }}
        source={{
          uri: image
            ? image.uri
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
        }}
      >
        {/* <View style={{flex:1, justifyContent:"center", alignItems: "center"}}>
        <FontAwesomeIcon icon={faCamera} style={{ borderColor:"#fff", opacity: 0.8}} color="#fff" size={35} />
        </View> */}
      </ImageBackground>

      {image && (
        <Image source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />
      )}
      <Text style={{ color: "white", fontSize: 20 }}>
        {childInfo.first_name} {childInfo.last_name}
      </Text>

      <View style={styles.button}>
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
      </View>
      <View style={styles.button}>
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
      </View>
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
