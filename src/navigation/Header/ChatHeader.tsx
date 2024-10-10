import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../screens/type';

const ChatHeader = ({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList>}) => {

    const handleCreateChat = () => {
        navigation.navigate('ChatID', {
            conversationId: '',
        });
    }
    return (
        <View style={styles.container}>
            <Ionicons name="create-outline" size={30} color="black" onPress={handleCreateChat} />
        </View>
    );
}
 
export default ChatHeader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    }
});