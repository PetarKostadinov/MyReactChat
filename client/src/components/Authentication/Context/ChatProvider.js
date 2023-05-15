import { useNavigate } from "react-router-dom";


const { createContext, useState, useContext, useEffect } = require("react");

const ChatContext = createContext();


const ChatProvider = ({ children }) => {

    const [user, setUser] = useState();
    const [selectChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);



    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);

        if (!userInfo) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;