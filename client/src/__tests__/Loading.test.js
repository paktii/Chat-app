import React from 'react';
import { render } from '@testing-library/react';
import Loading from '../components/Loading';

describe('Loading Component', () => {
  it('renders the loading spinner', () => {
    const { container } = render(<Loading />);

    // ตรวจสอบว่า svg ถูก render หรือไม่
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // ตรวจสอบว่ามี class ที่เกี่ยวข้องกับการหมุน
    expect(svg).toHaveClass('animate-spin');

    // ตรวจสอบว่า span ที่มีข้อความ 'Loading...' อยู่หรือไม่
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Loading...');
  });
});
