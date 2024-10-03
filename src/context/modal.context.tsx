import React, { createContext, useState } from "react";
import Loading from "../components/Loading";

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export interface ModalContextType {
    modal: ModalState,
    openModal: (title: string | null, content: any | null, type: string | null, mode: string) => void,
    closeModal: () => void,
    isDataLoaded: boolean,
    setIsDataLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

interface ModalState {
    isOpen: boolean,
    title: string | null, 
    content: any | null, 
    type: string | null, 
    mode: string | null
}

export const ModalProvider: React.FC<{children: React.ReactNode}> = (p) => {
    const { children } = p

    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        title: null,
        content: null,
        type: null,
        mode: null
    });

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const openModal = (
        title: string | null = null, 
        content: any | null = null, 
        type: string | null = null, 
        mode: string = "view"
    ) => {
        console.log("open modal with content", content);
        setModal({
            isOpen: true,
            title,
            content,
            type,
            mode
        });

        setTimeout(() => {
            setIsDataLoaded(true);
        }, 500);
        // Remove the window event dispatch since it's not needed in React Native
    };

    const closeModal = () => {
        console.log("close modal");
        setModal({
            isOpen: false,
            title: null,
            content: null,
            type: null,
            mode: null
        });
        setIsDataLoaded(false);
    };

    const valueContext = {
        modal, 
        openModal, 
        closeModal, 
        isDataLoaded, 
        setIsDataLoaded,
    };

    return (
        <ModalContext.Provider value={valueContext}>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalContext;
