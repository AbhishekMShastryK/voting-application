import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogIn from '../components/LogIn';

describe('LogIn', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<LogIn />);
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('allows the user to log in successfully', async () => {
    const fakeUserResponse = { token: 'fake_user_token' };
    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(fakeUserResponse),
      });
    });

    const { getByPlaceholderText, getByText } = render(<LogIn />);
    fireEvent.change(getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'testpass' },
    });
    fireEvent.click(getByText('Log In'));

    // Check if the fetch function was called with the right arguments
    expect(window.fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass',
      }),
    });

    // Cleanup the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });
});