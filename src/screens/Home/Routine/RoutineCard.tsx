import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ModalContext from '../../../context/modal.context';
import RoutineContext from '../../../context/routine.context';
import { Routine } from '../../../types/routine.type';


import { relatedArea } from '../Modal/constants';
import { Ionicons } from '@expo/vector-icons';
import { isSameDate, updateRecentDates } from '../../../utils';


interface RoutineCardProps {
  data: Routine;
  dataSection: Routine[];
  setDateSection: React.Dispatch<React.SetStateAction<Routine[]>>;
  mode?: 'edit' | 'view';
  isCompleted?: boolean;
}


const Card: React.FC<RoutineCardProps> = ({ data, mode = 'edit', dataSection, setDateSection, isCompleted = false }) => {
  const { title, color = null, area = [], note = "", id, routineDate, isActive, routineTime } = data;
  const modalContext = useContext(ModalContext);
  const routineContext = useContext(RoutineContext);
  // const [isCompleted, setIsCompleted] = useState(false);

  const [checked, setChecked] = useState(false);
  const [option, setOption] = useState(false);

  const taskHandle = {
    open: () => {
      const taskData = { title, color, area, note, id, routineDate, isActive, routineTime };
      modalContext?.openModal(title, taskData, 'routine', mode);
    },
    check: () => {
      if (mode !== 'view') setChecked(!checked);
    },
    option: {
      open: () => {
        setOption(true);
      },
      close: () => {
        setOption(false);
      },
      toggle: () => {
        setOption(!option);
      },
      deleteConfirm: (id: string) => {
        Alert.alert(
          "Delete Routine",
          "Are you sure you want to delete this routine?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { text: "OK", onPress: () => taskHandle.option.delete(id) }
          ]
        );
      },
      delete: (id: string) => {
        setTimeout(() => {
          const newTask = [...dataSection].filter(data => data.id !== id);
          setDateSection(newTask);
          taskHandle.option.close();
        }, 500);
      },
    },
  };

  const Area: React.FC<{ data: any }> = ({ data }) => {
    const iconName = relatedArea.find(item => item.name === data.area)?.icon;
    const ImageComponent = <Ionicons name={iconName as any} size={20} color="black" />;
    if (ImageComponent) return ImageComponent;
    return null;
  };




  const handleClickUnCheckDate = async (date: string) => {
    if (mode === 'view') return null;

    const data = dataSection.find((data: any) => data.id === id)
    if (!data) return null
    let dateList = data?.routineDate.map(({ completion_date }: { completion_date: string }) => ({
      completion_date: new Date(completion_date).toString(),
    }));

    dateList = dateList.filter((d: { completion_date: Date }) => !isSameDate(new Date(d.completion_date), new Date(date)));
    await routineContext?.handleUpdateRoutineDates(id, dateList);
  };

  const handleClickCheckDate = async (date: string) => {
    if (mode === 'view') return null;
    const data = dataSection.find((data: any) => data.id === id)
    if (!data) return null

    const dates = data.routineDate.map(({ completion_date }: { completion_date: string }) => ({
      completion_date: new Date(completion_date).toString(),
    }));

    dates.push({ completion_date: date });

    await routineContext?.handleUpdateRoutineDates(id, dates);
  };

  // useEffect(() => {
  //   const checkIsCompleted = () => {
  //     // check if all date in routineDate contain completion_date equal today

  //     const isCompleted = routineDate.some(({ completion_date }: { completion_date: string }) => isSameDate(new Date(completion_date), new Date()));
  //     setIsCompleted(isCompleted);
  //   };

  //   checkIsCompleted();
  // }, [routineDate]);
  return (
    <View style={[
      styles.taskCardContainer,
      { backgroundColor: color || '#FFFFF' }
    ]}>
      <View style={styles.mainTask}>
        <View style={[
          styles.cardTitle,
          isCompleted ? {
            opacity: 0.5,
          } : null,
        ]}>
          <View style={styles.deadlineContainer}>
            <Ionicons name="time-outline" size={24} color="black" />
            <Text style={styles.deadlineText}>{routineTime}</Text>
          </View>
          <Text style={[
            styles.titleText, 
            isCompleted ?
              { textDecorationLine: 'line-through'}
            : null
          ]}>{title}</Text>

          <View style={styles.timeContainer}>
            <View style={styles.checkedDate}>
              {routineDate &&
                updateRecentDates(routineDate)
                  .reverse()
                  .map((date: {
                    value: string;
                    check: boolean;
                  }, idx: number) => (
                    <TouchableOpacity key={idx} onPress={() => (date.check ? handleClickUnCheckDate(date.value) : handleClickCheckDate(date.value))}>
                      {date.check
                        ? <Ionicons name="checkmark-circle" size={25} color="black" />
                        : <Ionicons name="remove-outline" size={25} color="black" />}
                    </TouchableOpacity>
                  ))}
            </View>
          </View>

          <View style={styles.relateArea}>
            {area.length > 0 &&
              area.map((item: any, idx: any) => <Area key={idx} data={item} />)}
          </View>
        </View>

        <View style={styles.cardOption}>
          {mode !== 'view' && (
            <TouchableOpacity onPress={() => taskHandle.option.deleteConfirm(id)}>
              <Ionicons name="trash-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={taskHandle.open}>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Card;
const styles = StyleSheet.create({
  taskCardContainer: {
    maxWidth: '90%',
    width: '100%',
    borderRadius: 16,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  mainTask: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    flex: 1,
    gap: 6,
  },
  timeContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  checkedDate: {
    flexDirection: 'row',
    gap: 6,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 4,
  },
  deadlineText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '800',
    
  },
  relateArea: {
    flexDirection: 'row',
    gap: 6,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
