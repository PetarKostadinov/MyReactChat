import { Avatar } from "@chakra-ui/avatar";
import { Box } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import type { Message } from '../types';

const ScrollableChat = ({ messages }: { messages: Message[] }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <Box display="flex" key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <Box
                            as="span"
                            bg={m.sender._id === user._id ? "brand.100" : "green.100"}
                            color="gray.800"
                            ml={isSameSenderMargin(messages, m, i, user._id)}
                            mt={isSameUser(messages, m, i, user._id) ? "3px" : "10px"}
                            borderRadius="xl"
                            px={4}
                            py={2}
                            maxW={{ base: "82%", md: "75%" }}
                            overflowWrap="anywhere"
                            lineHeight="short"
                        >
                            {m.content}
                        </Box>
                    </Box>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
