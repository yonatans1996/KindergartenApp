import { StyleSheet, Text, View, TextInput, Pressable  } from "react-native";
import { useEffect, useState } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
export default function Login({acceptSms}) {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sms, setSms] = useState('');
  const [showPassword,setShowPassword] = useState(false);

  return (  
    <View style={styles.container}>
        {/* <Text style={styles.h1}>
            התחברות / הרשמה 
        </Text>
        <TextInput  style={styles.textInput}
        placeholder="שם פרטי"
        onChangeText={fname => setFname(fname)}
        defaultValue={fname}>{}</TextInput>

        <TextInput  style={styles.textInput}
        placeholder="שם משפחה"
        onChangeText={lname => setLname(lname)}
        defaultValue={lname}>{}</TextInput>

        <TextInput  style={styles.textInput}
        placeholder="דואר אלקטרוני"
        onChangeText={username => setUsername(username)}
        defaultValue={username}>{}</TextInput>

        <View style={styles.passwordWrapper}> 
    
          <TextInput  style={styles.textInput}
            placeholder="סיסמה"
            onChangeText={password => setPassword(password)}
            secureTextEntry={showPassword}
            defaultValue={password}>{}</TextInput>
          <FontAwesomeIcon
            icon={showPassword? faEye : faEyeSlash}
            style={{paddingTop:40}}
            color={showPassword ? "gray" : "#007AFF"}
            size={20}
            onPress={()=>setShowPassword(!showPassword)}
              />
         </View>
        <TextInput  style={styles.textInput}
          placeholder="קוד סמס"
          onChangeText={sms => setSms(sms)}
          defaultValue={sms}>{}</TextInput>
        <View style={styles.passwordWrapper}> 
        <Pressable style={styles.button}>
        <Text style={styles.buttonText}>כניסה</Text>
        </Pressable>
        </View>

        <Pressable style={styles.button} onPress={()=>acceptSms(sms)}>
        <Text style={styles.buttonText}>אישור סמס</Text>
        </Pressable> */}
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
    display:"flex",
    flexDirection: "row",
    justifyContent: "center"
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
