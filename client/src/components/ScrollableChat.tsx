import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import type { Message } from "../types";

const dayLabel = (value: string) => {
    const date = new Date(value);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: date.getFullYear() === today.getFullYear() ? undefined : "numeric" }).format(date);
};

const messageTime = (value?: string) => value
    ? new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(value))
    : "";

const ScrollableChat = ({ messages }: { messages: Message[] }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed className="message-feed">
            {messages.map((message, index) => {
                const mine = message.sender._id === user._id;
                const previous = messages[index - 1];
                const next = messages[index + 1];
                const startsGroup = !previous || previous.sender._id !== message.sender._id;
                const endsGroup = !next || next.sender._id !== message.sender._id;
                const startsDay = Boolean(message.createdAt) && (!previous?.createdAt
                    || new Date(previous.createdAt).toDateString() !== new Date(message.createdAt!).toDateString());

                return (
                    <Box key={message._id}>
                        {startsDay && message.createdAt && (
                            <Box display="flex" alignItems="center" gap={3} my={5} color="gray.400">
                                <Box h="1px" bg="gray.200" flex="1" />
                                <Text fontSize="xs" fontWeight="semibold">{dayLabel(message.createdAt)}</Text>
                                <Box h="1px" bg="gray.200" flex="1" />
                            </Box>
                        )}
                        <Box display="flex" justifyContent={mine ? "flex-end" : "flex-start"} alignItems="flex-end" mt={startsGroup ? 3 : 1}>
                            {!mine && (
                                endsGroup ? (
                                    <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                                        <Avatar mr={2} size="xs" name={message.sender.name} src={message.sender.pic} />
                                    </Tooltip>
                                ) : <Box w="32px" mr={2} />
                            )}
                            <Box maxW={{ base: "82%", md: "72%" }}>
                                {!mine && startsGroup && (
                                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={1} ml={1}>{message.sender.name}</Text>
                                )}
                                <Tooltip label={messageTime(message.createdAt)} isDisabled={!message.createdAt} placement={mine ? "left" : "right"} hasArrow>
                                    <Box
                                        bg={mine ? "brand.500" : "gray.100"}
                                        color={mine ? "white" : "gray.800"}
                                        borderRadius="xl"
                                        borderBottomRightRadius={mine && endsGroup ? "sm" : "xl"}
                                        borderBottomLeftRadius={!mine && endsGroup ? "sm" : "xl"}
                                        px={3.5}
                                        py={2}
                                        overflowWrap="anywhere"
                                        lineHeight="base"
                                        boxShadow="sm"
                                    >
                                        {message.content}
                                    </Box>
                                </Tooltip>
                                {endsGroup && message.createdAt && (
                                    <Text fontSize="10px" color="gray.400" textAlign={mine ? "right" : "left"} mt={1} px={1}>
                                        {messageTime(message.createdAt)}
                                    </Text>
                                )}
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
