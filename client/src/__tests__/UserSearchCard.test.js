import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // สำหรับ matchers เช่น "toBeInTheDocument"
import UserSearchCard from '../components/UserSearchCard'
import { BrowserRouter as Router } from 'react-router-dom' // ใช้ Router สำหรับ Link component

// การจำลอง Avatar component สำหรับการทดสอบ
jest.mock('../components/Avatar', () => () => <div>Avatar</div>)

describe('UserSearchCard', () => {
  const user = {
    _id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    profile_pic: 'http://example.com/profile.jpg',
  }

  const onCloseMock = jest.fn()

  it('แสดงข้อมูลของผู้ใช้ได้ถูกต้อง', () => {
    render(
      <Router>
        <UserSearchCard user={user} onClose={onCloseMock} />
      </Router>
    )

    // ตรวจสอบว่าชื่อและอีเมลของผู้ใช้แสดงผลถูกต้อง
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('Avatar')).toBeInTheDocument()
  })

  it('นำทางไปยังโปรไฟล์ของผู้ใช้เมื่อคลิก', () => {
    render(
      <Router>
        <UserSearchCard user={user} onClose={onCloseMock} />
      </Router>
    )

    // ตรวจสอบว่า Link component ปรากฏในเอกสาร
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()

    // จำลองเหตุการณ์คลิก
    fireEvent.click(link)

    // ฟังก์ชัน onClose ควรถูกเรียกเมื่อคลิก
    expect(onCloseMock).toHaveBeenCalledTimes(1)

    // ตรวจสอบว่า href ของลิงค์ชี้ไปยังหน้าโปรไฟล์ของผู้ใช้ถูกต้อง
    expect(link).toHaveAttribute('href', '/123')
  })
})
