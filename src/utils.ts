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

interface InputDate {
  completion_date: string;
}

interface RecentDate {
  value: string;
  check: boolean;
}

export const updateRecentDates = (inputDates: InputDate[]): RecentDate[] => {
  const recentDates: RecentDate[] = [];

  // Helper function to format date to the desired string format
  const formatDate = (date: Date): string => {
    return date.toDateString() + ' ' + date.toTimeString().split(' ')[0] + ' GMT+0700 (Indochina Time)';
  };

  // Helper function to compare dates ignoring the time part
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Create recentDates array with the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    recentDates.push({ value: formatDate(date), check: false });
  }

  // Convert input dates to Date objects for easier comparison
  const inputDateObjects = inputDates.map(dateStr => new Date(dateStr.completion_date));

  // Check and update the 'check' key if dates match
  recentDates.forEach(recentDateObj => {
    const recentDate = new Date(recentDateObj.value);
    if (inputDateObjects.some(inputDate => isSameDate(inputDate, recentDate))) {
      recentDateObj.check = true;
    }
  });

  return recentDates;
}

export function formatTimeHHmm(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const isSameDate = (date1: Date, date2: Date) => (
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
);

export const convertToFileObject = (fileUri: string, fileName: string, mimeType: string) => {
  return {
    uri: fileUri, // The local URI of the file
    name: fileName, // The file name
    type: mimeType, // The MIME type (e.g., 'image/jpeg')
  };
};
