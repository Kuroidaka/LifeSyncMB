
import { ConversationProvider } from "../../context/conversation.context";
import Toast from "react-native-toast-message";
import Conversations from "./Conversations";
import Background from "../../components/Background";
import { useContext } from "react";
import AppearanceContext from "../../context/appearance.context";


const ChatListScreen = () => {
    const { appearance } = useContext(AppearanceContext) || {};

    return (
        <ConversationProvider>
            {appearance?.urlPath && <Background background={appearance.urlPath} />}
            <Toast />
            <Conversations />
        </ConversationProvider>
    );
}


export default ChatListScreen;