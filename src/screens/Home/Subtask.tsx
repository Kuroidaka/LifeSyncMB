import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Img } from '../../../assets/svg';

interface SubTaskProps {
  color: string | null;
  title: string;
  done: boolean;
  updateSubCheck: (id: string | number, checked: boolean) => void;
  updateSubTitle: (id: string | number, value: string) => void;
  id: string | number;
  deleteSubTask: (id: string | number) => void;
  mode: 'edit' | 'view';
}

const SubTask: React.FC<SubTaskProps> = (props) => {
  const {
    color,
    title,
    done,
    updateSubCheck,
    updateSubTitle,
    id,
    deleteSubTask,
    mode,
  } = props;

  const [checked, setChecked] = useState<boolean>(done);
  const [edit, setEdit] = useState<boolean>(false);
  const [value, setValue] = useState<string>(title);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const handleCheck = () => {
    if (mode !== 'view') {
      setChecked(!checked);
      updateSubCheck(id, !checked);
    }
  };

  const openEdit = () => {
    setEdit(true);
  };

  const closeEdit = async () => {
    setEdit(false);
    await updateSubTitle(id, value);
  };

  const handleInput = (text: string) => {
    setValue(text);
  };

  const handleSubmitEditing = () => {
    closeEdit();
  };

  const handleDel = () => {
    deleteSubTask(id);
  };

  return (
    <View
      style={[
        styles.subTaskContainer,
        // (color === '' ? styles.textWhite : null)
      ]}

    >
      <View style={styles.titleWrapper}>
        <TouchableOpacity
          onPress={handleCheck}
          style={checked ? styles.blur : null}
        >
          {checked ? <Img.checkboxChecked /> : <Img.checkbox />}
        </TouchableOpacity>
        <View style={[styles.title, 
            // checked ? styles.lineThrough : null
            ]}>
          {edit ? (
            <TextInput
              value={value}
              onChangeText={handleInput}
              onSubmitEditing={handleSubmitEditing}
              autoFocus
              style={[
                styles.input,
                color === '' ? styles.textWhite : styles.textBlack,
              ]}
              onBlur={closeEdit}
            />
          ) : (
            <Text
              onPress={openEdit}
              style={
                color === '' ? styles.textWhite : styles.textBlack
              }
            >
              {value}
            </Text>
          )}
        </View>
      </View>

      {mode !== 'view' && (
        <View style={styles.option}>
          {!edit && (
            <TouchableOpacity onPress={openEdit}>
              <Img.edit />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDel}>
            <Img.deleteIcon />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SubTask;

const styles = StyleSheet.create({
  subTaskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textBlack: {
    color: '#000000',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blur: {
    opacity: 0.5,
  },
  title: {
    marginLeft: 6,
    fontSize: 13,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  input: {
    fontSize: 14.5,
    width: '100%',
    height: 35,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  option: {
    flexDirection: 'row',
  },
});

