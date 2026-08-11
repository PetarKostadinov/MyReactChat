import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import theme from '../../theme';
import Login from './Login';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    isAxiosError: jest.fn(),
  },
}));

const mockedAxios = axios as unknown as { post: jest.Mock };

const renderLogin = () => render(
  <ChakraProvider theme={theme}>
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chats' element={<div>Chats page</div>} />
      </Routes>
    </MemoryRouter>
  </ChakraProvider>,
);

describe('Login', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
    localStorage.clear();
  });

  test('submits normalized credentials and stores the authenticated user', async () => {
    const authenticatedUser = {
      _id: 'user-id',
      name: 'Alice',
      email: 'alice@example.com',
      token: 'token',
    };
    mockedAxios.post.mockResolvedValue({ data: authenticatedUser });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'Alice@Example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/user/login',
      { email: 'alice@example.com', password: 'Password123!' },
      expect.any(Object),
    ));
    expect(await screen.findByText('Chats page')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('userInfo') ?? '{}')).toEqual(authenticatedUser);
  });

  test('does not call the API when required fields are empty', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});
