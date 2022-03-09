import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
const Child = ({ child, handleChildPress }) => (
  <TouchableOpacity
    key={child.id}
    onPress={() => handleChildPress(child.child_id, child.is_present)}
    style={[
      styles.childrenBox,
      { backgroundColor: child.is_present ? "green" : "red" },
    ]}
  >
    <Image
      style={{ width: 80, height: 80, resizeMode: "contain" }}
      source={{
        uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
      }}
    />
    <Text style={{ color: "white" }}>{child.first_name}</Text>
  </TouchableOpacity>
);
function Children({ children, accessToken, getChildren }) {
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    console.log("Render children component");
  }, []);
  const handleChildPress = (id, currentStatus) => {
    setSelectedId(id);
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

  const renderChildren = ({ item }) => (
    <Child child={item} handleChildPress={handleChildPress} />
  );

  return (
    <View style={styles.childrenContainer}>
      {children && (
        <FlatList
          extraData={selectedId}
          contentContainerStyle={styles.flatlist}
          data={children}
          numColumns={3}
          renderItem={renderChildren}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
      {/* {children &&
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
          ))} */}
    </View>
  );
}
const styles = StyleSheet.create({
  childrenContainer: {
    flex: 1,
    justifyContent: "center",
  },
  flatlist: {
    alignItems: "center",
  },
  childrenBox: {
    margin: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
});

export default Children;
