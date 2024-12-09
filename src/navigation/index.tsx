import React from "react";
// import { Provider as PaperProvider } from 'react-native-paper';
// import { AuthProvider } from './AuthProvider';
import Routes from "./Routes";
import { AuthProvider } from "../context/auth.context";
import { NavigationContainer } from "@react-navigation/native";
import { TaskProvider } from "../context/task.context";
import { ModalProvider } from "../context/modal.context";
import { AppearanceProvider } from "../context/appearance.context";
import { WebSocketProvider } from "../context/socket.context";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Providers() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider> 
  );
}
