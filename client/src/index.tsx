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

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Application root element was not found');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ChakraProvider>
  </BrowserRouter>
);
