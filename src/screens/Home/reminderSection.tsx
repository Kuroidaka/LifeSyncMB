import React, { useState, useContext, useCallback, Fragment, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import plannerData from './Planner.json';
import { Task } from '../../types/task.type';
import TaskContext, { TaskContextProps, TaskProvider } from '../../context/task.context';
import Icon from 'react-native-vector-icons/Entypo';
import ModalContext from '../../context/modal.context';
import RoutineContext, { RoutineContextProps, RoutineProvider } from '../../context/routine.context';
import { Routine } from '../../types/routine.type';
import { Ionicons } from '@expo/vector-icons';
import ReminderListWrapper from './ReminderListWrapper';
// import TaskCard from '../../components/TaskCard';
// import ModalContext from '../context/ModalContext'; // Assuming you have this context

interface ReminderSectionProps {
  tab: 'task' | 'routine';
}

const ReminderSection: React.FC<ReminderSectionProps> = ({
  tab
}) => {

  const renderTaskForTab = () => {
    return <ReminderSectionInner tab={tab} />
  }

  return (
    <RoutineProvider>
      <TaskProvider>
        <ScrollView>
          {renderTaskForTab()}
        </ScrollView>
      </TaskProvider>
    </RoutineProvider>
  );
};

export default ReminderSection;


const ReminderSectionInner: React.FC<ReminderSectionProps> = ({ tab }) => {
  const [dateZone, setDateZone] = useState('today');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [routineList, setRoutineList] = useState<Routine[]>([]);
  const contextData = tab === 'task'
    ? useContext(TaskContext)
    : useContext(RoutineContext)

  const modalContext = useContext(ModalContext);

  const handleSelectDateZone = (name: string) => {
    // console.log(plannerData[data], name);
    setDateZone(name);
  };

  const handleClickAdd = (name: string) => {
    console.log("name", name);
    modalContext?.openModal(name, null, name, 'add');
  };

  useEffect(() => {
    if (contextData && tab === 'task') {
      const contextDataTask = contextData as TaskContextProps
      if (contextDataTask.task && contextDataTask.task.length > 0) {
        setTaskList(contextDataTask.task)
      }
    }
    if (contextData && tab === 'routine') {
      const contextDataRoutine = contextData as RoutineContextProps
      if (contextDataRoutine.routine && contextDataRoutine.routine.length > 0) {
        setRoutineList(contextDataRoutine.routine)
      }
    }
  }, [contextData]);

  return (
    <View style={styles.task}>
      <View style={styles.title_wrap}>
        <Text style={styles.title}>
          {plannerData[tab].value}
        </Text>
        <View style={styles.iconWrap}>
          <TouchableOpacity
            onPress={() => handleClickAdd(plannerData[tab].name)}
            style={styles.icon_btn}
          >
            <Ionicons name="add-outline" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.dateZone}>
        {plannerData[tab].dateZone &&
          plannerData[tab].dateZone.map((date) => (
            <TouchableOpacity
              key={date.name}
              style={[styles.date]}
              onPress={() => handleSelectDateZone(date.name)}
            >
              <Text style={dateZone === date.name && styles.activeDate}>{date.value}</Text>
            </TouchableOpacity>
          ))}
      </View>

      {contextData?.loading ? <Text>Loading...</Text> : (
        <ReminderListWrapper
          tab={tab}
          data={tab === 'task' ? taskList : routineList}
          dateZone={dateZone}
          setDateZone={setDateZone}
          setDateSection={tab === 'routine' ? setRoutineList : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    marginBottom: 30,

  },
  title_wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  title: {
    letterSpacing: 4,
    fontSize: 50,
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  iconWrap: {
    marginLeft: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  icon_btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900"
  },
  dateZone: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  date: {
    marginRight: 16,
    color: "#626262",
    fontWeight: "600",
    // transition: "all 0.3s ease-in-out", // Removed invalid property  
  },
  activeDate: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "800",
  },
});



