import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay={true}
        loop={true}
        style={{
          backgroundColor: "#fff",
        }}
        source={require("../Lotties/coming-soon-chat-pop-up.json")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
