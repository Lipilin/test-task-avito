import { vi } from 'vitest'

export const mockRoom = {
    id: 'room-1',
    officeId: 'office-1',
    name: 'Переговорная A',
    floor: 3,
    capacity: 6,
    features: [],
    available: true,
}

vi.mock('@/utils/api/modelFunction', () => ({
    getUser: vi.fn(() => Promise.resolve(null)),
    getOffices: vi.fn(() => Promise.resolve([])),
    getRooms: vi.fn(() => Promise.resolve([])),
    getRoomById: vi.fn(() => Promise.resolve(mockRoom)),
    getRoomBookings: vi.fn(() => Promise.resolve([])),
    getBookings: vi.fn(() => Promise.resolve([])),
    createBooking: vi.fn(() => Promise.resolve({ success: true })),
    deleteBooking: vi.fn(() => Promise.resolve()),
}))
