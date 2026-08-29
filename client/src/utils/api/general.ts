export const ENDPOINTS ={
    USERS: {
        ME: '/api/v1/me'
    }, 
    OFFICES: {
        LIST: '/api/v1/offices'
    }, 
    ROOMS: {
        LIST: '/api/v1/rooms', 
        INFO: '	/api/v1/rooms', 
        BOOKINGS: (roomId: string) => `/api/v1/rooms/${roomId}/bookings`
    }, 
    BOOKINGS: {
        CREATE: '/api/v1/bookings',
        LIST: '/api/v1/bookings',
        DELETE: (id: string) => `/api/v1/bookings/${id}`,
    }
} as const

export const DURATION_OPTIONS = [
    { id: 15, name: '15 мин' },
    { id: 30, name: '30 мин' },
    { id: 45, name: '45 мин' },
    { id: 60, name: '1 час' },
    { id: 75, name: '1 час 15 мин' },
    { id: 90, name: '1 час 30 мин' },
    { id: 105, name: '1 час 45 мин' },
    { id: 120, name: '2 час' },
]

export const CAPACITY_OPTIONS = [
    { id: 2, name: '2 человека' },
    { id: 4, name: '4 человека' },
    { id: 6, name: '6 человек' },
    { id: 8, name: '8 человек' },
    { id: 10, name: '10 человек' },
    { id: 12, name: '12 человек' },
]

export const BACKEND_HOST = 'http://localhost:3000'

export const AVAILABLE_TIME = {
    from: '09:00',
    to: '20:00',
    stepMinutes: 15,
} as const

export const BOOKING_VALIDATION_MESSAGES = {
    title: {
        required: 'Название бронирования обязательное поле',
    },
    startsAt: {
        required: 'Дата начала обязательное поле',
        invalid: 'Некорректная дата начала',
        past: 'Дата начала должна быть в будущем',
    },
    endsAt: {
        required: 'Дата окончания обязательное поле',
        invalid: 'Некорректная дата окончания',
        beforeStart: 'Дата окончания должна быть позже даты начала',
        afterWorkingHours: `Время окончания не должно превышать ${AVAILABLE_TIME.to}`,
    },
} as const

export const WEBSOCKET_URL = 'ws://localhost:3000/api/v1/ws'

export const WEBSOCKET_ACTIONS = {
    BOOKING_CREATED: 'booking.created',
    BOOKING_CANCELLED: 'booking.cancelled',
    ROOM_CHANGE_AVAILABILITY: 'room.availability_changed',
} as const