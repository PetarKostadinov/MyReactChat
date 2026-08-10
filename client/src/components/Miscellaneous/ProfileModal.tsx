
import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

function ProfileModal({ user, children }: { user: import('../../types').User; children?: React.ReactNode }) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ?
                (<span onClick={onOpen}>{children}</span>)
                : (
                    <IconButton
                        display={{ base: 'flex' }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                        aria-label={`View ${user.name}'s profile`}
                    />
                )}
            <Modal size={{ base: 'full', sm: 'md', md: 'lg' }} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={{ base: '2xl', md: '4xl' }}
                        display='flex'
                        justifyContent='center'
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Image
                            borderRadius={'full'}
                            boxSize={{ base: '120px', md: '150px' }}
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text mt={4} textAlign="center" overflowWrap="anywhere">Email: {user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal;
