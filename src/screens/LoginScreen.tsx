import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import authenApi from '../api/auth.api';
import Loading from '../components/Loading';
import Toast from 'react-native-toast-message';
import { getToken, storeToken } from '../utils';
import NetworkLogger from 'react-native-network-logger';
import { LoginScreenProps, RootStackParamList } from './type';
import { AuthContext } from '../context/auth.context';
import OverlayDimLoading from '../components/OverlayDimLoading';


const LoginScreen:React.FC<LoginScreenProps> = () =>  {

    const { login, isLoad } = useContext(AuthContext) || {};
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [dataInput, setDataInput] = useState({
      username: '',
      password: '',
    });
  

  
    const handleInput = (name: string, value: string) => {
      setDataInput({
        ...dataInput,
        [name]: value,
      });
    };
  
    const handleShowPassword = () => {
      setShowPassword(!showPassword);
      if (passwordRef.current) {
        passwordRef.current.setNativeProps({
          secureTextEntry: !showPassword,
        });
      }
    };
  
    const onSubmit = async () => {
      setLoading(true);
      const { username, password } = dataInput;
      try {
       login && await login(username, password)
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Please check your username and password',
        });
      } finally {
        setLoading(false);
      }
    };
    return (
      <View style={styles.container}>
        {(loading || isLoad) && <OverlayDimLoading />}
        {/* <NetworkLogger /> */}
        <View style={styles.inputGroup}>
          <Text>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            ref={emailRef}
            onChangeText={(value) => handleInput('username', value)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            ref={passwordRef}
            onChangeText={(value) => handleInput('password', value)}
          />
          <TouchableOpacity onPress={handleShowPassword}>
            <Text>Show Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Button title="Log in" onPress={onSubmit} />
        </View>
        <Toast />
      </View>
    );
}
 
export default LoginScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    svgContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      width: '100%',
    },
  });