import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, IconButton, Stack, Text, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { authConfig } from "../config/api";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import type { Chat, RefreshChatsProps, User } from "../types";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const formatChatTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const today = new Date();
    return date.toDateString() === today.toDateString()
        ? new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date)
        : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
};

const MyChats = ({ fetchAgain }: Pick<RefreshChatsProps, "fetchAgain">) => {
    const [loggedUser, setLoggedUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const getChatName = (chat: Chat) => chat.isGroupChat
        ? chat.chatName
        : getSender(loggedUser, chat.users);

    const getChatAvatar = (chat: Chat) => chat.isGroupChat
        ? undefined
        : chat.users.find((chatUser) => chatUser._id !== loggedUser?._id)?.pic;

    const fetchChats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/chat", authConfig(user.token));
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
        const storedUser = localStorage.getItem("userInfo");
        setLoggedUser(storedUser ? JSON.parse(storedUser) : undefined);
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="stretch"
            bg="white"
            w={{ base: "100%", md: "340px", lg: "380px" }}
            flexShrink={0}
            minH={0}
        >
            <Box
                px={{ base: 4, md: 5 }}
                py={4}
                fontSize={{ base: "xl", lg: "2xl" }}
                fontWeight="bold"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
            >
                Conversations
                <GroupChatModal>
                    <Tooltip label="Create group chat" hasArrow>
                        <IconButton icon={<AddIcon />} aria-label="Create group chat" size="sm" />
                    </Tooltip>
                </GroupChatModal>
            </Box>
            <Box display="flex" flexDir="column" px={{ base: 2, md: 3 }} pb={3} flex="1" overflow="hidden" minH={0}>
                {loading ? (
                    <ChatLoading />
                ) : chats?.length ? (
                    <Stack overflowY="auto" spacing={1} pr={1}>
                        {chats.map((chat) => {
                            const isSelected = selectedChat?._id === chat._id;
                            return (
                                <Box
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={isSelected ? "brand.50" : "transparent"}
                                    px={3}
                                    py={3}
                                    borderRadius="xl"
                                    borderLeftWidth="3px"
                                    borderLeftColor={isSelected ? "brand.500" : "transparent"}
                                    transition="background-color .15s ease, border-color .15s ease"
                                    _hover={{ bg: isSelected ? "brand.50" : "gray.50" }}
                                    _focusVisible={{ boxShadow: "outline" }}
                                    role="button"
                                    tabIndex={0}
                                    aria-current={isSelected ? "page" : undefined}
                                    onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && setSelectedChat(chat)}
                                >
                                    <Box display="flex" alignItems="center" gap={3} minW={0}>
                                        <Avatar size="md" name={getChatName(chat)} src={getChatAvatar(chat)} bg="brand.100" color="brand.700" />
                                        <Box flex="1" minW={0}>
                                            <Box display="flex" justifyContent="space-between" alignItems="baseline" gap={2}>
                                                <Text fontWeight="semibold" noOfLines={1}>{getChatName(chat)}</Text>
                                                <Text fontSize="xs" color="gray.500" flexShrink={0}>
                                                    {formatChatTime(chat.latestMessage?.createdAt || chat.updatedAt)}
                                                </Text>
                                            </Box>
                                            <Text fontSize="sm" color="gray.500" noOfLines={1} mt={0.5}>
                                                {chat.latestMessage
                                                    ? `${chat.latestMessage.sender._id === user._id ? "You" : chat.latestMessage.sender.name}: ${chat.latestMessage.content}`
                                                    : "No messages yet"}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    <Box textAlign="center" color="gray.500" p={6}>
                        <Text fontWeight="semibold">No conversations yet</Text>
                        <Text fontSize="sm" mt={2}>Search for someone above to start chatting.</Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
