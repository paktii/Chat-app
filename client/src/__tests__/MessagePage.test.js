import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import MessagePage from '../components/MessagePage';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../redux/store';

test('renders MessagePage correctly and handles file upload', async () => {
  // Render คอมโพเนนต์ในบริบทของ Redux และ Router
  await act(async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/messages/2']}>
          <MessagePage />
        </MemoryRouter>
      </Provider>
    );
  });

  // ตรวจสอบว่าองค์ประกอบสำหรับอัปโหลดไฟล์ปรากฏ
  const uploadInput = screen.getByTestId('file-upload');
  expect(uploadInput).toBeInTheDocument();

  // จำลองการอัปโหลดไฟล์
  fireEvent.change(uploadInput, {
    target: { files: [new File(['dummy content'], 'example.txt', { type: 'text/plain' })] },
  });

  // ตรวจสอบข้อความที่ปรากฏหลังอัปโหลด
  expect(screen.getByText(/ไฟล์ถูกอัปโหลด/i)).toBeInTheDocument();
});
