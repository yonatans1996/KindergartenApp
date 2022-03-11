import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import ChildEditModal from "./ChildEditModal";
const Child = ({ child, handleChildPress }) => (
  <TouchableOpacity
    key={child.child_id}
    onPress={() => handleChildPress(child.child_id, child.is_present)}
    style={[
      styles.childrenBox,
      { backgroundColor: child.is_present ? "green" : "red" },
    ]}
  >
    <Image
      style={{ width: 80, height: 80, resizeMode: "contain" }}
      source={{
        uri: child.photo_link
          ? child.photo_link
          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
      }}
    />
    <Text style={{ color: "white" }}>{child.first_name}</Text>
    <Text style={{ color: "white" }}>{child.last_name}</Text>
  </TouchableOpacity>
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
    console.log("Render children component");
  }, []);
  const handleChildPress = (id, currentStatus) => {
    setSelectedId(id);
    setChildEditModal(!childEditModal);
  };

  const renderChildren = ({ item }) => (
    <Child child={item} handleChildPress={handleChildPress} />
  );

  return (
    <View style={styles.childrenContainer}>
      <Modal
        animationType="slide"
        transparent={true}
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
          childrenInfo={children[selectedId]}
          id={selectedId}
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
  },
});

export default Children;
