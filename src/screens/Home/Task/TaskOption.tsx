import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import TaskContext from '../../../context/task.context';

// Define the types for props and the option structure
interface TaskOptionsProps {
  id: string;
  taskHandle: {
    
    delete: (id: string) => void;
  };
}

interface Option {
  label: string;
  action: () => void;
}

const TaskOptions: React.FC<TaskOptionsProps> = ({ id, taskHandle }) => {

  // Define your options as an array of objects
  const options: Option[] = [
    {
      label: 'Delete Task',
      action: () => {
        taskHandle.delete(id);
      },
    },
    // You can easily add more options here
    // {
    //   label: 'Another Action',
    //   action: () => openModal('anotherAction'),
    // }
  ];

  return (
    <View>
      <View style={styles.optionContainer}>
        {/* Render each option dynamically */}
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={option.action}
          >
            <Text>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  optionItem: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
});

export default TaskOptions;
