import React from "react";
// import { Provider as PaperProvider } from 'react-native-paper';
// import { AuthProvider } from './AuthProvider';
import Routes from "./Routes";
import { AuthProvider } from "../context/auth.context";
import { NavigationContainer } from "@react-navigation/native";
import { TaskProvider } from "../context/task.context";

export default function Providers() {
  return (
    <NavigationContainer>
      <AuthProvider>
        
          <Routes />

      </AuthProvider>
    </NavigationContainer>
  );
}
