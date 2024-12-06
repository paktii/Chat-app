import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SearchUser from '../components/SearchUser';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

// Mock the axios module
jest.mock('axios');

// Test the SearchUser component
describe('SearchUser Component', () => {
  let onCloseMock;

  beforeEach(() => {
    onCloseMock = jest.fn();
  });

  it('renders and handles search input correctly', async () => {
    const mockUserData = [
      { _id: '1', name: 'John Doe', email: 'john@example.com' },
      { _id: '2', name: 'Jane Doe', email: 'jane@example.com' }
    ];

    // Mock axios to resolve with user data
    axios.post.mockResolvedValue({ data: { data: mockUserData } });

    const { getByPlaceholderText, getByText, queryByText } = render(<SearchUser onClose={onCloseMock} />);

    // Simulate entering search text
    const searchInput = getByPlaceholderText('Search user by name, email....');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Wait for the API call and results to appear
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Check if the user data is rendered
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Jane Doe')).toBeInTheDocument();

    // Check if 'no user found' is not shown
    expect(queryByText('no user found!')).not.toBeInTheDocument();
  });

  it('shows loading spinner when fetching data', async () => {
    axios.post.mockResolvedValueOnce({ data: { data: [] } });

    const { getByText, getByRole } = render(<SearchUser onClose={onCloseMock} />);

    const searchInput = getByText('Search user by name, email....');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Check if Loading component is displayed during the fetch
    await waitFor(() => expect(getByRole('status')).toBeInTheDocument());
  });

  it('shows no user found message when no users match search', async () => {
    axios.post.mockResolvedValueOnce({ data: { data: [] } });

    const { getByText } = render(<SearchUser onClose={onCloseMock} />);

    const searchInput = getByText('Search user by name, email....');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    // Check that the "no user found!" message appears
    await waitFor(() => expect(getByText('no user found!')).toBeInTheDocument());
  });

  it('calls onClose when close button is clicked', () => {
    const { getByRole } = render(<SearchUser onClose={onCloseMock} />);

    const closeButton = getByRole('button');
    fireEvent.click(closeButton);

    // Check that onClose was called when the close button is clicked
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
