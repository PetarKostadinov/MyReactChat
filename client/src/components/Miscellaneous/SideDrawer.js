import { Avatar, Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../Authentication/Context/ChatProvider';

function SideDrawer() {

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user } = ChatState();

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
                    hasArow
                    placement='bottom-end'
                >
                    <Button
                        variant='ghost'
                    >
                        <i className='fas fa-search'></i>
                        <Text d={{ base: 'none', md: 'flex' }} px='4'>
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
                            <BellIcon fontSize={'2xl'} margin={1} />
                        </MenuButton>
                        <MenuList></MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>My Profile</MenuItem>
                            <MenuItem>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >
        </>
    )
}

export default SideDrawer;
