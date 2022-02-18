import { StyleSheet, Text, View } from "react-native";
import Tabs from "./navigation/Tabs";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
export default function App() {
  const [user,setUser] = useState({id:""});
  
  return (
      <>
    {user.id ? 
      (<NavigationContainer>
        <Tabs />
      </NavigationContainer>): <Login />}
      </>
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
