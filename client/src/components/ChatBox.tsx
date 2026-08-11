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
            bg="white"
            flex="1"
            w={{ base: "100%", md: "auto" }}
            borderLeftWidth={{ base: 0, md: "1px" }}
            borderColor="gray.200"
            minH={0}
            overflow="hidden"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox;
