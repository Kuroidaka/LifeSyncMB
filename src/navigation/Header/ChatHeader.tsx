import { StyleSheet, View, Text, Dimensions } from "react-native";

const ChatHeader = () => {
    return (
        <View style={styles.container}>
            <Text>ChatHeader</Text>
        </View>
    );
}
 
export default ChatHeader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        width: Dimensions.get('window').width,
    }
});