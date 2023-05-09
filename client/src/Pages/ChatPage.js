import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChatPage() {

    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        const { data } = await axios.get('/api/chat');
        setChats(data);

    };

    useEffect(() => {
        fetchChats();  
    }, []);

    return (
        <div>
            {chats.map(x => (
                <div key={x._id}>{x.chatName}</div>
            ))}
        </div>
    )
}

export default ChatPage;
