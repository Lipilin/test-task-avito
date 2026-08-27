import type { User, Office, OfficeListResponse, Room, RoomsListResponse } from './types'
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

export async function getRooms(id: string | number): Promise<Room[]>{
    const response = await axios.get<RoomsListResponse>(`${BACKEND_HOST}${ENDPOINTS.ROOMS.LIST}`, {
        params: {
            officeId: id
        }
    })
    return response.data.items
}