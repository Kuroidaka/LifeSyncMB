import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, Button, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import ModalContext from "../../../context/modal.context";
import TaskContext from "../../../context/task.context";
import { dateConvert } from "../../../utils";
import { colorList, relatedArea } from "./constants";
// import VideoChatPreview from "../../Chat/Box/VideoPreview";
import Toast from 'react-native-toast-message';
// import DateTimePickerModal from "react-native-modal-datetime-picker"; // to replace flatpickr
import { API_BASE_URL, PREFIX } from '../../../constant/BaseURl';
import { Ionicons } from '@expo/vector-icons';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, returnedResults } from 'reanimated-color-picker';
import DateTimePicker from 'react-native-ui-datepicker';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';



// Types
type TaskProps = {
  dataInput: any;
  setDataInput: React.Dispatch<React.SetStateAction<any>>;
  mode: string;
  areaData: any;
};

const Task: React.FC<TaskProps> = ({ dataInput, setDataInput, mode, areaData }) => {
  const modalContext = useContext(ModalContext);
  const taskContext = useContext(TaskContext);
  const [valid, setValid] = useState(true);
  const [hex, setHex] = useState(dataInput.color);
  const [area, setArea] = useState(areaData);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [secOpen, setSecOpen] = useState({
    color: true,
    area: true,
    note: true,
    deadline: true,
    attachment: true,
  });

  const _editor = useRef<QuillEditor>(null);


  useEffect(() => {
    areaData && setArea(areaData);
  }, [areaData]);

  useEffect(() => {
    if (dataInput.color) {
      setHex(dataInput.color);
    }
  }, [dataInput]);

  const handleChooseArea = (name: string) => {
    let newArea = { ...area, [name]: !area[name] }; 
    setArea(newArea);
  
    const newData = Object.entries(newArea).reduce((prev: any[], [key, value]) => {
      if (value) {
        return [...prev, key];
      }
      return prev;
    }, []);

    
    setDataInput({ ...dataInput, area: newData });
  };

  const handleSave = async () => {
    const isValid = checkValid();
    if (isValid) {
      console.log(dataInput);
      try {
        if (mode === "edit") {
          const taskId = modalContext?.modal.content.id;
          const res = await taskContext?.handleUpdateTask(taskId, dataInput) ;
          if (res) {
            modalContext?.closeModal();
          }
        } else {
          const res = await taskContext?.handleAddTask(dataInput);
          if (res) {
            modalContext?.closeModal();
          }
        }

      } catch (error) {
        Toast.show({
          text1: 'An error occurred',
          type: 'danger',
        });
      }
    }
  };

  const checkValid = () => {
    if (!dataInput.title || dataInput.title.trim() === "") {
      setValid(false);
      return false;
    }
    return true;
  };

  const handleColorChange = (color: returnedResults) => {
    setDataInput({ ...dataInput, color: color.hex });
  };

  const handleDateConfirm = (date: Date) => {
    setDataInput({ ...dataInput, deadline: date.toString() });
    setDatePickerVisibility(false);
  };
  const checkChoseArea = (area: string) => {
    return dataInput.area.some((item: any) => item === area)
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* TITLE */}
      <Section title="Title">
        <TextInput
          value={dataInput.title}
          onChangeText={(value) => setDataInput({ ...dataInput, title: value })}
          style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: "100%" }}
        />
        {!valid && <Text style={{ color: "red" }}>Title is required</Text>}
      </Section>


      {/* COLOR */}
      <Section title="Color">
        <ColorPicker style={{ width: '70%' }} value={hex} onComplete={handleColorChange}>
          <Swatches colors={colorList} />
          <Preview />
        </ColorPicker>

      </Section>

      {/* AREA */}
      <Section title="Related Areas">
        <View style={styles.IconList}>
          {relatedArea.map((data) => (
            <TouchableOpacity key={data.name} onPress={() => handleChooseArea(data.name)}>
              <View style={[
                styles.IconWrapper, 
                checkChoseArea(data.name) ? styles.IconWrapperActive : null
              ]}>
                <Ionicons name={data.icon as any} size={24} color="black" />
                <Text>{data.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      {/* DEADLINE */}
      <Section title="Deadline">
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <Text>{dataInput.deadline ? dateConvert(dataInput.deadline) : "Select Deadline"}</Text>
        </TouchableOpacity>
        {/* <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        /> */}
        <DateTimePicker
          mode="single"
          date={dataInput.deadline}
          onChange={(params) => setDataInput({ ...dataInput, deadline: params.date })}
          timePicker={true}
        />
      </Section>

      {/* NOTE */}
      <Section title="Note">
        {/* <TextInput
          multiline
          numberOfLines={4}
          value={dataInput.note}
          onChangeText={(value) => setDataInput({ ...dataInput, note: value })}
          style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        /> */}
        <SafeAreaView style={{ flex: 1 }}>
          {/* <StatusBar style="auto" /> */}
          <QuillEditor
            style={{ flex: 1 }}
            ref={_editor}
            initialHtml={dataInput.note}
          />
          <QuillToolbar editor={_editor} options="full" theme="light" />
        </SafeAreaView>
      </Section>

      {/* ATTACHMENT */}
      <Section title="Attachments">
        <></>
        {/* {dataInput.taskAttachment?.map((item: any) => (
          <VideoChatPreview
            key={item.id}
            videoSrc={`${API_BASE_URL}${PREFIX}file/stream/${item.name}?type=video`}
            name={item.name}
          />
        ))} */}
      </Section>

      {/* SAVE BUTTON */}
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = (p) => {
  const { title, children } = p;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

export default Task;


const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  sectionContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  IconList: {
    flexDirection: "row",  // Arrange items in a row
    flexWrap: "wrap",      // Allow items to wrap into the next row
    justifyContent: "space-around", // Add space between items
    alignItems: "center",  // Center the items vertically
    marginVertical: 10,    // Add vertical spacing for the grid
    gap: 20,
  },
  IconWrapper: {    // Adjust width to fit 3 items per row
    alignItems: "center",  // Center the icon and text
    marginBottom: 20,
    justifyContent: "center",
  },
  IconWrapperActive: {
    borderRadius: 10,
    padding: 2,
    backgroundColor: "rgb(186 186 186)",
  }
});