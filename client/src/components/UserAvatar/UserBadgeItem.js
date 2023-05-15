import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react'

function UserBadgeItem({ user, handleFunction }) {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={'lg'}
            m={1}
            mb={2}
            variant='solid'
            fontSize={12}
            color='purple'
            cursor={'pointer'}
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon />
        </Box>
    )
}

export default UserBadgeItem;
