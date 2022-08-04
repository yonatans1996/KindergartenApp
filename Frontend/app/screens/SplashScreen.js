import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Animatable.Image
          duration={1500}
          animation="bounceIn"
          style={styles.logo}
          resizeMode="stretch"
          source={{
            uri: "https://st2.depositphotos.com/1472273/8613/v/950/depositphotos_86130252-stock-illustration-multicolor-kindergarten-logo.jpg",
          }}
        /> */}
        <LottieView
          autoPlay={true}
          loop={true}
          style={{}}
          source={require("../Lotties/enjoying-the-fun-time.json")}
        />
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.title}>ברוכים הבאים לגן!</Text>
        <Text style={styles.text}>התחברו או הירשמו</Text>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                style={styles.signIn}
              >
                <Text style={styles.textSign}>הרשמה כגננת</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpParent")}
            >
              <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                style={styles.signIn}
              >
                <Text style={styles.textSign}>הרשמה כהורה</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={[styles.button, { width: "100%" }]}>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => navigation.navigate("SignInScreen")}
            >
              <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                style={[styles.signIn, { width: "100%" }]}
              >
                <Text style={styles.textSign}>כניסה</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    </View>
  );
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});
