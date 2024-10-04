import React, { Fragment, useContext, useEffect, useState } from "react";
import ModalContext from "../../../context/modal.context";
import Task from "./Task";
// import Routine from "./Routine";
// import Goal from "./Goal";
import { convertTimeHHmmToDate } from "../../../utils";
import { View, Text } from "react-native"; // Import necessary components
import Routine from "./Routine";


type AreaData = {
    health: boolean;
    play: boolean;
    spirituality: boolean;
    environment: boolean;
    work: boolean;
    finance: boolean;
    development: boolean;
    relationships: boolean;
};

type DataInput = {
    title?: string;
    color?: string;
    area?: string[];
    deadline?: Date | null;
    note?: string;
    dateDone?: Date[];
    active?: boolean;
    isActive?: boolean;
    routineDate?: Date[];
    target?: string;
    routineTime?: Date;
    taskAttachment?: string[];
};

const TaskModal: React.FC = () => {
    const modalContext = useContext(ModalContext);
    const [mode, setMode] = useState<string | null>(null);
    const [dataInput, setDataInput] = useState<DataInput>({});
    const [areaData, setAreaData] = useState<AreaData>({
        health: false,
        play: false,
        spirituality: false,
        environment: false,
        work: false,
        finance: false,
        development: false,
        relationships: false,
    });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (modalContext?.modal.mode) setMode(modalContext?.modal.mode);
    }, [modalContext?.modal.mode]);

    useEffect(() => {
        const area: AreaData = {
            health: false,
            play: false,
            spirituality: false,
            environment: false,
            work: false,
            finance: false,
            development: false,
            relationships: false,
        };

        if (modalContext && modalContext.modal.content !== null) {
            const content = modalContext.modal.content;
            const areaContent = content?.area.reduce((prev: any, next: { area: keyof AreaData }) => {
                return [...prev, next.area];
            }, []);
            setDataInput({
                title: content?.title || "",
                color: content?.color || "",
                area: areaContent || [],
                deadline: content?.deadline || null,
                note: content?.note || "",
                dateDone: content?.dateDone || [],
                active: content?.active || false,
                isActive: content?.isActive || false,
                routineDate: content?.routineDate || [],
                target: content?.target || "0",
                routineTime: content?.routineTime
                    ? convertTimeHHmmToDate(content?.routineTime)
                    : new Date(),
                taskAttachment: content?.taskAttachment || [],
            });

            const relate = content.area.reduce((prev: AreaData, next: { area: keyof AreaData }) => {
                return { ...prev, [next.area]: true };
            }, area);
            setAreaData(relate);
        } else {
            setDataInput({
                title: "",
                color: "",
                note: "",
                area: [],
                routineDate: [],
            });
            setAreaData(area);
        }

        setIsInitialized(true);

        return () => setDataInput({});
    }, [modalContext, mode, modalContext?.modal.content]);

    if (!isInitialized) return null;

    return (
        <TaskContent
            type={modalContext?.modal.type}
            mode={mode || "view"}
            dataInput={dataInput}
            areaData={areaData}
            setDataInput={setDataInput}
        />
    );
};

type TaskContentProps = {
    type?: string | null;
    mode: string;
    dataInput: DataInput;
    setDataInput: React.Dispatch<React.SetStateAction<DataInput>>;
    areaData: AreaData;
};

const TaskContent: React.FC<TaskContentProps> = ({ mode, dataInput, setDataInput, areaData, type }) => {

    return (
        <Fragment>
            {type === "task"
                ? <Task dataInput={dataInput} setDataInput={setDataInput} mode={mode || "view"} areaData={areaData} />
                : <Routine dataInput={dataInput} setDataInput={setDataInput} mode={mode || "view"} areaData={areaData} />
            }
            {/* // : modal.type === "routine" ? (
            //     <Routine dataInput={dataInput} setDataInput={setDataInput} mode={mode} areaData={areaData} />
            // ) : modal.type === "goal" ? (
            //     <Goal dataInput={dataInput} setDataInput={setDataInput} mode={mode} areaData={areaData} />
            // ) : modal.type === "tool" ? (
            //     <Text>Tool Component</Text>
            // ) : null} */}
        </Fragment>
    );
};

export default TaskModal;
