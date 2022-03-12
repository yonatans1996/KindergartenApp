import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import base64 from "react-native-base64";
import * as Animatable from "react-native-animatable";
import ChildEditModal from "./ChildEditModal";
const Child = ({ child, handleChildPress, handleLongChildPress }) => (
  <Animatable.View  duration={500 + Math.floor(Math.random() * 3000)}
  animation="bounceIn" key={child.child_id}>
     <TouchableOpacity 
    onLongPress={()=>handleLongChildPress(child.child_id)}
    onPress={() => handleChildPress(child.child_id, child.is_present)}
    style={[
      styles.childrenBox,
      { backgroundColor: child.is_present ==="yes" ? "green" : "red" },
    ]}
  >
    <Image
      style={{ width: 80, height: 80, resizeMode: "cover",borderRadius:10 }}
      source={{
        uri: child.photo_link
          ? child.photo_link
          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
      }}
    />
    <Text style={{ color: "white" }}>{child.first_name}</Text>
    <Text style={{ color: "white" }}>{child.last_name}</Text>
  </TouchableOpacity>
  </Animatable.View>

);
function Children({ children, accessToken, getChildren }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [childEditModal, setChildEditModal] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getChildren();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    console.log("Rendered children component");
  }, []);
  const handleChildPress = (id, currentStatus) => {
    setSelectedId(id);
    var myHeaders = new Headers();
myHeaders.append("Authorization", accessToken);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "id": id,
  "is_present": currentStatus ==="yes"? "no" : "yes"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.kindergartenil.com/attendance", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
    getChildren()
  };
  const handleLongChildPress = (id)=>{
    setSelectedId(id)
    setChildEditModal(!childEditModal);
  }

  const renderChildren = ({ item }) => (
    <Child child={item} handleChildPress={handleChildPress} handleLongChildPress={handleLongChildPress} />
  );

  return (
    <View style={styles.childrenContainer}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={childEditModal}
        onRequestClose={() => {
          setChildEditModal(!childEditModal);
        }}
      >
        <ChildEditModal
          childEditModal={childEditModal}
          setChildEditModal={setChildEditModal}
          accessToken={accessToken}
          getChildren={getChildren}
          childInfo={children.filter((child)=>child.child_id == selectedId)[0]}
        />
      </Modal>
      {children && (
        <FlatList
          extraData={selectedId}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flatlist}
          data={children}
          numColumns={3}
          renderItem={renderChildren}
          keyExtractor={(item) => item.child_id}
        />
      )}
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
    borderRadius: 10
  },
});

export default Children;
