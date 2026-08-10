import { Skeleton, Stack } from '@chakra-ui/react';
function ChatLoading() {
    return (
        <Stack>
            {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} height='45px' borderRadius='lg' />
            ))}
        </Stack>
    )
}

export default ChatLoading;
