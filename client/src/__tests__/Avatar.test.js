import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';  // สำหรับ matchers เช่น "toBeInTheDocument"
import Avatar from '../components/Avatar';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// การจำลอง Redux store
const mockStore = createStore(() => ({
  user: {
    onlineUser: ['user1', 'user2']  // สมมุติว่า user1 และ user2 เป็นผู้ใช้ที่ออนไลน์
  }
}));

// ฟังก์ชันช่วยสำหรับการทดสอบ
const renderWithStore = (ui) => {
  return render(<Provider store={mockStore}>{ui}</Provider>);
};

describe('Avatar Component', () => {
  it('renders image when imageUrl is provided', () => {
    const { container } = renderWithStore(<Avatar userId="user1" name="John Doe" imageUrl="http://example.com/avatar.jpg" width={50} height={50} />);
    const avatarImage = container.querySelector('img');
    expect(avatarImage).toHaveAttribute('src', 'http://example.com/avatar.jpg');
  });

  it('renders initials when imageUrl is not provided', () => {
    renderWithStore(<Avatar userId="user2" name="John Doe" imageUrl="" width={50} height={50} />);
    const initials = screen.getByText('JD');
    expect(initials).toBeInTheDocument();
  });

  it('renders PiUserCircle icon when no name and imageUrl are provided', () => {
    renderWithStore(<Avatar userId="user3" name="" imageUrl="" width={50} height={50} />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('data-icon', 'PiUserCircle');
  });

  it('shows the online status indicator when user is online', () => {
    renderWithStore(<Avatar userId="user1" name="Jane Doe" imageUrl="" width={50} height={50} />);
    const onlineIndicator = screen.getByRole('img', { hidden: true }); // สัญลักษณ์สถานะออนไลน์
    expect(onlineIndicator).toHaveClass('bg-green-600');
  });

  it('does not show the online status indicator when user is offline', () => {
    renderWithStore(<Avatar userId="user4" name="John Smith" imageUrl="" width={50} height={50} />);
    const onlineIndicator = screen.queryByRole('img', { hidden: true });
    expect(onlineIndicator).not.toBeInTheDocument();
  });
});
