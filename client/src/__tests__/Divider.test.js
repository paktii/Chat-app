import React from 'react';
import { render } from '@testing-library/react';
import Divider from '../components/Divider';

describe('Divider Component', () => {
  it('renders correctly', () => {
    const { container } = render(<Divider />);

    // ตรวจสอบว่า div ถูก render ออกมาหรือไม่
    const divider = container.querySelector('div');
    expect(divider).toBeInTheDocument();

    // ตรวจสอบว่ามีคลาสที่ถูกต้องหรือไม่
    expect(divider).toHaveClass('p-[0.5px]');
    expect(divider).toHaveClass('bg-slate-200');
    expect(divider).toHaveClass('my-1');
  });
});
