import AsyncStorage from '@react-native-async-storage/async-storage';

// Save the token
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.log('Error storing the token', error);
  }
};

// Retrieve the token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.log('Error retrieving the token', error);
  }
};

// Remove the token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.log('Error removing the token', error);
  }
};
