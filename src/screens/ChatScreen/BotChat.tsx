import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Replacing web-based icons with Ionicons for React Native
// import Logo from '../../../assets/img/Logo';
import MarkDown from '../../components/MarkDown';
import { Card as TaskCard } from '../Home/Task/TaskCard';
import { Card as RoutineCard } from '../Home/Routine/RoutineCard';
import ModalContext from '../../context/modal.context';
import { FunctionAgentType, MemoStorageType } from '../../types/conversation.type';


const functionIcon: { [key: string]: { icon: string; process: string; done?: string } } = {
    "create_reminder": {
        "icon": "⏱️",
        "process": "Reminder Creating",
        "done": "Reminder Created"
    },
    "get_current_weather": {
        "icon": "☁️",
        "process": "Weather Getting",
        "done": "Weather"
    },
    "browse": {
        "icon": "🔍",
        "process": "Google Browsing",
        "done": "Google Browsed"
    },
    "ask_about_document": {
        "icon": "📁",
        "process": "Document Finding",
        "done": "Document Found"
    },
    "database_chat": {
        "icon": "🛢️",
        "process": "Database Chatting",
        "done": "Database Chat"
    },
    "generate_image": {
        "icon": "🖼️",
        "process": "Image Generating",
        "done": "Image Generated"
    },
    "follow_up_image_in_chat": {
        "icon": "👁️",
        "process": "Looking up Image",
        "done": "Image answered"
    },
    "scrape_website": {
        "icon": "🔗",
        "process": "Website Scraping",
        "done": "Website Scraped"
    },
    "ReminderChatService": {
        "icon": "⏱️",
        "process": "Query Tasks",
    },
    "RoutineChatService": {
        "icon": "⏱️",
        "process": "Query Routines",
    },
    "ReminderCreateChatService": {
        "icon": "⏱️",
        "process": "Create Task",
    },
    "RoutineCreateChatService": {
        "icon": "⏱️",
        "process": "Create Routine",
    },
    "FileAskChatService": {
        "icon": "📁",
        "process": "File Search",
    }

    // Add the rest of your functionIcon definitions here
};



interface BotMsgProps {
    text: string;
    className?: string;
    functionList?: FunctionAgentType[];
    memoryDetail?: MemoStorageType[];
    memoStorage?: MemoStorageType[];
}

const BotMsg: React.FC<BotMsgProps> = ({ text, className, functionList = [], memoryDetail, memoStorage }) => {
    const [thinking, setThinking] = useState(true);
    useEffect(() => {
        if (text.length > 0 || functionList.length > 0) {
            setThinking(false);
        }
    }, [text, functionList]);


    const renderMemoryDetail = () => {
        if (memoryDetail && memoryDetail.length > 0) {
            return <MemoAgent memo={memoryDetail} />;
        }
        return null;
    };

    const renderFunctionList = () => {
        if (functionList && functionList.length > 0) {
            return functionList.map((agent) => (
                <View key={agent.id} style={styles.functionDataWrapper}>
                    <FunctionAgent agent={agent} />
                    <View style={styles.funcDataList}>
                        <FunctionData agent={agent} />
                    </View>
                </View>
            ));
        }
        return null;
    };

    const renderMemoStorage = () => {
        if (memoStorage && memoStorage.length > 0) {
            return <MemoStorageAgent memoStorage={memoStorage} />;
        }
        return null;
    };

    return (
        <View style={[styles.container]}>
            <View style={styles.chatContent}>
                <Text style={styles.chatPerson}>{"Raine"}</Text>
                {thinking && <Text>Thinking...</Text>}
                {renderMemoryDetail()}
                {renderFunctionList()}
                {(text || functionList.length > 0) && (
                    <View style={styles.botTextWrapper}>
                        <MarkDown text={text} />
                    </View>
                )}
                {renderMemoStorage()}
            </View>
        </View>
    );
};

