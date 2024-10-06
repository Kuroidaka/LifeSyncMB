import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import authenApi from "../../api/auth.api";
import Loading from "../../components/Loading";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../context/auth.context";
import { HomeScreenProps } from "../type";
import ReminderSection from "./reminderSection";
import TabBar from "./TabBar";
import TaskContext, { TaskProvider } from "../../context/task.context";
import { RoutineProvider } from "../../context/routine.context";
import Background from "../../components/Background";
import AppearanceContext from "../../context/appearance.context";

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [tab, setTab] = useState<"task" | "routine">("task")
  const { appearance } = useContext(AppearanceContext) || {};

  return (
    <View style={styles.container}>
      {appearance?.urlPath && <Background background={appearance.urlPath} />}
      <TabBar tab={tab} setTab={setTab} />
      <ReminderSection tab={tab} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
