import React, { useContext, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { TaskContext, TaskContextProps } from '../../../context/task.context';
// import { ModalContext } from '../../context/ModalContext';
import SubTask from './Subtask';
import AddSubTask from './AddSubTask';
import { SubTaskType } from '../../../types/task.type';
import { dateConvert } from '../../../utils';
import { Img } from '../../../../assets/svg/index';
import { Path, Polyline, Rect, Svg } from 'react-native-svg';

import { Ionicons } from '@expo/vector-icons';
import TaskOptions from './TaskOption';
import ModalContext from '../../../context/modal.context';
import Toast from 'react-native-toast-message'
import reminderApi from '../../../api/reminder.api';
import { relatedArea } from '../Modal/constants';


interface CardProps {
  data: {
    id: string;
    title: string;
    color?: string | null;
    deadline?: string | Date;
    area?: string[];
    note?: string;
    subTask?: SubTaskType[];
    status: boolean;
  }
  mode?: 'edit' | 'view';
}

export const Card: React.FC<CardProps> = (props) => {
  const {
    data: {
      title,
      color = null,
      deadline = new Date(),
      area = [],
      note = '',
      subTask = [],
      id,
      status
    },
    mode = 'edit',
  } = props;

  const { handleCheckTask, handleDeleteTask } = useContext(TaskContext) as TaskContextProps;
  const modalContext = useContext(ModalContext);

  const [checked, setChecked] = useState<boolean>(status);
  const [subOpen, setSubOpen] = useState<boolean>(false);
  const [subs, setSubs] = useState<SubTaskType[]>(subTask);
  const [subDone, setSubDone] = useState<number>(0);
  const [optionVisible, setOptionVisible] = useState<boolean>(false);

  const countCurrSub = (dataSub: SubTaskType[]): number => {
    return dataSub.reduce((total, curr) => {
      return curr.status ? total + 1 : total;
    }, 0);
  };

  const memoizedCount = useMemo(() => countCurrSub(subs), [subs]);

  useEffect(() => {
    setSubDone(memoizedCount);
  }, [memoizedCount]);

  const taskHandle = {
    open: () => {
      const data = {
        title,
        color,
        deadline,
        area,
        note,
        id,
      };
      modalContext?.openModal(title, data, 'task', mode);
    },
    check: async (id: string) => {
      if (mode !== 'view') {
        handleCheckTask(id);
        setChecked(!checked);
      }
    },
    option: {
      toggle: () => {
        setOptionVisible(!optionVisible);
      },
      delete: async (id: string) => {
        console.log("id:", id);
        handleDeleteTask(id);
      },
    },
  };

  const subTaskHandle = {
    delete: async (subId: string) => {
      try {
        let newSub = [...subs];
        // Implement your deleteSubTask API call here
        await reminderApi.deleteSubTask(subId)
        newSub = newSub.filter((data) => data.id !== subId);
        setSubs(newSub);
      } catch (error: any) {
        // Handle error
      }
    },
    add: async (data: any) => {
      try {
        // Implement your addSubTask API call here

        const { data: subData } = await reminderApi.addSubTask(id, data)
        console.log("subData:", subData);
        const newData = [...subs, subData];
        setSubs(newData);

      } catch (error: any) {
        // Handle error
        Toast.show({
          text1: 'Error add sub task',
          type: 'error',
        });
      }
    },
    open: () => setSubOpen(!subOpen),
    updateSubtask: async (
      subId: string,
      updates: Partial<SubTaskType>
    ) => {
      try {
        const newSub = [...subs];
        await reminderApi.updateSubTask(subId, updates);
        const index = newSub.findIndex((e) => e.id === subId);
        if (index !== -1) {
          newSub[index] = { ...newSub[index], ...updates };
          setSubs(newSub);
        }
      } catch (error: any) {
        Toast.show({
          text1: 'Error update sub task',
          type: 'error',
        });
      }
    },
    check: async (subId: string, check: boolean) => {
      await subTaskHandle.updateSubtask(subId, { status: check });
    },
    update: async (subId: string, title: string) => {
      console.log("subId:", subId, "title:", title);
      const newSub = [...subs]; // Prevent mutating
    
      await subTaskHandle.updateSubtask(subId, { title });
      const index = newSub.findIndex(e => e.id === subId);
      
      if (index !== -1) {
          newSub[index] = { ...newSub[index], ...{ title } };
          setSubs(newSub);
      }
    },
  };

  const Area: React.FC<{ data: any }> = ({ data }) => {

    const iconName = relatedArea.find(item => item.name === data.area)?.icon;
    console.log("iconName:", iconName);
    const ImageComponent = <Ionicons name={iconName as any} size={25} color="black" />;
    if (ImageComponent) return ImageComponent;
    return null;
  };

  return (
    <View
      style={[
        styles.taskCardContainer,
        { backgroundColor: color || '#fbe0e0' },
      ]}
    >
      <View style={styles.mainTask}>
        <View
          style={[
            styles.cardTitle,
            checked && styles.blur,
          ]}
        >
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => taskHandle.check(id as string)}>
              {checked
                ? <Ionicons name="checkbox-outline" size={32} color="black" />
                : <Ionicons name="square-outline" size={32} color="black" />}

            </TouchableOpacity>
            <Text
              style={[styles.titleText, checked && styles.lineThrough]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <View style={styles.deadlineContainer}>
            <Ionicons name="hourglass-outline" size={24} color="black" />


            <Text style={styles.deadlineText}>{dateConvert(deadline)}</Text>
          </View>

          <View style={styles.relateArea}>
            {area.length > 0 &&
              area.map((item, idx) => <Area key={idx} data={item} />)}
          </View>
        </View>

        <TouchableOpacity
          style={styles.cardSub}
          onPress={subTaskHandle.open}
        >
          {subs.length > 0 && (
            <Text style={styles.subText}>
              ({subDone}/{subs.length})
            </Text>
          )}
          <Ionicons name="list-outline" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.cardOption}>
          {mode !== 'view' && (
            <TouchableOpacity
              style={styles.optionBtnCon}
              onPress={taskHandle.option.toggle}
            >
              <Ionicons name="ellipsis-vertical-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={taskHandle.open}>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {subOpen && (
        <>
          <View style={styles.subTaskList}>
            {subs.length > 0 &&
              subs.map((sub, idx) => (
                <SubTask
                  key={idx}
                  id={sub.id}
                  color={color}
                  title={sub.title}
                  done={sub.status}
                  updateSubTitle={subTaskHandle.update}
                  updateSubCheck={subTaskHandle.check}
                  deleteSubTask={subTaskHandle.delete}
                  mode={mode}
                />
              ))}
          </View>
          {mode !== 'view' && (
            <AddSubTask
              id={id}
              color={color}
              AddSub={subTaskHandle.add}
              placeholder={subs.length > 0 ? '' : 'Add subtask'}
            />
          )}
        </>
      )}


      {/* Option Menu */}
      {optionVisible && (
        <TaskOptions id={id} taskHandle={taskHandle.option} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskCardContainer: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  mainTask: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    flex: 1,
  },
  blur: {
    opacity: 0.5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
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
    fontSize: 14,
  },
  relateArea: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  cardSub: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  subText: {
    fontSize: 14,
    marginRight: 4,
  },
  cardOption: {
    flexDirection: 'row',
  },
  optionBtnCon: {
    marginRight: 5,
  },
  subTaskList: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionContainer: {
    position: 'absolute',
    top: 0,
    right: -10,
    width: 200,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  optionItem: {
    paddingVertical: 10,
  },
});



