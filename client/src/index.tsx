// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './Context/ChatProvider';
import axios from 'axios';
import theme from './theme';

const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
if (apiUrl) {
  axios.defaults.baseURL = apiUrl;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ChatProvider>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

