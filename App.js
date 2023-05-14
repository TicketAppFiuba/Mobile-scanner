import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Scan from './src/screens/Scan';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();
console.disableYellowBox = true;
export default function App() {
  return (
        <NavigationContainer>
                <Stack.Navigator>

                  <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                  <Stack.Screen name="Scan" component={Scan} />
                  <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />

                </Stack.Navigator>
          </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
