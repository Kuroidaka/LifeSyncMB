import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WebSocketContext, WebSocketProvider } from './socket.context';
import conversationApi from '../api/conversation.api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import Routes from '../navigation/Routes';
import { Conversation, ConversationModify } from '../types/conversation.type';


interface CacheConversation {
    del: (id: string) => Promise<void>;
    addMsg: (
        params: { prompt: string },
        isBot?: boolean,
        functionData?: any[],
        dataMemo?: any[],
        memoStorage?: any[]
    ) => Promise<void>;
}

interface ConversationContextProps {
    conversationList: ConversationModify[] | null;
    error: unknown;
    currenConError: unknown;
    isLoading: boolean;
    currentConLoading: boolean;
    selectedConID: string | undefined;
    setSelectedConID: (id: string) => void;
    deleteConversation: (id: string) => void;
    addMsg: (data: { prompt: string }, isStream?: boolean, isVision?: boolean) => void;
    currentCon: ConversationModify | null;
    cacheConversation: CacheConversation;
}

const ConversationContext = createContext<ConversationContextProps | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [conversation, setConversation] = useState<ConversationModify[] | null>(null);
    const [currentCon, setCurrentConversation] = useState<ConversationModify | null>(null);
    const listFuncData = useRef<any[]>([]);
    const listMemoData = useRef<any[]>([]);
    const listMemoStorage = useRef<any[]>([]);
    const socketContext = useContext(WebSocketContext);
    const navigation = useNavigation();
    const [selectedConID, setSelectedConID] = useState<string | undefined>(undefined);
    const queryClient = useQueryClient();

    const { data: conversationList, error, isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: () => conversationApi.getConversationHistory(),
    });

    const {
        data: currentConData,
        isLoading: currentConLoading,
        error: currenConError,
    } = useQuery({
        queryKey: ['conversation', selectedConID],
        queryFn: () => (selectedConID ? conversationApi.getConversationHistory(selectedConID) : null),
    });

    const updateFuncDataList = (list: any[], newData: any) => {
        const existingIndex = list.findIndex((item) => item.id === newData.id);
        if (existingIndex !== -1) {
            const updatedState = [...list];
            updatedState[existingIndex] = newData;
            return updatedState;
        }
        return [...list, newData];
    };

    useEffect(() => {
        const data = conversationList?.data;
        if (data && data.length > 0) {
            setConversation(data);
        } else {
            setConversation([]);
        }
        listFuncData.current = [];
        listMemoData.current = [];
        listMemoStorage.current = [];

    }, [conversationList]);

    useEffect(() => {
        if (!selectedConID) {
            setCurrentConversation(null);
        } else if (currentConData) {
            setCurrentConversation(currentConData.data);
        }
        

        return () => {
            setCurrentConversation(null);
        }
    }, [selectedConID, currentConData]);

    useEffect(() => {
        if (socketContext?.socket) {
            socketContext?.socket.on('chatResChunk', ({ content }: { content: string }) => {
                console.log('chatResChunk', content);
                cacheConversation.addMsg({ prompt: content }, true);
            });

            socketContext?.socket.on('chatResChunkFunc', async ({ functionData, id }: { functionData: any; id: string }) => {
                const data = { id, ...functionData };
                listFuncData.current = updateFuncDataList(listFuncData.current, data);
                const params = { prompt: '' };
                const isBot = true;
                await cacheConversation.addMsg(params, isBot, listFuncData.current);
            });

            socketContext?.socket.on('chatResMemo', async ({ active, memoryDetail = [] }: { active: boolean; memoryDetail: any[] }) => {
                if (active) {
                    listMemoData.current = memoryDetail;
                    const params = { prompt: '' };
                    const isBot = true;
                    await cacheConversation.addMsg(params, isBot, listFuncData.current, listMemoData.current);
                }
            });

            socketContext?.socket.on('chatResMemoStorage', async ({
                active,
                memoryDetail = [],
            }: {
                active: boolean;
                memoryDetail: any[];
            }) => {
                if (active) {
                    listMemoStorage.current = memoryDetail;
                    const params = { prompt: '' };
                    const isBot = true;
                    await cacheConversation.addMsg(params, isBot, listFuncData.current, listMemoData.current, listMemoStorage.current);
                }
            });
        }

        return () => {
            if (socketContext?.socket) {
                socketContext?.socket.off('chatResChunk');
                socketContext?.socket.off('chatResChunkFunc');
                socketContext?.socket.off('chatResMemo');
                socketContext?.socket.off('chatResMemoStorage');
            }
        };
    }, [socketContext?.socket]);

    const cacheConversation: CacheConversation = {
        del: async (id: string) => {
            if(conversation?.length) {
                const newCon = conversation.filter((data) => data.id !== id);
                setConversation(newCon);
            }
        },
        addMsg: async (params, isBot = false, functionData = [], dataMemo = [], memoStorage = []) => {
            const updateBotMessages = (prevMessages: any[]) => {
                const newMessages = [...prevMessages];
                if (newMessages[newMessages.length - 1]?.isBot === false) {
                    newMessages.push({
                        isBot: true,
                        text: params.prompt,
                        functionData:
                            functionData.length > 0
                                ? functionData
                                : newMessages[newMessages.length - 1]?.functionData || [],
                        ...(dataMemo && { relatedMemo: JSON.stringify(dataMemo) }),
                        ...(memoStorage && { memoStorage: memoStorage }),
                    });
                } else {
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        isBot: true,
                        text: newMessages[newMessages.length - 1].text + params.prompt,
                        functionData:
                            functionData.length > 0
                                ? functionData
                                : newMessages[newMessages.length - 1]?.functionData || [],
                        ...(dataMemo && { relatedMemo: JSON.stringify(dataMemo) }),
                        ...(memoStorage && { memoStorage: memoStorage }),
                    };
                }
                return newMessages;
            };

            const isNewConversation = !selectedConID || selectedConID === '-1';
            if (isNewConversation) {
                if (isBot) {
                    setCurrentConversation((prev: ConversationModify | null) => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            messages: updateBotMessages(prev.messages),
                        };
                    });
                } else {
                    setCurrentConversation({
                        id: '-1',
                        name: 'New Chat',
                        messages: [{ text: params.prompt, isBot: false }],
                    });
                }
                return;
            }

            if (isBot) {
                setCurrentConversation((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        messages: updateBotMessages(prev.messages),
                    };
                });
            } else {
                if(conversation?.length) {
                    const index = conversation.findIndex((data) => data.id === selectedConID);
                    if (index !== -1) {
                        const newConversations = [...conversation];
                    newConversations[index] = {
                        ...newConversations[index],
                        messages: [
                            ...newConversations[index].messages,
                            { text: params.prompt, isBot: false },
                        ],
                    };

                    setConversation(newConversations);
                    setCurrentConversation(newConversations[index]);
                    }
                }
            }
        },
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await conversationApi.deleteConversation(id);
            await cacheConversation.del(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigation.navigate('Chat' as never);
        },
        onError: (error) => {
            console.error('Error deleting conversation:', error);
        },
    });

    const addMutation = useMutation({
        mutationFn: async ({ data, isStream, isVision }: { data: { prompt: string }; isStream?: boolean; isVision?: boolean }) => {
            await cacheConversation.addMsg(data);

            if (!isVision) {
                const con = await conversationApi.createChat(data, isStream);
                if (!selectedConID) {
                    setTimeout(() => {
                        // navigation.navigate('Chat', { id: con.conversationID });
                    }, 1500);
                }

                queryClient.invalidateQueries({ queryKey: ['conversations'] });
            }
        },
        onSuccess: () => {
            if (!selectedConID) {
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['conversations', selectedConID] });
            }
        },
        onError: (error) => {
            ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
            console.log(error);
        },
    });

    const deleteConversation = useCallback((id: string) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    const addMsg = useCallback(
        (data: { prompt: string }, isStream?: boolean, isVision?: boolean) => {
            addMutation.mutate({ data, isStream, isVision });
        },
        [addMutation]
    );

    const contextValue: ConversationContextProps = {
        conversationList: conversation,
        error,
        currenConError,
        isLoading,
        currentConLoading,
        selectedConID, setSelectedConID,
        deleteConversation,
        addMsg,
        currentCon,
        cacheConversation,
    };

    return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>;
};

export default ConversationContext;
