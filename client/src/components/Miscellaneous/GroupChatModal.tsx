import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import type { User } from '../../types';
import { authConfig, getApiErrorMessage } from '../../config/api';

function GroupChatModal({ children }: React.PropsWithChildren) {

    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async (query: string) => {
        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${encodeURIComponent(query)}`, authConfig(user.token));

            setLoading(false);
            setSearchResult(data);


        } catch (error) {
            toast({
                title: 'Search failed',
                description: getApiErrorMessage(error, 'Could not load search results.'),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    };
    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length < 2) {
            toast({
                title: 'All fields are required',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/chat/group',
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                },
                authConfig(user.token)
            );

            setLoading(false);
            setChats([data, ...(chats || [])]);
            onClose();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

        } catch (error) {
            toast({
                title: 'Failed to create chat!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = (delUser: User) => {
        setSelectedUsers(selectedUsers.filter((x) => x._id !== delUser._id));
    };
    const handleGroup = (userToAdd: User) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={{ base: 'full', sm: 'md' }} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={{ base: '2xl', sm: '3xl' }}
                        display={'flex'}
                        justifyContent={'center'}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems='center' >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            ></Input>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users, eg: Petar, John, Mary'
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            ></Input>
                        </FormControl>
                        <Box
                            w={'100%'}
                            display={'flex'}
                            flexWrap={'wrap'}
                        >
                            {selectedUsers.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>
                            {loading ? <div>loading</div>
                                :
                                (searchResult?.slice(0, 4)
                                    .map(user => (<UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />)))}

                    </ModalBody>

                    <ModalFooter>
                        <Button w={{ base: '100%', sm: 'auto' }} onClick={handleSubmit}>
                            Create chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
