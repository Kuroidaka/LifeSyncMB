import React, { Fragment, useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal as RNModal } from "react-native";
import { motion } from "framer-motion";
import Loading from "./Loading";
// import TaskModal from "../Page/Planner/modal/Modal";
// import ToolsDataModal from "../Page/Chat/ToolsDataModal";
// import RelateMemoModal from "../Page/Chat/RelateMemoModal";
import ModalContext, { ModalContextType } from "../context/modal.context";
import TaskModal from "../screens/Home/Modal";
import { TaskProvider } from "../context/task.context";
import { RoutineProvider } from "../context/routine.context";
import { ScrollView } from "moti";
import { Ionicons } from '@expo/vector-icons';

interface ModalStyle {
    open: any
    closed: any
}

const Modal: React.FC = () => {
    const modalContext = useContext<ModalContextType | undefined>(ModalContext);

    // useEffect(() => {
    //     console.log("listen event opening modal");
    //     const openingModal = () => {
    //         setTimeout(() => {
    //             modalContext?.setIsDataLoaded(true);
    //         }, 500);
    //     };

    //     window.addEventListener("modalOpening", openingModal);
    //     window.addEventListener("modalClosing", () => { });

    //     return () => {
    //         window.removeEventListener("modalOpening", openingModal);
    //     };
    // }, []);

    const modalStyle: ModalStyle = {
        open: {
            width: "100%",
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 50,
            },
        },
        closed: {
            width: 0,
            opacity: 0,
            transition: {
                delay: 0,
                type: "spring",
                stiffness: 900,
                damping: 40,
            },
        },
    };

    const hdleToggle = () => {
        modalContext?.closeModal();
    };

    const renderModalContent = () => {
        if (!modalContext) return;
        const { modal } = modalContext;
        if (modal.type && ["task", "goal", "routine"].includes(modal.type)) {
            return <TaskModal />;
        }
        // if (modal.type === "tool") {
        //   return <ToolsDataModal />;
        // }
        // if (modal.type === "memo") {
        //   return <RelateMemoModal />;
        // }
    };

    return (
        <RNModal visible={modalContext?.modal.isOpen} onRequestClose={hdleToggle} >
            <Animated.View
                style={[
                    styles.container,
                    modalContext?.modal.isOpen ? modalStyle.open : modalStyle.closed
                ]}
            >
                <View style={styles.title}>
                    <Text style={styles.titleText}>{modalContext?.modal.title || "Hello"}</Text>
                    <TouchableOpacity onPress={hdleToggle}>
                        <Ionicons name="close-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TaskProvider>
                    <RoutineProvider>
                        <View style={styles.modalContent}>
                            {modalContext?.isDataLoaded ? renderModalContent() :
                                <View style={styles.loadingWrapper}>
                                    <Loading />
                                </View>}
                                
                        </View>
                    </RoutineProvider>
                </TaskProvider>
            </Animated.View>
        </RNModal>
    );
};

export default Modal;

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        opacity: 1,
        zIndex: 1002,
        backgroundColor: "#ffffff",
    },
    title: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        height: 60,
    },
    titleText: {
        fontSize: 23,
        color: "#2c2c2c",
    },
    loadingWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        height: "100%",
        width: "100%",
        position: "relative",
        // justifyContent: "center",
        // alignItems: "center",
        // display: "flex",
    }
});
