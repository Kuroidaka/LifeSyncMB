import React, { useContext, useEffect, useState, useRef, Fragment } from "react";
import { View, Text, TextInput, ScrollView, Button, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, Switch } from "react-native";
import ModalContext from "../../../context/modal.context";
import RoutineContext from "../../../context/routine.context";
import { dateConvert, formatTimeHHmm } from "../../../utils";
import { colorList, relatedArea } from "./constants";
// import VideoChatPreview from "../../Chat/Box/VideoPreview";
import Toast from 'react-native-toast-message';
// import DateTimePickerModal from "react-native-modal-datetime-picker"; // to replace flatpickr
import { API_BASE_URL, PREFIX } from '../../../constant/BaseURl';
import { Ionicons } from '@expo/vector-icons';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, returnedResults } from 'reanimated-color-picker';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";



// Types
type RoutineProps = {
  dataInput: any;
  setDataInput: React.Dispatch<React.SetStateAction<any>>;
  mode: string;
  areaData: any;
};

const Routine: React.FC<RoutineProps> = ({ dataInput, setDataInput, mode, areaData }) => {
  const modalContext = useContext(ModalContext);
  const routineContext = useContext(RoutineContext);
  const [valid, setValid] = useState(true);
  const [hex, setHex] = useState(dataInput.color);
  const [area, setArea] = useState(areaData);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [secOpen, setSecOpen] = useState({
    color: true,
    area: true,
    note: true,
    deadline: true,
    attachment: true,
  });

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
      const newData = { ...dataInput };
      if (!newData.routineTime) {
        newData.routineTime = new Date();
      }
      newData.routineTime = formatTimeHHmm(newData.routineTime);


      console.log(newData);
      try {
        if (mode === "edit") {
          const routineId = modalContext?.modal.content.id;
          const res = await routineContext?.handleUpdateRoutine(routineId, newData);
          if (res) {
            modalContext?.closeModal();
          }
        } else {
          const res = await routineContext?.handleAddRoutine(newData);
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


  const handleChooseDateRoutine = (date: { dates: DateType[]; datePressed: DateType; change: "added" | "removed"; }) => {
    console.log(date);
    if (mode === "view") return null
    const dates = date.dates.map((data: DateType) => ({ completion_date: data }))
    console.log(dates);
    setDataInput({ ...dataInput, routineDate: dates })
  }

  const timePicker = {
    open: () => {
      setTimePickerVisibility(true);
    },
    close: () => {
      setTimePickerVisibility(false);
    }
  }

  const handleDateConfirm = (date: Date) => {
    setDataInput({ ...dataInput, routineTime: date });
    timePicker.close();
  };
  const checkChoseArea = (area: string) => {
    return dataInput.area.some((item: any) => item === area)
  }

  return (
    <View style={{ padding: 20 }}>
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
        <ColorPicker style={{ width: '70%' }} value={hex || "#000000"} onComplete={handleColorChange}>
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

      {/* Status */}
      <Section title="Status" visible={mode === "edit" ? true : false}>
        <Switch
          value={dataInput.isActive}
          onValueChange={(value) => setDataInput({ ...dataInput, isActive: value })}
        />
        {dataInput.isActive ? <Text style={{ color: "green" }}>Active</Text> : <Text style={{ color: "red" }}>Inactive</Text>}
      </Section>


      {/* ROUTINE TIME */}
      <Section title="Routine Time" editAble={true} onClickEdit={timePicker.open}>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          date={dataInput.routineTime}
          mode="time"
          onConfirm={handleDateConfirm}
          onCancel={timePicker.close}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{formatTimeHHmm(dataInput.routineTime || new Date())}</Text>
      </Section>

      {/* DEADLINE */}
      <Section title="Complete Date" visible={mode === "edit" ? true : false} >
        <DateTimePicker
          mode="multiple"
          dates={dataInput.routineDate.map((data: any) => data.completion_date)}
          onChange={(params) => handleChooseDateRoutine(params)}
          timePicker={true}
        />

      </Section>

      {/* NOTE */}
      <Section title="Note">
        <TextInput

          multiline
          numberOfLines={4}
          value={dataInput.note}
          onChangeText={(value) => setDataInput({ ...dataInput, note: value })}
          style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: "100%" }}
        />
      </Section>


      {/* SAVE BUTTON */}
      {mode !== "view" && <Button title="Save" onPress={handleSave} />}
    </View>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  editAble?: boolean;
  onClickEdit?: () => void;
  visible?: boolean;
}

const Section: React.FC<SectionProps> = (p) => {
  const { title, children, editAble = false, onClickEdit, visible = true } = p;

  if (!visible) return null;
  return (
    <View style={styles.section}>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {editAble && <Ionicons name="create-outline" size={24} color="black" onPress={onClickEdit} />}
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

export default Routine;


const styles = StyleSheet.create({

  section: {
    marginBottom: 20,
    borderBottomWidth: .5,
    borderRadius: 10,
    borderColor: "#cfcfcf",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
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