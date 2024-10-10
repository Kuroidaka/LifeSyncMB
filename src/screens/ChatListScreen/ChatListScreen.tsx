
import { ConversationProvider } from "../../context/conversation.context";
import Toast from "react-native-toast-message";
import Conversations from "./Conversations";
import Background from "../../components/Background";
import { useContext } from "react";
import AppearanceContext from "../../context/appearance.context";
import { ChatListScreenProps, RootStackParamList } from '../type'
import { NavigationProp } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const ChatListScreen = ({ navigation }: ChatListScreenProps) => {
    const { appearance } = useContext(AppearanceContext) || {};

    return (
        <ConversationProvider>
            {appearance?.urlPath && <Background background={appearance.urlPath} />}
            <Toast />
            <Conversations navigation={navigation} />
        </ConversationProvider>
    );
}


export default ChatListScreen;

const styles = StyleSheet.create({
    createBtn: {
        position: 'relative',
        top: 10,
        right: 10,
    }
})