const FunctionAgent = ({ agent }: { agent: FunctionAgentType }) => {
    const modalContext = useContext(ModalContext);
    const [listFuncData, setListFuncData] = useState<FunctionAgentType>();

    useEffect(() => {
        const processFunctionListType = () => {
            try {
                const data = { ...agent, data: JSON.parse(agent.data) };
                setListFuncData(data);
            } catch (error) {
                setListFuncData(agent);
            }
        };

        processFunctionListType();
    }, [agent]);

    const handleClickShow = () => {
        const title = agent.name;
        const content = listFuncData;
        const type = 'tool';
        const mode = 'view';
        modalContext?.openModal(title, content, type, mode);
    };

    return (
        <View style={styles.functionAgent}>
            <View style={styles.function}>
                <Text style={styles.functionTitle}>
                    <Ionicons name="pricetag-outline" size={12} /> Task Added:
                </Text>
                <View style={styles.functionName}>
                    <Text>{functionIcon[agent.name]?.icon}</Text>
                    <Text>{functionIcon[agent.name]?.process}</Text>
                </View>
            </View>
            {(listFuncData && listFuncData?.comment || listFuncData?.data) && (
                <TouchableOpacity onPress={handleClickShow}>
                    <Ionicons name="terminal" size={20} color="black" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const MemoAgent = ({ memo }: { memo: MemoStorageType[] }) => {
    const modalContext = useContext(ModalContext);

    const handleClickShow = () => {
        const title = 'Related Memory';
        const content = memo;
        const type = 'memo';
        const mode = 'view';
        modalContext?.openModal(title, content, type, mode);
    };

    return (
        <View style={styles.functionAgent}>
            <View style={styles.memo}>
                <Text style={styles.memoTitle}>
                    <Ionicons name="pricetag-outline" size={12} /> Related Memory
                </Text>
                <TouchableOpacity onPress={handleClickShow}>
                    <Ionicons name="terminal" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const MemoStorageAgent = ({ memoStorage }: { memoStorage: MemoStorageType[] }) => {
    const modalContext = useContext(ModalContext);

    const handleClickShow = () => {
        const title = 'Memory saved';
        const content = memoStorage;
        const type = 'memo';
        const mode = 'view';
        modalContext?.openModal(title, content, type, mode);
    };

    return (
        <View style={styles.memoAgent}>
            <View style={styles.memo}>
                <Text style={styles.memoTitle}>Memory Saved</Text>
                <TouchableOpacity onPress={handleClickShow}>
                    <Ionicons name="terminal" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const FunctionData = ({ agent }: { agent: FunctionAgentType }) => {
    const [listFuncData, setListFuncData] = useState([]);

    useEffect(() => {
        const processFunctionListType = () => {
            try {
                let data = typeof agent.data === 'string' ? JSON.parse(agent.data) : agent.data;
                // setListFuncData(Array.isArray(data) ? data : data ? [data] : []);
                setListFuncData(data);
            } catch (error) {
                console.error('Failed to parse agent data:', error);
                setListFuncData([]);
            }
        };

        processFunctionListType();
    }, [agent]);

    const renderCards = () => {
        if (!listFuncData || listFuncData.length === 0) return null;

        const cardComponents: { [key: string]: React.FC<any> } = {
            "ReminderChatService": TaskCard,
            "RoutineChatService": RoutineCard,
            "ReminderCreateChatService": TaskCard,
            "RoutineCreateChatService": RoutineCard,
            // Add more mappings here if necessary
        };

        const CardComponent = cardComponents[agent.name];
        if (!CardComponent) return null;

        return (
            <View style={styles.funcDataBox}>
                {listFuncData && listFuncData.length > 0 && listFuncData.map((funcData: any) => (
                    <CardComponent key={funcData.id} data={funcData} mode="view" />
                ))}
            </View>
        );
    };

    return renderCards();
};

export default React.memo(BotMsg);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        
    },
    iconContainer: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D4DBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botIcon: {
        width: 30,
    },
    chatContent: {
        marginLeft: 18,
        maxWidth: '85%',
    },
    chatPerson: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 7,
    },
    botTextWrapper: {
        padding: 10,
        borderRadius: 10,
        minWidth: '50%',
        marginBottom: 10,
        backgroundColor: '#aeaeae',
    },
    functionAgent: {
        backgroundColor: '#aeaeae',
        borderRadius: 10,
        padding: 5,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    function: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    memo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    functionTitle: {
        fontWeight: '800',
        fontSize: 13,
        marginRight: 5,
    },
    functionName: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 2,
        fontWeight: '800',
    },
    memoAgent: {
        backgroundColor: '#aeaeae',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    memoTitle: {
        fontWeight: '800',
        fontSize: 13,
        marginRight: 5,
        flex: 1,
    },
    funcDataBox: {
        backgroundColor: '#aeaeae',
        padding: 10,
        borderRadius: 10,
    },
    funcDataList: {
        marginTop: 10,
    },
    functionDataWrapper: {
        marginBottom: 10,
    },
});
