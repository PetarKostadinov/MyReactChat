import React from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Register from '../components/Authentication/Register'
import Login from '../components/Authentication/Login'

function HomePage() {
    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex'
                justifyContent='center'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text
                    fontSize='4x1'
                    fontFamily='Work sans'
                    textAlign={'center'}
                >Talk-A-Tive</Text>
            </Box>
            <Box
                bg='white'
                w='100%'
                p={4}
                borderRadius='lg'
                borderWidth='1px'
            >
                <Tabs variant='soft-rounded'>
                    <TabList>
                        <Tab width={'50%'}>Login</Tab>
                        <Tab width={'50%'}>Register</Tab>
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
