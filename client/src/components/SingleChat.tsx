import { FormControl } from "@chakra-ui/form-control";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { Avatar, IconButton, Input, Spinner, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import { ArrowBackIcon, ArrowForwardIcon, AttachmentIcon } from "@chakra-ui/icons";
import ProfileModal from "./Miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import { io, type Socket } from "socket.io-client";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import type { Chat, Message, RefreshChatsProps } from '../types';
import { authConfig } from '../config/api';
import { useKeyboardAvoidance } from '../hooks/useKeyboardAvoidance';
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
    const [uploadingImage, setUploadingImage] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
    const composerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    useKeyboardAvoidance(composerRef);

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

    const sendMessage = async () => {
        const content = newMessage.trim();
        if (content && selectedChat) {
            messageInputRef.current?.focus({ preventScroll: true });
            socket?.emit("stop typing", selectedChat._id);
            try {
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content,
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

    const sendImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file || !selectedChat) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
            toast({
                title: "Choose a valid image",
                description: "Use a JPEG, PNG, WebP, or GIF up to 5 MB.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setUploadingImage(true);
            socket?.emit("stop typing", selectedChat._id);
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("upload_preset", "kofur1kn");
            uploadData.append("cloud_name", "dsjxqcrfc");
            const uploadResponse = await axios.post(
                "https://api.cloudinary.com/v1_1/dsjxqcrfc/image/upload",
                uploadData
            );
            const imageUrl = uploadResponse.data?.secure_url;
            if (!imageUrl) throw new Error("Image upload did not return a secure URL");

            const { data } = await axios.post(
                "/api/message",
                { imageUrl, chatId: selectedChat._id },
                authConfig(user.token)
            );
            socket?.emit("new message", data);
            setMessages((currentMessages) => [...currentMessages, data]);
        } catch (error) {
            toast({
                title: "Could not send image",
                description: "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setUploadingImage(false);
            messageInputRef.current?.focus({ preventScroll: true });
        }
    };

    const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
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

    const typingHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket?.emit("typing", selectedChat?._id);
        }
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket?.emit("stop typing", selectedChat?._id);
            setTyping(false);
        }, 3000);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Box
                        px={{ base: 3, md: 5 }}
                        py={3}
                        w="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                        minH="68px"
                        flexShrink={0}
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                    >
                        <Box display="flex" alignItems="center" gap={3} minW={0}>
                            <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} aria-label="Back to conversations" variant="ghost" onClick={() => setSelectedChat(undefined)} />
                            <Avatar
                                size="sm"
                                name={selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users)}
                                src={selectedChat.isGroupChat ? undefined : getSenderFull(user, selectedChat.users)?.pic}
                                bg="brand.100"
                                color="brand.700"
                            />
                            <Box minW={0}>
                                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" noOfLines={1}>
                                    {selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users)}
                                </Text>
                                <Text fontSize="xs" color={socketConnected ? "green.600" : "gray.500"}>
                                    {socketConnected ? "Connected" : "Connecting…"}
                                </Text>
                            </Box>
                        </Box>
                        {!selectedChat.isGroupChat ? (
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        ) : (
                            <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        )}
                    </Box>
                    <Box
                        display="flex"
                        flexDir="column"
                        bg="white"
                        w="100%"
                        flex="1"
                        overflowY="hidden"
                        minH={0}
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
                                <div className="messages" aria-live="polite">
                                    <ScrollableChat messages={messages} />
                                </div>
                        )}

                        <FormControl
                            ref={composerRef}
                            data-keyboard-avoid
                            id="message"
                            px={{ base: 3, md: 5 }}
                            py={3}
                            flexShrink={0}
                            zIndex={1}
                            borderTopWidth="1px"
                            borderColor="gray.200"
                            bg="white"
                        >
                            {istyping ? (
                                <Box display="flex" alignItems="center" h="24px" color="gray.500" fontSize="xs">
                                    <Lottie
                                        options={defaultOptions}
                                        width={42}
                                        style={{ margin: 0 }}
                                    />
                                    <Text ml={1}>Typing…</Text>
                                </Box>
                            ) : (
                                <Box h="24px" />
                            )}
                            <Box display="flex" alignItems="flex-end" gap={2} bg="gray.50" borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={1.5} _focusWithin={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}>
                                <Input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={sendImage}
                                    display="none"
                                    aria-hidden="true"
                                />
                                <Tooltip label="Upload image" hasArrow>
                                    <IconButton
                                        icon={<AttachmentIcon />}
                                        aria-label="Upload image"
                                        variant="ghost"
                                        borderRadius="full"
                                        flexShrink={0}
                                        isLoading={uploadingImage}
                                        isDisabled={uploadingImage}
                                        onClick={() => imageInputRef.current?.click()}
                                    />
                                </Tooltip>
                                <Textarea
                                    ref={messageInputRef}
                                    variant="unstyled"
                                    placeholder="Write a message…"
                                    aria-label="Message"
                                    value={newMessage}
                                    onChange={typingHandler}
                                    onKeyDown={handleComposerKeyDown}
                                    enterKeyHint="send"
                                    resize="none"
                                    rows={1}
                                    minH="40px"
                                    maxH="120px"
                                    px={3}
                                    py={2}
                                />
                                <IconButton
                                    icon={<ArrowForwardIcon />}
                                    aria-label="Send message"
                                    borderRadius="full"
                                    flexShrink={0}
                                    isDisabled={!newMessage.trim()}
                                    onPointerDown={(event) => event.preventDefault()}
                                    onClick={sendMessage}
                                />
                            </Box>
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
