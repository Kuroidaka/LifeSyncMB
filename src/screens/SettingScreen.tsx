import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import authenApi from '../api/auth.api';
import Loading from '../components/Loading';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/auth.context';
import { SettingScreenProps } from './type';

const SettingScreen:React.FC<SettingScreenProps> = () =>  {
    const { logOut } = useContext(AuthContext) || {};
    return (
      <View style={styles.container}>
        <Text>Setting</Text>
        <Toast />
      </View>
    );
}
 
export default SettingScreen;


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