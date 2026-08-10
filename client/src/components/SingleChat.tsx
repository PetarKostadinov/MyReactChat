import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./Miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import { io, type Socket } from "socket.io-client";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import type { Chat, Message, RefreshChatsProps } from '../types';
import { authConfig } from '../config/api';
const ENDPOINT =
    process.env.REACT_APP_SOCKET_URL?.replace(/\/$/, "") ||
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000";
let socket: Socket | undefined;
let selectedChatCompare: Chat | undefined;

const SingleChat = ({ fetchAgain, setFetchAgain }: RefreshChatsProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const { selectedChat, setSelectedChat, user, setNotification } =
        ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                authConfig(user.token)
            );
            setMessages(data);
            socket?.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Could not load messages",
                description: "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && newMessage) {
            socket?.emit("stop typing", selectedChat._id);
            try {
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    authConfig(user.token)
                );
                socket?.emit("new message", data);
                setMessages((currentMessages) => [...currentMessages, data]);
            } catch (error) {
                toast({
                    title: "Could not send message",
                    description: "Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {
        if (!user?.token) return;
        socket = io(ENDPOINT, { auth: { token: user.token } });
        if (user) socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [user]);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (newMessageReceived: Message) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                setNotification((currentNotifications) =>
                    currentNotifications.some((item) => item._id === newMessageReceived._id)
                        ? currentNotifications
                        : [newMessageReceived, ...currentNotifications]
                );
                setFetchAgain((current) => !current);
            } else {
                setMessages((currentMessages) =>
                    currentMessages.some((item) => item._id === newMessageReceived._id)
                        ? currentMessages
                        : [...currentMessages, newMessageReceived]
                );
            }
        };

        socket.on("message recieved", handleMessage);
        return () => {
            socket?.off("message recieved", handleMessage);
        };
    }, [setFetchAgain, setNotification]);

    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket?.emit("typing", selectedChat._id);
        }
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket?.emit("stop typing", selectedChat._id);
            setTyping(false);
        }, 3000);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "xl", lg: "2xl" }}
                        fontWeight="bold"
                        pb={3}
                        px={2}
                        w="100%"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                        gap={2}
                        minH="44px"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            aria-label="Back to chats"
                            onClick={() => setSelectedChat(undefined)}
                        />
                        {messages &&
                            (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal
                                        user={getSenderFull(user, selectedChat.users)}
                                    />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </>
                            ))}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={{ base: 2, sm: 3 }}
                        bg="gray.50"
                        w="100%"
                        h="100%"
                        borderRadius={{ base: "md", sm: "lg" }}
                        overflowY="hidden"
                        minH={0}
                        borderWidth="1px"
                        borderColor="gray.200"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                                <div className="messages">
                                    <ScrollableChat messages={messages} />
                                </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            id="message"
                            isRequired
                            mt={3}
                        >
                            {istyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant="filled"
                                bg="white"
                                borderWidth="1px"
                                borderColor="gray.200"
                                placeholder="Type a message and press Enter"
                                aria-label="Message"
                                value={newMessage}
                                onChange={typingHandler}
                                enterKeyHint="send"
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                    // to get socket.io on same page
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize={{ base: "xl", md: "2xl" }} color="gray.500" textAlign="center" px={6}>
                        Select a conversation to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
