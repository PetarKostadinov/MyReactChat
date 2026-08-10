// @ts-nocheck
import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Register from '../components/Authentication/Register'
import Login from '../components/Authentication/Login'
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));

        if (user) {
            navigate('/chats');
        }
    }, [navigate]);

    return (
        <Container maxWidth='md' centerContent px={{ base: 4, md: 6 }} py={{ base: 8, md: 14 }}>
            <Box
                display='flex'
                justifyContent='center'
                p={{ base: 4, md: 5 }}
                bg='whiteAlpha.950'
                w='100%'
                mb={4}
                borderRadius='xl'
                boxShadow='panel'
            >
                <Text
                    as='h1'
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight='bold'
                    letterSpacing='tight'
                    color='gray.800'
                    textAlign='center'
                >Talk-A-Tive</Text>
            </Box>
            <Box
                bg='whiteAlpha.950'
                w='100%'
                p={{ base: 3, md: 5 }}
                borderRadius='xl'
                boxShadow='panel'
            >
                <Tabs variant='soft-rounded' colorScheme='brand' isFitted>
                    <TabList>
                        <Tab>Login</Tab>
                        <Tab>Register</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login></Login>
                        </TabPanel>
                        <TabPanel>
                            <Register></Register>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
