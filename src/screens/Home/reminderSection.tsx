import React, { useState, useContext, useCallback, Fragment } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import plannerData from './Planner.json';
import { Task } from '../../types/task.type';
import TaskSection from './Task/TaskSection';
// import TaskCard from '../../components/TaskCard';
// import ModalContext from '../context/ModalContext'; // Assuming you have this context

interface ReminderSectionProps {
  tab: string;
}

const ReminderSection: React.FC<ReminderSectionProps> = ({ 
    tab
}) => {
    const currentTab = tab as keyof typeof plannerData
    
//   const { openModal } = useContext(ModalContext);

  const tabStyle = {
    initial: { translateX: -50, opacity: 0 },
    appear: { translateX: 0, opacity: 1 },
    disappear: { translateX: 50, opacity: 0 },
  };

  const handleClickBtn = useCallback((name: string) => {},[])
//     openModal(name, null, name, 'add');
//   }, [openModal]);

  const renderTaskForTab = () => {
    if(tab === 'task') {
      return <TaskSection />
    }
  }

  return (
    <View>
      {renderTaskForTab()}
    </View>
  );
};

export default ReminderSection;

const styles = StyleSheet.create({
  motionView: {
    flex: 1,
  },
  taskSection: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  imgMotivation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  motivationImage: {
    maxWidth: 250,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  textMotivation: {
    marginTop: 16,
  },
  text1: {
    textAlign: 'center',
    fontWeight: '600',
  },
  text2: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 18,
  },
  text3: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 16,
  },
});
