import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserDetails from '../components/EditUserDetails';
import axios from 'axios'
import { Provider } from 'react-redux';
import { store } from '../redux/store';  // ถ้าคุณใช้ Redux ในโปรเจคของคุณ

jest.mock('axios');
jest.mock('../helpers/uploadFile', () => ({
  __esModule: true,
  default: jest.fn(() => ({ url: 'new-image-url' }))
}));

describe('EditUserDetails Component', () => {
  const mockUser = {
    user: 'John Doe',
    profile_pic: 'old-image-url'
  };
  const mockOnClose = jest.fn();

  beforeEach(() => {
    render(
      <Provider store={store}>
        <EditUserDetails user={mockUser} onClose={mockOnClose} />
      </Provider>
    );
  });

  test('renders user details correctly', () => {
    expect(screen.getByLabelText(/name/i).value).toBe(mockUser.user);
    expect(screen.getByText(/change photo/i)).toBeInTheDocument();
  });

  test('allows user to change name', () => {
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    expect(nameInput.value).toBe('Jane Doe');
  });

  test('uploads new profile photo', async () => {
    const fileInput = screen.getByLabelText(/change photo/i).closest('label').querySelector('input');
    const mockFile = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText(/change photo/i)).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();  // ตรวจสอบว่าไม่ได้ปิดก่อนการอัปโหลด
    });
  });

  test('submits the form and updates user details', async () => {
    const saveButton = screen.getByText(/save/i);

    axios.post.mockResolvedValue({
      data: { success: true, message: 'Profile updated successfully', data: { user: 'Jane Doe', profile_pic: 'new-image-url' } }
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/api/update-user`,
        {
          name: 'Jane Doe',
          profile_pic: 'new-image-url'
        },
        { withCredentials: true }
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('shows error when submission fails', async () => {
    const saveButton = screen.getByText(/save/i);

    axios.post.mockRejectedValue(new Error('Network Error'));

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
