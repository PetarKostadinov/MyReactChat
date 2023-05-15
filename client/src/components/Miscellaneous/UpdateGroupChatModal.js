import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../Authentication/Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const toast = useToast();

    const handleDelete = (delUser) => {
        setSelectedChat.users(setSelectedChat.users.filter((x) => x._id !== delUser._id));
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
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>


                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal;
