import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import authenApi from "../../api/auth.api";
import Loading from "../../components/Loading";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../context/auth.context";
import { HomeScreenProps } from "../type";
import ReminderSection from "./reminderSection";
import TabBar from "./TabBar";
import TaskContext from "../../context/task.context";

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { logOut } = useContext(AuthContext) || {};
  // const { task }= useContext(TaskContext) || {};

  const [tab, setTab] = useState("task")
    
  const selectTab = (e: any) => {
    const name = e.target.getAttribute("name")
    setTab(name)
  }

  // useEffect(()=> {
  //   console.log("task", task)
  // }, [task])

  return (
    <View style={styles.container}>
      <TabBar tab={tab} setTab={setTab} />

      <ReminderSection tab={tab} />

      {/* <Text>Home</Text>
      <Button
        title="Logout"
        onPress={() => {
          logOut && logOut();
        }}
      />
      <Toast /> */}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
});
