import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
function Children({ children }) {
  return (
    <View style={styles.childrenContainer}>
      {children.map((child) => (
        <View style={styles.childrenBox}>
          <Image
            style={{ width: 80, height: 80, resizeMode: "contain" }}
            source={{
              uri: child.photo_link,
            }}
          />
          <Text>{child.first_name}</Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  childrenContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  childrenBox: {
    margin: 10,
    alignItems: "center",
  },
});

export default Children;
