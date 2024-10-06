import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './auth.context';

import userApi from '../api/user.api';
import { PREFIX, API_BASE_URL } from '../constant/BaseURl';

interface AppearanceContextType {
  appearance: { name: string; urlPath: string };
  setAppearance: React.Dispatch<React.SetStateAction<{ name: string; urlPath: string }>>;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

interface AppearanceProviderProps {
  children: ReactNode;
}

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  const [appearance, setAppearance] = useState<{ name: string; urlPath: string }>({ name: '', urlPath: '' });
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchBGImage = async () => {
      try {
        if (authContext?.userData?.id) {
          const backgroundImage = await userApi.getBackgroundImg();
          if (backgroundImage) {
            setAppearance({
              name: backgroundImage.name.split('.')[0],
              urlPath: `${API_BASE_URL}${PREFIX}${backgroundImage.urlPath}`,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching background image:', error);
      }
    };

    fetchBGImage();
  }, [authContext?.userData?.id]);

  const contextValue = {
    appearance,
    setAppearance,
  };

  return (
    <AppearanceContext.Provider value={contextValue}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};

export default AppearanceContext;
