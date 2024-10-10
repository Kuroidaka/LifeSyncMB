// Sidebar.tsx (Updated)
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { FaTasks } from "react-icons/fa";
import { AiTwotoneSetting } from "react-icons/ai";
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";

const menuItems = [
  { name: "Planner", label: "Planner", icon: (props: any) => <Ionicons name="calendar-outline" size={30} color={props.isActive ? "white" : "black"} {...props} />, link: "Planner" },
  { name: "Chat", label: "Chat", icon: (props: any) => <Ionicons name="chatbubble-outline" size={30} color={props.isActive ? "white" : "black"} {...props} />, link: "Chat" }, 
  { name: "Settings", label: "Cài đặt", icon: (props: any) => <Ionicons name="settings-outline" size={30} color={props.isActive ? "white" : "black"} {...props} />, link: "Setting" }, 
];

const Sidebar: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const [select, setSelect] = useState<string>("Planner");

  const handleSelect = (link: string) => {
    setSelect(link);
    navigation.navigate(link); // Navigate between drawer screens
  };

  const sideWidth =  250;

  const renderIcon = (icon: React.ReactNode) => {
    return <View style={styles.iconWrapper}>{icon}</View>;
  };

  // useEffect(() => {
  //   if(route) {
  //     console.log(route)
  //   }
  // }, [route]);

  return (
    <>
      <View style={styles.logo}>
        {/* <Image source={Img.logo} style={styles.logoImage} /> */}
      </View>
      <View style={styles.menu}>
        {menuItems.map((menuItem, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleSelect(menuItem.link)}
            style={[styles.menuItem, select === menuItem.link && styles.active]}
          >
            <View style={styles.iconWrapper}>
              {menuItem.icon({isActive: select === menuItem.link})}
            </View>
            <Text style={[
              styles.menuText,
              select === menuItem.link && styles.activeText
            ]}>{menuItem.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  logo: {
    height: 50,
    backgroundColor: "aliceblue",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  menu: {
    padding: 10,
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  active: {
    backgroundColor: "linear-gradient(118deg,rgba(30,30,30,1),rgba(30,30,30,.7))",
    borderRadius: 10,
  },
  activeText: {
    color: "white",
  },
  iconWrapper: {
    width: 29,
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
