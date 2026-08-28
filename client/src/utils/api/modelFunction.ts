import type { User, Office, Room } from './types'
import axios from 'axios'
import { ENDPOINTS, BACKEND_HOST } from './general'

export async function getUser(): Promise<User | null> {
    try{
        const response = await axios.get<User>(`${BACKEND_HOST}${ENDPOINTS.USERS.ME}`)
        return response.data || null
    }catch(error){
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

export async function getRoomById(id: string): Promise<Room> {
    const response = await axios.get<Room>(`${BACKEND_HOST}${ENDPOINTS.ROOMS.INFO}${id}`)
    return response.data
}
