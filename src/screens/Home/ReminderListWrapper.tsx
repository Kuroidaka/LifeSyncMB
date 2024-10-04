import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// import { ModalContext } from '../../Context/Modal.context';
// import TaskCard from './TaskCard';
import plannerData from './Planner.json';
import { Task } from '../../types/task.type';
import Button from '../../components/Button';
import TaskCardList from './Task/TaskList';
import TaskContext, { TaskContextProps } from '../../context/task.context';
import { PlannerData } from '../../types/index.type';
import { Routine } from '../../types/routine.type';
import RoutineCardList from './Routine/RoutineList';
import { ScrollView } from 'moti';

interface ReminderListProps {
  data: Task[] | Routine[];
  dateZone: string;
  setDateZone: (zone: string) => void;
  tab: 'task' | 'routine';
  setDateSection: React.Dispatch<React.SetStateAction<Routine[]>> | null;
}

const ReminderListWrapper: React.FC<ReminderListProps> = ({ data, dateZone, setDateZone, tab, setDateSection }) => {
  //   const { openModal } = useContext(ModalContext);


  const hdleClickBtn = (name: string) => {
    // openModal(name, null, name, 'add');
  };

  const renderData = (data: Task[] | Routine[]) => {
    if (tab === 'task') {
      return <TaskCardList dataSection={data as Task[]} dateZone={dateZone} setDateZone={setDateZone} />
    } else {
      return <RoutineCardList 
        dataSection={data as Routine[]} 
        setDateSection={setDateSection as React.Dispatch<React.SetStateAction<Routine[]>>} 
        dateZone={dateZone} 
        setDateZone={setDateZone} 
      />
    }
  }

  const planner: PlannerData = plannerData;

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        renderData(data)
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

export default ReminderListWrapper;

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
    height: '100%'
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