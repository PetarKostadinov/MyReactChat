// @ts-nocheck
import {AddIcon} from "@chakra-ui/icons";
import {Box, Stack, Text} from "@chakra-ui/layout";
import {useToast} from "@chakra-ui/toast";
import axios from "axios";
import {useEffect, useState} from "react";
import {getSender} from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import {Button} from "@chakra-ui/react";
import {ChatState} from "../Context/ChatProvider";

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const [loading, setLoading] = useState(true);

    const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get("/api/chat", config); 

            setChats(data);
        } catch (error) {
            const status = error.response?.status;
            const serverMessage = error.response?.data?.message;
            const description = status === 401
                ? "Your session is no longer valid. Please log out and sign in again."
                : serverMessage || (process.env.NODE_ENV === "production" && !process.env.REACT_APP_API_URL
                    ? "The production API URL is not configured."
                    : "Failed to load chats. Check that the API server is running.");
            toast({
                title: "Could not load chats",
                description,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <Box
            d={{base: selectedChat ? "none" : "flex", md: "flex"}}
            flexDir="column"
            alignItems="center"
            p={{base: 3, lg: 4}}
            bg="white"
            w={{base: "100%", md: "31%"}}
            borderRadius={{ base: 0, sm: "xl" }}
            boxShadow="panel"
            minH={0}
        >
            <Box
                pb={3}
                px={{ base: 1, sm: 3 }}
                fontSize={{base: "xl", lg: "2xl"}}
                fontWeight="bold"
                d="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        d="flex"
                        fontSize={{base: "sm", md: "xs", lg: "sm"}}
                        rightIcon={<AddIcon />}
                        whiteSpace="nowrap"
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                d="flex"
                flexDir="column"
                p={{ base: 2, sm: 3 }}
                bg="gray.50"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
                minH={0}
            >
                {loading ? (
                    <ChatLoading />
                ) : chats && chats.length > 0 ? (
                    <Stack overflowY="auto" spacing={2} pr={1}>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "brand.600" : "white"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={selectedChat === chat ? "brand.600" : "gray.200"}
                                transition="background-color .15s ease, border-color .15s ease, transform .15s ease"
                                _hover={{ bg: selectedChat === chat ? "brand.700" : "gray.100", transform: "translateY(-1px)" }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && setSelectedChat(chat)}
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Box textAlign="center" color="gray.500" p={6}>
                        <Text fontWeight="semibold">No conversations yet</Text>
                        <Text fontSize="sm" mt={2}>
                            Use Search User above, then select someone to start chatting.
                        </Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
