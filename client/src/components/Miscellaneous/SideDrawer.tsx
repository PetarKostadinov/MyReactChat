// @ts-nocheck
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';

// import { accessChat } from '../../../../server/controllers/chatControllers';

function SideDrawer() {

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
    const toast = useToast();
    const { user, setSelectedChat, setChats, notification, setNotification } = ChatState();

    const navigate = useNavigate();


    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter somthing in the search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
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

            const { data } = await axios.get(`/api/user?search=${encodeURIComponent(search)}`, config);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the search result',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        } finally {
            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChatId(userId);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post('/api/chat', { userId }, config);

            setChats((currentChats = []) =>
                currentChats.some((chat) => chat._id === data._id)
                    ? currentChats
                    : [data, ...currentChats]
            );
            setSelectedChat(data);
            setSearch('');
            setSearchResult([]);
            onClose();

        } catch (error) {
            toast({
                title: 'Could not start chat',
                description: error.response?.data?.message || 'The chat server did not accept the request.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        } finally {
            setLoadingChatId(null);
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                p={3}
                borderWidth={5}
            >
                <Tooltip
                    label='Search User to chat'
                    hasArrow
                    placement='bottom-end'
                >
                    <Button
                        variant='ghost'
                        onClick={onOpen}
                    >
                        <i className='fas fa-search'></i>
                        <Text display={{ base: 'none', md: 'flex' }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl' fontFamily='Work sans'>
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                            <BellIcon fontSize={'2xl'} margin={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && 'No New Messages'}
                            {notification.map(notif => (
                                <MenuItem key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif));
                                }}>
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                                        :
                                        `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={() => logoutHandler()}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pb={2}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChatId && <Spinner mx="auto" mt={3} display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;
