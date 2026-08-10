import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import type { RefreshChatsProps } from '../types';

function ChatBox({ fetchAgain, setFetchAgain }: RefreshChatsProps) {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={{ base: 2, sm: 3, lg: 4 }}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius={{ base: 0, sm: "xl" }}
            boxShadow="panel"
            minH={0}
            overflow="hidden"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox;
