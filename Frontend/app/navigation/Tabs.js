import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faGear, faComment } from "@fortawesome/free-solid-svg-icons";
import { View, Text } from "react-native";
const Tab = createBottomTabNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="בית"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F2F3F5",
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="בית"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesomeIcon
                style={{ marginBottom: -15 }}
                icon={faHome}
                color={focused ? "#007AFF" : "gray"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="צ'אט"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesomeIcon
                style={{ marginBottom: -15 }}
                icon={faComment}
                color={focused ? "#007AFF" : "gray"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="הגדרות"
        unmountOnBlur={true}
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesomeIcon
                icon={faGear}
                style={{ marginBottom: -15 }}
                color={focused ? "#007AFF" : "gray"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
