import { StyleSheet, Text, View, TextInput, Pressable  } from "react-native";
import { useEffect, useState } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  var poolData = {
	UserPoolId: 'us-east-1_ZjbeuItjC', 
	ClientId: '2stjdkn1fmpskfms81355bs3ie', 
    };

    const getColor = ()=>{
        return showPassword ? "gray" : "#007AFF"
    }

  return (
    <View style={styles.container}>
        <Text style={styles.h1}>
            התחברות / הרשמה 
        </Text>
        <TextInput  style={styles.textInput}
        placeholder="שם משתמש"
        onChangeText={username => setUsername(username)}
        defaultValue={username}>{}</TextInput>
        <View style={styles.passwordWrapper}> 
    
          <TextInput  style={styles.textInput}
        placeholder="סיסמה"
        onChangeText={password => setPassword(password)}
        secureTextEntry={showPassword}
        defaultValue={password}>{}</TextInput>
         </View>
         <FontAwesomeIcon
                icon={showPassword? faEye : faEyeSlash}
                style={{paddingTop:40}}
                color={showPassword ? "gray" : "#007AFF"}
                size={20}
                onPress={()=>setShowPassword(!showPassword)}
              />
        <Pressable style={styles.button}>
        <Text style={styles.buttonText}>כניסה</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign:"right",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  passwordWrapper:{
    width:"100%",
    alignItems:"center",
  },
  textInput:{
      height:40,
      width:"80%",
      borderBottomWidth:1,
      borderStyle:"solid",
      textAlign:"center"
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 90,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#00688B',
  },
  buttonText:{
      fontSize:20,
      color:"white"
  }
});
