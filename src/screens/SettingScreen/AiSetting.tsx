import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ToolSettings from './ToolSetting';
import LinkAccountSetting from './LinkGoogleAccount';
// import LinkAccountSetting from './LinkGoogle';  

const { height } = Dimensions.get('window');  // For responsive height

const AISetting: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title Wrapper */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Tùy chỉnh Raine</Text>
      </View>

      {/* Tool Settings Component */}
      <ToolSettings />

      {/* Link Account Settings Component */}
      <LinkAccountSetting />
    </ScrollView>
  );
};

export default AISetting;

const styles = StyleSheet.create({
  container: {
  },
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.05,  // Equivalent to 5% height of the screen
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#000',  // Replace with your custom black text color variable if needed
  },
});
