import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

function Register() {
    const [show, setShow] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [rePass, setRePass] = useState();
    const [pic, setPic] = useState();

    const handleClick = () => {
        setShow(!show);
    }

    const postDetails = (pics) => {

    }
    const submitHandler = (pics) => {

    }

    return (
        <VStack spacing={'5px'}>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Repeat Password'
                        onChange={(e) => setRePass(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={'file'}
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])}
                    />

                </InputGroup>
            </FormControl>
            <Button width={'100%'} style={{ marginTop: 15 }} colorScheme='blue' onClick={submitHandler}>
                Register
            </Button>
        </VStack>
    )
}

export default Register;
