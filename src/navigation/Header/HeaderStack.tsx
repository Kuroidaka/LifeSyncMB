import { StyleSheet, View } from "react-native";

import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from "@react-navigation/native";


const HeaderStack = (props: DrawerHeaderProps) => {

    const routeName = props.route.name;
    // console.log(props);
    return (
        <View style={styles.container}>
            {/* btn to show sidebar */}
            <TouchableOpacity onPress={() => { }} style={styles.btn}>
                <Ionicons name="menu-outline" size={30} color="black" onPress={() => {
                    props.navigation.toggleDrawer();
                }} />
            </TouchableOpacity>
        </View>

    );
}

export default HeaderStack;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn: {
        padding: 10,
    }
});

