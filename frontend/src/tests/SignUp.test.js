// SignUp.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../components/SignUp';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('SignUp', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );
    expect(getByPlaceholderText('Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email id')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(getByPlaceholderText('Mobile number')).toBeInTheDocument();
    expect(getByPlaceholderText('Age')).toBeInTheDocument();
    expect(getByPlaceholderText('Address')).toBeInTheDocument();
    expect(getByPlaceholderText('Zip code')).toBeInTheDocument();
    expect(getByPlaceholderText('Driving license')).toBeInTheDocument();
    expect(getByPlaceholderText('Passport number')).toBeInTheDocument();
  });

  it('submits the form', async () => {
    const { getByPlaceholderText, getByText } = render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );
    const mockResponse = { data: { status: 'success' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email id'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Mobile number'), { target: { value: '1234567890' } });
    fireEvent.change(getByPlaceholderText('Age'), { target: { value: '30' } });
    fireEvent.change(getByPlaceholderText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(getByPlaceholderText('Zip code'), { target: { value: '12345' } });
    fireEvent.change(getByPlaceholderText('Driving license'), { target: { value: 'DL12345' } });
    fireEvent.change(getByPlaceholderText('Passport number'), { target: { value: 'P12345' } });

    fireEvent.click(getByText('Register'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/register', {
      name: 'John Doe',
      emailid: 'john.doe@example.com',
      password: 'password123',
      confirmpwd: 'password123',
      mobilenumber: '1234567890',
      age: '30',
      address: '123 Main St',
      zipcode: '12345',
      drivingLicense: 'DL12345',
      passportNumber: 'P12345',
      status: 'pending'
    }));
  });
});