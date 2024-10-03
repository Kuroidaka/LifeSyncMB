import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// import { ModalContext } from '../../Context/Modal.context';
import TaskSection from './TaskSection'; // Assuming TaskSection is already converted to React Native
// import TaskCard from './TaskCard';
import plannerData from '../Planner.json';
import { PlannerData, Task } from '../../../types/task.type';
import Button from '../../../components/Button';
import TaskCardList from './TaskList';
import TaskContext, { TaskContextProps } from '../../../context/task.context';

interface TaskListProps {
  data: Task[];
  dateZone: string;
  setDateZone: (zone: string) => void;
}

const TaskListWrapper: React.FC<TaskListProps> = ({ data, dateZone, setDateZone }) => {
  const tab = 'task';
  //   const { openModal } = useContext(ModalContext);


  const hdleClickBtn = (name: string) => {
    // openModal(name, null, name, 'add');
  };



  const planner: PlannerData = plannerData;

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <TaskCardList dataSection={data} dateZone={dateZone} setDateZone={setDateZone} />
      ) : (
        <View style={styles.motivationContainer}>
          <ImgMotivation>
            <Image source={{ uri: "/src/assets/svg/task.svg" }} style={styles.motivationImage} />
            {/* <TaskSVG /> */}
          </ImgMotivation>

          <TextMotivation>
            <Text style={styles.motivationText1}>{planner[tab].empty.text1}</Text>
            <Text style={styles.motivationText2}>{planner[tab].empty.text2}</Text>
            <Text style={styles.motivationText3}>{planner[tab].empty.text3}</Text>
          </TextMotivation>

          <Button title="Click me" onClick={() => hdleClickBtn(tab)} />
        </View>
      )}
    </View>
  );
};

export default TaskListWrapper;

// ImgMotivation and TextMotivation components:

const ImgMotivation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.imgMotivation}>{children}</View>;
};

const TextMotivation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.textMotivation}>{children}</View>;
};



const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  motivationContainer: {
    gap: 15
  },
  motivationImage: {
    width: 250,
    height: 250,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  motivationText1: {
    textAlign: 'center',
    fontWeight: '600',
  },
  motivationText2: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 13,
  },
  motivationText3: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 11,
  },
  imgMotivation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textMotivation: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
});