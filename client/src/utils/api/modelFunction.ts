import type { User } from './types'
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