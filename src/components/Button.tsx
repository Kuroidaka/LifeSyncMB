import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Define the types for the props
type ButtonProps = {
    title?: string;
    onClick?: (event: GestureResponderEvent) => void;
    style?: any;
    name?: string;
};

const Button: React.FC<ButtonProps> = ({ title = '', onClick = () => { }, style = {}, name = '' }) => {
    const scaleValue = new Animated.Value(1); // Create animated value for scaling

    // Handle button press
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    // Handle button release
    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    // Handle click
    const handleClick = (e: GestureResponderEvent) => {
        onClick(e);
    };

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleClick}
                    style={styles.button} // Applied to TouchableOpacity only
                    accessibilityLabel={name}
                >
                    <Text style={styles.buttonText}>{title}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default Button;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 300,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    touchable: {
        borderRadius: 10, // Ensure the touchable area respects the button's borderRadius
    },
});
