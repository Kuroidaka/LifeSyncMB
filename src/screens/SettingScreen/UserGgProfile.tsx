import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';

interface UserProfileCardProps {
  user: {
    email: string;
    picture: string;
  };
  unlink: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, unlink }) => {
  return (
    <TouchableOpacity style={styles.wrapper}>
      <View style={styles.accountRow}>
        <Image source={{ uri: user?.picture }} style={styles.avatar} />
        <View style={styles.content}>
          <Text style={styles.name}>{user.email}</Text>
          <Text style={styles.platforms}>Google</Text>
        </View>
      </View>
      <Button title="Unlink account" onClick={unlink} />
    </TouchableOpacity>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    height: 'auto',
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Required for shadow on Android
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flexGrow: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1d1d1d',
  },
  platforms: {
    fontSize: 14,
    color: '#6c757d',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
});
