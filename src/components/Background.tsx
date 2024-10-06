import { StyleSheet, ImageBackground } from 'react-native';


const Background = ({ background }: { background: string }) => {
    return (
      <ImageBackground 
        source={{ uri: background }} 
        style={styles.background} 
        resizeMode="cover"
      />
    );
  };
  
const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.4,
        minHeight: '100%',
        justifyContent: 'center', // To center content, similar to `background-position: center`
    }
});

export default Background;