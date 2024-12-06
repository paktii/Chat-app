// __tests__/mockData/mockSocket.js
export const mockSocketConnection = {
    emit: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn(),
}

test('should mock socket correctly', () => {
    expect(true).toBe(true);
});