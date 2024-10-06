
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

export interface Messages {
    text: string;
    isBot: boolean;
    [key: string]: any;
}