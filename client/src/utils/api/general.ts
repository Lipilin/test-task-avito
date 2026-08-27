export const ENDPOINTS ={
    USERS: {
        ME: '/api/v1/me'
    }, 
    OFFICES: {
        LIST: '/api/v1/offices'
    }, 
    ROOMS: {
        LIST: '/api/v1/rooms'
    }
} as const

export const BACKEND_HOST = 'http://localhost:3000'