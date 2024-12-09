import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import conversationApi from "../api/conversation.api";
  import {
    useMutation,
    useInfiniteQuery,
    useQueryClient,
    useQuery,
  } from "@tanstack/react-query";
  import { toast } from "react-toastify";
  import { useNavigate, useParams } from "react-router";
  import { WebSocketContext } from "./socket.context";
  
  interface Message {
    id: string;
    content: string;
    createdAt: string;
  }
  
  interface MessagesResponse {
    currentPage: number;
    totalPages: number;
    messages: Message[];
  }
  
  interface Conversation {
    id: string;
    name: string;
    messages: Message[];
  }
  
  interface CacheConversation {
    del: (id: string) => Promise<void>;
    addMsg: (
      params: { prompt: string },
      isBot?: boolean,
      functionData?: any[],
      dataMemo?: any[],
      memoStorage?: any[]
    ) => Promise<void>;
    rsMsgAttach: () => Promise<void>;
  }
  
  interface ConversationContextProps {
    conversationList: Conversation[];
    error: unknown;
    currenConError: unknown;
    isLoading: boolean;
    currentConLoading: boolean;
    selectedConID: string | undefined;
    deleteConversation: (id: string) => void;
    addMsg: (
      data: { prompt: string },
      isStream?: boolean,
      isVision?: boolean
    ) => void;
    currentCon: Conversation | null;
    cacheConversation: CacheConversation;
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextMessages: () => void;
    isFetchingNextMessages: boolean;
  }
  
  const ConversationContext = createContext<ConversationContextProps | undefined>(
    undefined
  );
  
  const useFetchMessages = (conversationId: string | undefined) => {
    return useInfiniteQuery<MessagesResponse, Error>({
      queryKey: ["messages", conversationId],
      queryFn: ({ pageParam = 1 }) =>
        conversationApi.getMessagesByConversationId(conversationId, pageParam, 4),
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
    });
  };
  
  export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const { id: selectedConID } = useParams<{ id: string }>();
    const [conversation, setConversation] = useState<Conversation[]>([]);
    const [currentCon, setCurrentConversation] = useState<Conversation | null>(
      null
    );
    const listFuncData = useRef<any[]>([]);
    const listMemoData = useRef<any[]>([]);
    const listMemoStorage = useRef<any[]>([]);
    const socket = useContext(WebSocketContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    const {
      data,
      error,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useInfiniteQuery<{
      pages: { conversations: Conversation[] }[];
    }>({
      queryKey: ["conversations"],
      queryFn: ({ pageParam = 1 }) =>
        conversationApi.getConversationHistory(null, pageParam),
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
      cacheTime: 0,
    });
  
    const {
      data: messages,
      fetchNextPage: fetchNextMessages,
      hasNextPage: hasNextMessages,
      isFetchingNextPage: isFetchingNextMessages,
      isLoading: messagesLoading,
      error: messagesError,
    } = useFetchMessages(selectedConID);
  
    const {
      data: currentConData,
      isLoading: currentConLoading,
      error: currenConError,
    } = useQuery({
      queryKey: ["conversation", selectedConID],
      queryFn: () =>
        selectedConID
          ? conversationApi.getConversationHistory(selectedConID)
          : Promise.resolve(null),
      enabled: !!selectedConID,
      initialData: null,
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
      if (data?.pages) {
        setConversation(
          data.pages.flatMap((page) => page.conversations || [])
        );
      }
      cacheConversation.rsMsgAttach();
    }, [data]);
  
    useEffect(() => {
      setCurrentConversation(
        selectedConID && currentConData ? currentConData : null
      );
    }, [selectedConID, currentConData]);
  
    useEffect(() => {
      if (messages?.pages) {
        setCurrentConversation((prevCon) => {
          if (!prevCon) return null;
  
          const existingMessageIds = new Set(
            prevCon.messages.map((msg) => msg.id)
          );
          const newMessages = messages.pages
            .flatMap((page) => page.messages)
            .filter((msg) => !existingMessageIds.has(msg.id));
  
          return newMessages.length
            ? {
                ...prevCon,
                messages: [...newMessages, ...prevCon.messages].sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ),
              }
            : prevCon;
        });
      }
    }, [messages]);
  
    useEffect(() => {
      if (socket) {
        socket.on("chatResChunk", ({ content }: { content: string }) => {
          cacheConversation.addMsg({ prompt: content }, true);
        });
  
        socket.on(
          "chatResChunkFunc",
          async ({ functionData, id }: { functionData: any; id: string }) => {
            const data = { id, ...functionData };
            listFuncData.current = updateFuncDataList(listFuncData.current, data);
            await cacheConversation.addMsg({ prompt: "" }, true, listFuncData.current);
          }
        );
  
        socket.on(
          "chatResMemo",
          async ({
            active,
            memoryDetail = [],
          }: {
            active: boolean;
            memoryDetail: any[];
          }) => {
            if (active) {
              listMemoData.current = memoryDetail;
              await cacheConversation.addMsg(
                { prompt: "" },
                true,
                listFuncData.current,
                listMemoData.current
              );
            }
          }
        );
  
        socket.on(
          "chatResMemoStorage",
          async ({
            active,
            memoryDetail = [],
          }: {
            active: boolean;
            memoryDetail: any[];
          }) => {
            if (active) {
              listMemoStorage.current = memoryDetail;
              await cacheConversation.addMsg(
                { prompt: "" },
                true,
                listFuncData.current,
                listMemoData.current,
                listMemoStorage.current
              );
            }
          }
        );
  
        return () => {
          socket.off("chatResChunk");
          socket.off("chatResChunkFunc");
          socket.off("chatResMemo");
          socket.off("chatResMemoStorage");
        };
      }
    }, [socket]);
  
    const cacheConversation: CacheConversation = {
      del: async (id) => {
        setConversation((prev) => prev.filter((data) => data.id !== id));
      },
      addMsg: async (
        params,
        isBot = false,
        functionData = [],
        dataMemo = [],
        memoStorage = []
      ) => {
        if (!selectedConID || selectedConID === "-1") {
          setCurrentConversation((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              messages: [
                ...(prev.messages || []),
                { text: params.prompt, isBot: true },
              ],
            };
          });
        }
      },
      rsMsgAttach: async () => {
        listFuncData.current = [];
        listMemoData.current = [];
        listMemoStorage.current = [];
      },
    };
  
    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        await conversationApi.deleteConversation(id);
        await cacheConversation.del(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["conversations"]);
        navigate("/chat");
      },
      onError: (error) => console.error(error),
    });
  
    const addMutation = useMutation({
      mutationFn: async ({
        data,
        isStream,
      }: {
        data: { prompt: string };
        isStream?: boolean;
      }) => {
        await cacheConversation.addMsg(data);
        return conversationApi.createChat(data, isStream);
      },
      onSuccess: (data) => {
        if (!selectedConID) {
          setTimeout(() => {
            navigate(`/chat/${data.id}`);
          }, 1500);
          setConversation((prev) => [{ ...data }, ...(prev || [])]);
        }
        cacheConversation.rsMsgAttach();
      },
      onError: () => toast.error("Something went wrong"),
    });
  
    const deleteConversation = useCallback(
      (id: string) => deleteMutation.mutate(id),
      [deleteMutation]
    );
  
    const addMsg = useCallback(
      (data: { prompt: string }, isStream?: boolean, isVision?: boolean) =>
        addMutation.mutate({ data, isStream, isVision }),
      [addMutation]
    );
  
    const contextValue = {
      conversationList: conversation,
      error,
      currenConError,
      isLoading,
      currentConLoading,
      selectedConID,
      deleteConversation,
      addMsg,
      currentCon,
      cacheConversation,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      fetchNextMessages,
      isFetchingNextMessages,
    };
  
    return (
      <ConversationContext.Provider value={contextValue}>
        {children}
      </ConversationContext.Provider>
    );
  };
  
  export default ConversationContext;
  