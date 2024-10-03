import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import plannerData from "../Planner.json";
import TaskListWrapper from "./TaskListWrapper";
import TaskContext, { TaskContextProps } from "../../../context/task.context";
import { Task } from "../../../types/task.type";
import ModalContext from "../../../context/modal.context";
// import { FaPlus } from "react-icons/fa";
// import ModalContext from '../../Context/Modal.context';
// import Icon from '../../assets/icon'; // Make sure to adjust Icon import based on React Native usage

interface TaskSectionProps {
  // children: React.ReactNode
}

const TaskSection: React.FC<TaskSectionProps> = () => {
  const data = "task";
  const [dateZone, setDateZone] = useState('today');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const { task, loading } = useContext(TaskContext) as TaskContextProps;

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
    console.log("task", task)
    if(task && task.length > 0) {
      setTaskList(task)
    }
  }, [task]);

  return (
    <View style={styles.task}>
      <Text style={styles.title}>
        {plannerData[data].value}
        <View style={styles.iconWrap}>
          <TouchableOpacity
            onPress={() => handleClickAdd(plannerData[data].name)}
            style={styles.icon_btn}
          >
            <Icon name="plus" size={50} />
          </TouchableOpacity>
        </View>
      </Text>
      <View style={styles.dateZone}>
        {plannerData[data].dateZone &&
          plannerData[data].dateZone.map((date) => (
            <TouchableOpacity
              key={date.name}
              style={[styles.date]}
              onPress={() => handleSelectDateZone(date.name)}
            >
                <Text style={dateZone === date.name && styles.activeDate}>{date.value}</Text>
            </TouchableOpacity>
          ))}
      </View>
      
      {loading ? <Text>Loading...</Text> : (
        <TaskListWrapper 
          data={taskList}
          dateZone={dateZone}
          setDateZone={setDateZone}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
  },
  title: {
    letterSpacing: 4,
    fontSize: 50,
    // lineHeight: 50,
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
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

export default TaskSection;
