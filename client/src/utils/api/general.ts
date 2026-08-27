export const ENDPOINTS ={
    USERS: {
        ME: '/api/v1/me'
    }, 
    OFFICES: {
        LIST: '/api/v1/offices'
    }, 
    ROOMS: {
        LIST: '/api/v1/rooms', 
        INFO: '	/api/v1/rooms/'
    }, 
} as const

export const DURATION_OPTIONS = [
    { id: 15, name: '15 мин' },
    { id: 30, name: '30 мин' },
    { id: 45, name: '45 мин' },
    { id: 60, name: '1 час' },
    { id: 90, name: '1 час 30 мин' },
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