import React, { useEffect, useState } from 'react'
import { ChatState } from './Authentication/Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';


function SingleChat({ fetchAgain, setFetchAgain }) {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessages] = useState('');
    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

            setMessages(data);
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load Messages',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                },
                    config
                );



                setNewMessages('');
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send Message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessages(e.target.value);
        // Typing Indicator Logic
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />

                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {<UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />}

                            </>
                        )}
                    </Text>
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'flex-end'}
                        p={3}
                        bg={'#E8E8E8'}
                        w={'100%'}
                        h={'100%'}
                        borderRadius={'lg'}
                        overflowY={'hidden'}
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                w={10}
                                alignSelf={'center'}
                                margin={'auto'}
                            />
                        ) : (
                                <div
                                    className='messages'

                                >
                                    <ScrollableChat messages={messages} />
                                </div>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                        >
                            <Input
                                variant={'filled'}
                                bg={'#E0E0E0'}
                                onChange={typingHandler}
                                value={newMessage}
                            ></Input>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat;
