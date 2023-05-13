import React, { useEffect, useState } from 'react'
import { ChatState } from './Authentication/Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

function MyChats() {

    const [loggedUser, setLoggedUser] = useState();
    const { user, selectChat, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            };


            const { data } = await axios.get('/api/chat', config);
            console.log("🚀 ~ file: MyChats.js:22 ~ fetchChats ~ data:", data)
            setChats(data);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
    }, [])




    return (
        <div>
            My
        </div>
    )
}

export default MyChats;
