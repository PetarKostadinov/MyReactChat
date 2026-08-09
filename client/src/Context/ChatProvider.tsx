import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Chat, Message, User } from "../types";

interface ChatContextValue {
    selectedChat?: Chat;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
    user?: User;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    notification: Message[];
    setNotification: React.Dispatch<React.SetStateAction<Message[]>>;
    chats?: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[] | undefined>>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const ChatProvider = ({ children }: React.PropsWithChildren) => {
    const [selectedChat, setSelectedChat] = useState<Chat>();
    const [user, setUser] = useState<User>();
    const [notification, setNotification] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chat[]>();


    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        const userInfo: User | undefined = storedUser ? JSON.parse(storedUser) : undefined;
        setUser(userInfo);

        if (!userInfo) {
            navigate('/');
        }
    }, [navigate]);


    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("ChatState must be used within ChatProvider");
    }
    return context;
};

export default ChatProvider;
