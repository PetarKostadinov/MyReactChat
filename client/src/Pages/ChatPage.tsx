
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useState } from 'react';

function ChatPage() {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <Box w="100%" h="100%" minH={0} bg="gray.100" overflow="hidden">
            {user && <SideDrawer />}
            <Box display="flex" gap={{ base: 0, md: 3 }} w="100%" h="calc(100% - 72px)" minH={0} p={{ base: 0, sm: 2, md: 3 }} overflow="hidden">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </Box>
    );
};

export default ChatPage;
