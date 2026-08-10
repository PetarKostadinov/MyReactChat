import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { authConfig, getApiErrorMessage } from '../../config/api';

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
                title: 'Enter a name or email to search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${encodeURIComponent(search)}`, authConfig(user.token));
            setSearchResult(data);

        } catch (error) {
            toast({
                title: 'Search failed',
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

    const accessChat = async (userId: string) => {
        try {
            setLoadingChatId(userId);
            const { data } = await axios.post('/api/chat', { userId }, authConfig(user.token));

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
                description: getApiErrorMessage(error, 'The chat server did not accept the request.'),
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
                px={{ base: 3, md: 5 }}
                h="72px"
                borderBottomWidth="1px"
                borderColor="gray.200"
                boxShadow="sm"
            >
                <Tooltip
                    label='Search User to chat'
                    hasArrow
                    placement='bottom-end'
                >
                    <Button
                        variant='ghost'
                        onClick={onOpen}
                        aria-label='Search users'
                        px={{ base: 3, md: 4 }}
                    >
                        <SearchIcon />
                        <Text display={{ base: 'none', md: 'flex' }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text display={{ base: 'none', sm: 'block' }} fontSize={{ sm: 'lg', md: '2xl' }} fontWeight='bold' letterSpacing='tight'>
                    Talk-A-Tive
                </Text>
                <Box display="flex" alignItems="center" gap={1}>
                    <Menu>
                        <MenuButton p={1} aria-label="Notifications">
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
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} px={{ base: 2, sm: 4 }}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={() => logoutHandler()}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box >

            <Drawer placement='left' onClose={onClose} isOpen={isOpen} size={{ base: 'full', sm: 'xs' }}>
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
