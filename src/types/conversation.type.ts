
export interface Conversation {
    id: string;
    name: string;
    from: string | null;
    summarize: string;
    lastMessage: string;
    lastMessageAt: string ;
    createdAt: string;
    updatedAt: string;
    userID: string;
    messages: Messages[];
    [key: string]: any;
}

export interface ConversationModify {
    id: string;
    name?: string;
    from?: string | null;
    summarize?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    createdAt?: string;
    updatedAt?: string;
    messages: Messages[];
}

// {
//     "id": "2d981e38-ee40-4750-85a2-7f3167addefb",
//     "createdAt": "2024-10-01T08:20:21.301Z",
//     "updatedAt": "2024-10-01T08:20:21.301Z",
//     "text": "give me my task",
//     "isBot": false,
//     "userID": "3969d671-6d6d-4d94-a2d8-1a30168c9476",
//     "conversationId": "6ab4b0ce-84ac-4b5a-9b8d-7942b749e9a4",
//     "relatedMemo": null,
//     "memoStorage": null,
//     "functionData": [],
//     "videoRecord": null
// },
export interface Messages {
    id: string;
    text: string;
    isBot: boolean;
    userID: string;
    conversationId: string;
    relatedMemo: string;
    memoStorage?: MemoStorageType[];
    functionData?: FunctionAgentType[];
    videoRecord?: VideoRecord;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

export interface MessagesModify {
    id: string;
    text: string;
    isBot?: boolean;
    userID?: string;
    conversationId?: string;
    relatedMemo?: string;
}

export interface FunctionAgentType {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    data: string;
    comment: string;
    messageId: string;
}

export interface VideoRecord {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    url: string;
    messageId: string;
}


export interface MemoStorageType {
    id: string;
    guide: string;
    answer: string;
    criteria: {
        favorite: boolean;
        relationship: boolean;
        "ai-actionable": boolean;
        "time-sensitive": boolean;
        "personal detail": boolean;
        "context-relevant": boolean;
        "frequently-mentioned": boolean;
    };
    createdAt: string;
}
