import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Img } from '../../../assets/svg'; // Adjust the import path as necessary

interface AddSubTaskProps {
  id: string | number;
  color: string | null;
  AddSub: (data: { title: string }) => void;
  placeholder: string;
}

const AddSubTask: React.FC<AddSubTaskProps> = (props) => {
  const { id, color, AddSub, placeholder } = props;

  const [value, setValue] = useState<string>('');

  const inputRef = useRef<TextInput>(null);

  const handleInput = (text: string) => {
    setValue(text);
  };

  const saveSubTask = async () => {
    try {
      const newData = {
        title: value,
      };
      AddSub(newData);
      setValue('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddSubTask = () => {
    saveSubTask();
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View
      style={[
        styles.addSubTaskContainer,
        // color === '' ? styles.textWhite : null,
      ]}
    >
      {value === '' ? (
        <TouchableOpacity onPress={focusInput}>
          <Img.plus />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={saveSubTask}>
          <Img.plusCircle />
        </TouchableOpacity>
      )}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleInput}
        onSubmitEditing={handleAddSubTask}
        placeholder={placeholder}
        style={[
          styles.input,
          color !== '' ? styles.textWhite : styles.textBlack,
        ]}
        placeholderTextColor={color !== '' ? '#FFFFFF' : '#000000'}
      />
    </View>
  );
};

export default AddSubTask;

const styles = StyleSheet.create({
  addSubTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textBlack: {
    color: '#000000',
  },
  input: {
    width: '80%',
    height: 35,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 8,
  },
});
