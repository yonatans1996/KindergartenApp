import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faGear, faComment } from '@fortawesome/free-solid-svg-icons'
import { View, Text } from 'react-native';
const Tab = createBottomTabNavigator();
const Tabs = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:"#F2F3F5"}}}>
            <Tab.Screen name="Home" component={HomeScreen} options={
                { 
                    tabBarIcon: ({focused}) => (
                        <View>
                                 <FontAwesomeIcon icon={faHome } color={focused?"#007AFF":"gray"} />
                        </View>
                      )
                }}
            /> 
            <Tab.Screen name="Settings" component={SettingsScreen} options={
                { 
                    tabBarIcon: ({focused}) => (
                        <View>
                                 <FontAwesomeIcon icon={faGear } color={focused?"#007AFF":"gray"} />
                        </View>
                      )
                }}/> 
            <Tab.Screen name="Chat" component={ChatScreen} options={
                { 
                    tabBarIcon: ({focused}) => (
                        <View>
                                 <FontAwesomeIcon icon={faComment } color={focused?"#007AFF":"gray"} />
                        </View>
                      )
                }}/> 
        </Tab.Navigator>
    )
}

export default Tabs;