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

const menuItems = [
  { name: "Planner", label: "Planner", icon: <FaTasks />, link: "Planner" },
  { name: "Settings", label: "Cài đặt", icon: <AiTwotoneSetting />, link: "Setting" }, // Example additional route
];

const Sidebar: React.FC<DrawerContentComponentProps> = ({ navigation }) => {

  const [select, setSelect] = useState<string>("");

  const handleSelect = (link: string) => {
    setSelect(link);
    navigation.navigate(link); // Navigate between drawer screens
  };

  const sideWidth =  250;

  const renderIcon = (icon: React.ReactNode) => {
    return <View style={styles.iconWrapper}>{icon}</View>;
  };

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
              {/* {renderIcon(menuItem.icon)} */}
            </View>
            <Text style={styles.menuText}>{menuItem.label}</Text>
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
    backgroundColor: "#e91e63",
    borderRadius: 10,
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
