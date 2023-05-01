import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage';


const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('token', value)
  } catch (e) {
    // saving error
  }
}

WebBrowser.maybeCompleteAuthSession();

export default function App({navigation}) {
  const [token, setToken] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:"651976534821-njeiiul5h073b0s321lvn9pevadj3aeg.apps.googleusercontent.com",

  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("REsponse", response)
      setToken(response.authentication.accessToken);
      getJwt();
    }
  }, [response, token]);

  const getJwt = async () => {

    let url = `https://dbe5-201-212-239-28.ngrok-free.app/authorizer/login?token=${token}`
    console.log(url)
    try {
      const response = await fetch(url,
        {
        method: 'GET',
      }
      )
      .then((response) => response.json())
      .then((jwt) => {
          console.log("JWT:", jwt)
          storeData(jwt.access_token)
          .then((data)=>{
              navigation.navigate('Home');
          })
      })
      .catch((error) => {
          console.error("Aca1", error);
      })
    } catch (error) {
      // Add your own error handler here
      console.error("Aca2", error);
    }
  };

  return (
    <View style={styles.container}>
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});