import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
function Children({ children }) {
  return (
    <View style={styles.childrenContainer}>
      {children &&
        children.map((child) => (
          <View key={child.id} style={styles.childrenBox}>
            <Image
              style={{ width: 80, height: 80, resizeMode: "contain" }}
              source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
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
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  childrenBox: {
    margin: 10,
    alignItems: "center",
  },
});

export default Children;
