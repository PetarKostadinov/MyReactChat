import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Login() {
    const [show, setShow] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => {
        setShow(!show);
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'All fields are required',
                status: 'warning',
                duration: '5000',
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: { 'Content-type': 'application/json' }
            };

            const { data } = await axios.post('/api/user/login', { email, password }, config);
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing={'5px'}>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        value={password || ''}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                width={'100%'}
                style={{ marginTop: 15 }}
                colorScheme='blue'
                isLoading={loading}
                onClick={submitHandler}>
                Login
            </Button>
            <Button
                variant={'solid'}
                width={'100%'}
                colorScheme='red'
                onClick={() => { setEmail('guest@example.com'); setPassword('123456'); }}
            >
                Login with Guest Credentials
            </Button>
        </VStack>
    )
}

export default Login;
