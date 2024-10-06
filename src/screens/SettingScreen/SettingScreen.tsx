import React, { useContext, useCallback, useMemo, Suspense, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';

// import Appearance from './Appearance';
// import AISetting from './AISetting/AI';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { AuthContext } from '../../context/auth.context';
import { SettingScreenProps } from '../type';
import { Ionicons } from '@expo/vector-icons';
import Appearance from './Appearance';
import Toast from 'react-native-toast-message';



type RootStackParamList = {
  Setting: { name: string };
};

const dataItem = [
  {
    icon: (props: any) => (<Ionicons name="image-outline" size={30} color="black" {...props} />),
    name: 'appearance',
    title: 'Hiển thị',
    component: <Appearance />,
  },
  {
    icon: (props: any) => (<Ionicons name="code-outline" size={30} color="black" {...props} />),
    name: 'ai',
    title: 'AI Setting',
    component: <Text>2</Text>,
  },
];

const SettingScreen: React.FC<SettingScreenProps> = () => {
  const authContext = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState(dataItem[0].name);

  const handleChooseItem = (itemName: string) => {
    setSelectedItem(itemName);
  }

  const selectedComponent = useMemo(() => {
    const page = dataItem.find((item) => item.name === selectedItem);
    return page ? page.component : null;
  }, [selectedItem]);

  return (
    <View style={styles.container}>
      {/* Toast */}
      <View style={styles.menuWrapper}>
        <ScrollView>
          {dataItem.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.menuItem,
                selectedItem === item.name && styles.activeItem,
              ]}
              onPress={() => handleChooseItem(item.name)}
            >
              {item.icon({})}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button
          title={''}
          style={styles.logoutButton}
          onClick={() => authContext?.logOut()}
          Icon={() => <Ionicons name="log-out-outline" size={30} color="white" />}
        />
      </View>
      <View style={styles.contentWrapper}>
        <Toast/>
        <Suspense fallback={<Loading />}>
          {selectedComponent}
        </Suspense>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  menuWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    maxWidth: '13%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
  },
  contentWrapper: {
    flex: 4,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#cfcfcf',
  },
});
