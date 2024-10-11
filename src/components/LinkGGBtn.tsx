import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/auth.context';
import { FontAwesome } from '@expo/vector-icons';  // Importing Google icon from Expo vector icons
import { Linking } from 'react-native';  // To handle external links
import { API_BASE_URL, PREFIX } from '../constant/BaseURl';

const GoogleLinkButton: React.FC = () => {
  const authContext = useContext(AuthContext);

  // Handler to link Google account
  const handleLinkGoogle = () => {
    console.log(`authContext?.userData`, authContext?.userData);
    if (authContext?.userData?.id) {
      // Linking to Google Account (Replace with your actual link logic)
      console.log(`begin link google`);
      Linking.openURL(`${API_BASE_URL}${PREFIX}google/link-gmail?userId=${authContext.userData.id}`);
    }
  };

  return (
    <View style={styles.btnWrapper}>
      <TouchableOpacity style={styles.button} onPress={handleLinkGoogle}>
        <FontAwesome name="google" size={24} color="black" />
        <Text style={styles.buttonText}>Connect with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleLinkButton;

const styles = StyleSheet.create({
  btnWrapper: {
    maxWidth: '100%',
    width: 'auto',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonActive: {
    backgroundColor: '#90b5f6',
  },
});
