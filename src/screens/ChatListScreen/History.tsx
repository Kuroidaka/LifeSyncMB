import React, { useContext, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ToastAndroid, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For Ionicons support in Expo
import Sidebar from "./Sidebar";
import ConversationContext from "../../context/conversation.context";
import OverlayDimLoading from "../../components/OverlayDimLoading";

interface ChatListProps {    
  children: React.ReactNode;
}

const ChatList: React.FC<ChatListProps> = (p) => {
  const { children } = p;
  
  const conversationContext = useContext(ConversationContext);
  
  const [isShowChatList, setIsShowChatList] = useState(false);

  if (conversationContext?.isLoading) {
    return <OverlayDimLoading />;
  }

  if (conversationContext?.error) {
    // Display error as toast notification for Android, for iOS use Alert or another method
    if (Platform.OS === "android") {
      ToastAndroid.show("Error on get conversation", ToastAndroid.LONG);
    }
  }

  const renderChatList = () => {
    if (isShowChatList) {
      return (
        <View style={styles.historySlideBar}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsShowChatList(false)}
          />
          <View style={styles.slideBarContent}>
            <Sidebar data={conversationContext?.conversationList} selectedConID={conversationContext?.selectedConID} />
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentUI}>{children}</View>
        <>
          <TouchableOpacity
            style={styles.historyToggleButton}
            onPress={() => setIsShowChatList(!isShowChatList)}
          >
            {isShowChatList ? (
              <Ionicons name="chevron-forward-outline" size={30} color="#fff" />
            ) : (
              <Ionicons name="chevron-back-outline" size={30} color="#fff" />
            )}
          </TouchableOpacity>
          {renderChatList()}
        </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
  },
  contentUI: {
    flex: 1,
  },
  historyToggleButton: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -50 }],
  },
  historySlideBar: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
  },
  slideBarContent: {
    zIndex: 1000,
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(26, 26, 26, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
  },
});

export default ChatList;
