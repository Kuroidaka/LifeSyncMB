import React from 'react';
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import Loading from './Loading';

interface OverlayDimLoadingProps {
  isActive?: boolean;
}

const OverlayDimLoading: React.FC<OverlayDimLoadingProps> = ({ isActive = true }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isActive}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Loading />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OverlayDimLoading;
