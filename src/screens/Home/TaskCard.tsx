import React, { useContext, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { TaskContext, TaskContextProps } from '../../context/task.context';
// import { ModalContext } from '../../context/ModalContext';
import SubTask from './Subtask';
import AddSubTask from './AddSubTask';
import { SubTaskType } from '../../types/task.type';
import { dateConvert } from '../../utils';
import { Img } from '../../../assets/svg/index';




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
    data:  {
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
  // const { openModal } = useContext(ModalContext);

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
      // openModal(title, data, 'task', mode);
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
        Alert.alert(
          'Delete Task',
          'Are you sure you want to delete this task?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'OK',
              onPress: async () => {
                handleDeleteTask(id);
              },
            },
          ],
          { cancelable: true }
        );
      },
    },
  };

  const subTaskHandle = {
    delete: async (subId: string | number) => {
      try {
        let newSub = [...subs];
        // Implement your deleteSubTask API call here
        newSub = newSub.filter((data) => data.id !== subId);
        setSubs(newSub);
      } catch (error: any) {
        // Handle error
      }
    },
    add: async (data: any) => {
      try {
        // Implement your addSubTask API call here
        const subData = data; // Replace with API response
        const newData = [...subs, subData];
        setSubs(newData);
      } catch (error: any) {
        // Handle error
      }
    },
    open: () => setSubOpen(!subOpen),
    updateSubtask: async (
      subId: string | number,
      updates: Partial<SubTaskType>
    ) => {
      try {
        const newSub = [...subs];
        // Implement your updateSubTask API call here
        const index = newSub.findIndex((e) => e.id === subId);
        if (index !== -1) {
          newSub[index] = { ...newSub[index], ...updates };
          setSubs(newSub);
        }
      } catch (error: any) {
        // Handle error
      }
    },
    check: async (subId: string | number, check: boolean) => {
      await subTaskHandle.updateSubtask(subId, { status: check });
    },
    update: async (subId: string | number, title: string) => {
      await subTaskHandle.updateSubtask(subId, { title });
    },
  };

  const Area: React.FC<{ data: string }> = ({ data }) => {
    const ImageComponent = Img[data as keyof typeof Img];
    if (ImageComponent) return <ImageComponent />;
    return null;
  };

  return (
    <View
      style={[
        styles.taskCardContainer,
        { backgroundColor: color || '#FFFFFF' },
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
              {checked ? <Img.checkboxChecked /> : <Img.checkbox />}
            </TouchableOpacity>
            <Text
              style={[styles.titleText, checked && styles.lineThrough]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <View style={styles.deadlineContainer}>
            <Img.deadline />
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
          <Img.subTask />
        </TouchableOpacity>

        <View style={styles.cardOption}>
          {mode !== 'view' && (
            <TouchableOpacity
              style={styles.optionBtnCon}
              onPress={taskHandle.option.toggle}
            >
              <Img.option />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={taskHandle.open}>
            <Img.arrowRight />
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
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={taskHandle.open}
          >
            <Text>Edit Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => taskHandle.option.delete(id as string)}
          >
            <Text>Delete Task</Text>
          </TouchableOpacity>
        </View>
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



