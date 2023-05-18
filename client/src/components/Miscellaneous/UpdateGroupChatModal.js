import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../Authentication/Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';

function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const toast = useToast();

    const handleLeaveTheGroup = async () => {

    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'

            });
            setRenameLoading(false);
        }

        setGroupChatName('');
    };
    const handleSearch = () => {

    };



    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w={'100%'}
                            display={'flex'}
                            flexWrap={'wrap'}
                            pb={3}
                        >
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleLeaveTheGroup(u)} />
                            ))}
                        </Box>
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button
                                variant={'solid'}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='AddUser to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleLeaveTheGroup(user)}>
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal;
