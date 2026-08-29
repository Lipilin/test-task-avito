import type { User, Office, Room, Booking, BookingView } from './types'
import axios from 'axios'
import { ENDPOINTS, BACKEND_HOST } from './general'

export async function getUser(): Promise<User | null> {
    try{
        const response = await axios.get<User>(`${BACKEND_HOST}${ENDPOINTS.USERS.ME}`)
        return response.data || null
    }catch{
        return null
    }
}

export async function getOffices(): Promise<Office[]>{
    const response = await axios.get<OfficeListResponse>(`${BACKEND_HOST}${ENDPOINTS.OFFICES.LIST}`)
    return response.data.items
}

export async function getRooms(request: RoomListRequest): Promise<Room[]>{
    const response = await axios.get<RoomsListResponse>(`${BACKEND_HOST}${ENDPOINTS.ROOMS.LIST}`, {
        params: request,
    })
    return response.data.items
}

export async function getRoomById(request: RoomInfoRequest): Promise<Room> {
    const { id } = request
    const response = await axios.get<Room>(`${BACKEND_HOST}${ENDPOINTS.ROOMS.INFO}/${id}`)
    return response.data
}

export async function getRoomBookings(request: BookRoomRequest): Promise<Booking[]> {
    const { id, from, to } = request
    try{
        if(!from || !to) throw new Error('Неверный формат даты')
        const bookings = await axios.get<BookingGraphResponse>(`${BACKEND_HOST}${ENDPOINTS.ROOMS.BOOKINGS(id)}`, {
            params: {
                from: from, 
                to: to
            },
        })
        return bookings.data.items
    }catch{
        return []
    }
}

export async function createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
    await axios.post<void>(`${BACKEND_HOST}${ENDPOINTS.BOOKINGS.CREATE}`, request)
    return {
        success: true
    }
}

export async function getBookings(): Promise<BookingView[]> {
    const response = await axios.get<BookingsListResponse>(`${BACKEND_HOST}${ENDPOINTS.BOOKINGS.LIST}`)
    return response.data.items
}

export async function deleteBooking(id: string): Promise<void> {
    await axios.delete(`${BACKEND_HOST}${ENDPOINTS.BOOKINGS.DELETE(id)}`, {})
}
