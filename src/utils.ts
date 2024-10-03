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

export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null;
}

export const isEmptyObject = (obj: any) => {
  return Object.keys(obj).length === 0;
}

export const isEmptyArray = (arr: any) => {
  return arr.length === 0;
}


export const convertDates = (dateArray: (string | Date)[]): string[] => {
  return dateArray.map(dateStr => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() is zero-based
      const day = date.getDate();

      // Format the date string as 'YYYY-MM-DD'
      return `${year}-${month}-${day}`;
  });
};

export const dateConvert = (dateMilli: string | Date) => {
  return new Date(dateMilli).toLocaleString('en-GB', {
    weekday: 'short', // Fri
    day: '2-digit',   // 23
    month: 'short',   // Aug
    hour: 'numeric',  // 11
    minute: '2-digit', // 08
    hour12: true      // 12-hour clock
  });
}

export function convertTimeHHmmToDate(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0); // Optionally reset seconds to 0
  date.setMilliseconds(0); // Optionally reset milliseconds to 0

  return date;
}

