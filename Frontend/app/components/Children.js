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
  ActivityIndicator,
  Dimensions,
  LogBox,
  SectionList,
} from "react-native";
import base64 from "react-native-base64";
import * as Animatable from "react-native-animatable";
import ChildEditModal from "./ChildEditModal";
let lastGroup = null;
const Child = ({
  child,
  handleChildPress,
  handleLongChildPress,
  disablePress,
}) => (
  <Animatable.View
    duration={500 + Math.floor(Math.random() * 3000)}
    animation="bounceIn"
    key={child.child_id}
  >
    <TouchableOpacity
      onLongPress={() => handleLongChildPress(child.child_id)}
      disabled={disablePress}
      onPress={() => handleChildPress(child.child_id, child.is_present, child)}
      style={[
        styles.childrenBox,
        { backgroundColor: child.is_present === "yes" ? "green" : "red" },
      ]}
    >
      <Image
        style={{ width: 80, height: 80, resizeMode: "cover", borderRadius: 10 }}
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
  const windowDimensions = Dimensions.get("window");
  const [refreshing, setRefreshing] = React.useState(false);
  const [childEditModal, setChildEditModal] = useState(false);
  const [disablePress, setDisablePress] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getChildren();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [selectedId, setSelectedId] = useState(null);
  const createSections = () => {
    if (children.length < 1) {
      return;
    }
    let sections = [];
    let lastGroup = children[0].group_name;
    for (let i = 0; i < children.length; i++) {
      let data = [];
      for (; i < children.length; i++) {
        if (children[i].group_name !== lastGroup) break;
        data.push(children[i]);
      }
      sections.push({ data, key: lastGroup });
      if (i < children.length) {
        lastGroup = children[i].group_name;
        i--;
      }
    }
    return sections;
    /*[
            {
              data: children.filter(
                (child) => child.group_name === "קבוצה ראשית"
              ),
              key: 1,
            },
            {
              data: children.filter((child) => child.group_name === "קטנטנים"),
              key: 2,
            },
          ]*/
  };
  useEffect(() => {
    console.log("Rendered children component");
  }, []);
  const handleChildPress = async (id, currentStatus, child) => {
    if (disablePress) return;
    setDisablePress(true);
    setSelectedId(id);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");

    currentStatus = currentStatus === "yes" ? "no" : "yes";
    console.log("New status = ", currentStatus);
    var raw = JSON.stringify({
      id: id,
      is_present: currentStatus,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const attendanceRes = await fetch(
      "https://api.kindergartenil.com/attendance",
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
    console.log("-------------------------------------");
    console.log("Child attendance response: " + JSON.stringify(attendanceRes));
    if (attendanceRes.statusCode == "200") {
      getChildren({ ...child, is_present: currentStatus });
      setDisablePress(false);
    } else {
      console.log("Child attendance didn't update successfully");
    }

    console.log("-------------------------------------");
  };
  const handleLongChildPress = (id) => {
    setSelectedId(id);
    setChildEditModal(!childEditModal);
  };

  const renderChildren = ({ item }) => (
    <Child
      child={item}
      handleChildPress={handleChildPress}
      handleLongChildPress={handleLongChildPress}
      disablePress={disablePress}
    />
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
          childInfo={
            children.filter((child) => child.child_id == selectedId)[0]
          }
        />
      </Modal>
      <View
        style={{
          flex: 1,
          width: "100%",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 55,
        }}
      >
        {disablePress && (
          <ActivityIndicator
            size="large"
            color="#08d4c4"
            animating={disablePress}
            style={{
              zIndex: 11,
            }}
          />
        )}
      </View>
      {
        children && (
          <SectionList
            extraData={selectedId}
            numColumns={3}
            renderSectionHeader={({ section }) => (
              <View
                style={{
                  borderColor: "#009387",
                  borderBottomWidth: 2,
                }}
              >
                <Text
                  style={{
                    width: windowDimensions.width,
                    textAlign: "center",
                    color: "#009387",
                    fontWeight: "700",
                  }}
                >
                  {section.data[0].group_name}
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            sections={createSections()}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
            renderItem={renderChildren}
            keyExtractor={(item) => item.child_id}
          />
        )

        // <FlatList
        //   extraData={selectedId}
        //   refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //   }
        //   contentContainerStyle={styles.flatlist}
        //   data={children}
        //   numColumns={3}
        //   renderItem={renderChildren}
        //   keyExtractor={(item) => item.child_id}
        // />
      }
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
    borderRadius: 10,
  },
});

export default Children;
