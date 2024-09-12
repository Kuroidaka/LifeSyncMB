import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Loading: React.FC = () => {
  const numberOfDots = 5;
  const animatedDots: Animated.Value[] = Array(numberOfDots).fill(null).map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    animatedDots.forEach((dot, index) => {
      const delay = index * 200; // Delay the animation start for each dot
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 750,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [animatedDots]);

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {animatedDots.map((animatedValue, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1], // Scale the dots between 0 and 1
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150, // Adjust to your liking
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
});
