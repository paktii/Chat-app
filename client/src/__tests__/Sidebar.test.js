import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // หรือที่เก็บ store ของคุณ
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { FaUserPlus } from 'react-icons/fa';

// Mock the socket connection
jest.mock('socket.io-client', () => jest.fn(() => ({
  emit: jest.fn(),
  on: jest.fn()
})));

describe('Sidebar Component', () => {
  const user = {
    _id: '1',
    name: 'Test User',
    profile_pic: 'test_image_url'
  };

  it('renders Sidebar correctly with user data', () => {
    const { getByText, getByTitle } = render(
      <Provider store={store}>
        <Router>
          <Sidebar />
        </Router>
      </Provider>
    );

    // Check if user name and avatar are displayed
    expect(getByText('Message')).toBeInTheDocument();
    expect(getByTitle('Test User')).toBeInTheDocument();  // Avatar button with user name
  });

  it('opens EditUserDetails on avatar click', async () => {
    const { getByTitle, getByText } = render(
      <Provider store={store}>
        <Router>
          <Sidebar />
        </Router>
      </Provider>
    );

    fireEvent.click(getByTitle('Test User'));  // Click on user avatar

    await waitFor(() => expect(getByText('Edit User Details')).toBeInTheDocument());
  });

  it('opens SearchUser modal when Add Friend is clicked', async () => {
    const { getByTitle, getByText } = render(
      <Provider store={store}>
        <Router>
          <Sidebar />
        </Router>
      </Provider>
    );

    fireEvent.click(getByTitle('add friend'));  // Click on Add Friend button (FaUserPlus)

    await waitFor(() => expect(getByText('Search user by name, email....')).toBeInTheDocument());
  });

  it('logs out user when logout button is clicked', () => {
    const { getByTitle } = render(
      <Provider store={store}>
        <Router>
          <Sidebar />
        </Router>
      </Provider>
    );

    const logoutButton = getByTitle('logout');
    fireEvent.click(logoutButton);

    // Assuming the logout function clears the user data and navigates to the login page
    expect(localStorage.clear).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/email');  // Assuming email is the login route
  });

  it('displays conversation users when socket data is emitted', async () => {
    const { getByText, getByAltText } = render(
      <Provider store={store}>
        <Router>
          <Sidebar />
        </Router>
      </Provider>
    );

    const mockSocketData = [
      {
        userDetails: { name: 'John Doe', _id: '2', profile_pic: 'john_image_url' },
        lastMsg: { text: 'Hello', imageUrl: null, videoUrl: null },
        unseenMsg: 1
      }
    ];

    // Simulate receiving socket data
    act(() => {
      socket.emit('conversation', mockSocketData);
    });

    await waitFor(() => expect(getByText('John Doe')).toBeInTheDocument());
    expect(getByAltText('John Doe')).toBeInTheDocument();  // Avatar
    expect(getByText('Hello')).toBeInTheDocument();  // Last message text
  });
});
