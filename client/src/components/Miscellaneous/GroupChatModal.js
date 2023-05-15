import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Authentication/Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

function GroupChatModal({ children }) {

    const [groupChatName, setGrupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);


        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed To load Search Result!',
                status: 'error',
                duration: '5000',
                isClosable: true,
                position: 'bottom-left'
            });
        }
    };
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
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
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post('/api/chat/group',
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                },
                config
            );

            setLoading(false);
            setChats([data, ...chats]);
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
        }
    };
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((x) => x._id !== delUser._id));
    };
    const handleGrooup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User allredy added',
                status: 'warning',
                duration: '5000',
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

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        fontFamily={'Work sans'}
                        display={'flex'}
                        justifyContent={'center'}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems='center' >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGrupChatName(e.target.value)}
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
                                        handleFunction={() => handleGrooup(user)}
                                    />)))}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            CreateChat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
