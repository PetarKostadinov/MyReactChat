import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import type { User } from '../../types';
import { authConfig, getApiErrorMessage } from '../../config/api';

function GroupChatModal({ children }: React.PropsWithChildren) {

    const [groupChatName, setGroupChatName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const closeModal = () => {
        setGroupChatName('');
        setSearchQuery('');
        setSelectedUsers([]);
        setSearchResult([]);
        onClose();
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResult([]);
            return;
        }

        try {
            setSearchLoading(true);

            const { data } = await axios.get(`/api/user?search=${encodeURIComponent(query)}`, authConfig(user.token));

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
        } finally {
            setSearchLoading(false);
        }
    };
    const handleSubmit = async () => {
        if (!groupChatName.trim()) {
            toast({
                title: 'Enter a group name',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        if (selectedUsers.length < 2) {
            toast({
                title: 'Select at least two users',
                description: 'A group chat requires you and at least two other members.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        try {
            setSubmitting(true);
            const { data } = await axios.post('/api/chat/group',
                {
                    name: groupChatName.trim(),
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                },
                authConfig(user.token)
            );

            setChats([data, ...(chats || [])]);
            closeModal();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

        } catch (error) {
            toast({
                title: 'Could not create group chat',
                description: getApiErrorMessage(error, 'Please try again.'),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        } finally {
            setSubmitting(false);
        }
    };
    const handleDelete = (delUser: User) => {
        setSelectedUsers((currentUsers) => currentUsers.filter((user) => user._id !== delUser._id));
    };
    const handleGroup = (userToAdd: User) => {
        if (selectedUsers.some((user) => user._id === userToAdd._id)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers((currentUsers) => [...currentUsers, userToAdd]);
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={closeModal} size={{ base: 'full', sm: 'md' }} isCentered>
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
                            <FormLabel>Group name</FormLabel>
                            <Input
                                placeholder='Enter a group name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            ></Input>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Add members</FormLabel>
                            <Input
                                placeholder='Search by name or email'
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            ></Input>
                            <FormHelperText mb={3}>Select at least two people from the results below.</FormHelperText>
                        </FormControl>
                        <Box
                            w={'100%'}
                            display={'flex'}
                            flexWrap={'wrap'}
                        >
                            {selectedUsers.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                            {selectedUsers.length > 0 && (
                                <Text w='100%' fontSize='sm' color='gray.600' mb={2}>
                                    {selectedUsers.length} {selectedUsers.length === 1 ? 'member' : 'members'} selected (minimum 2)
                                </Text>
                            )}
                        </Box>
                            {searchLoading ? <Spinner />
                                :
                                (searchResult?.slice(0, 4)
                                    .map(user => (<UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />)))}

                    </ModalBody>

                    <ModalFooter>
                        <Button w={{ base: '100%', sm: 'auto' }} isLoading={submitting} onClick={handleSubmit}>
                            Create chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
