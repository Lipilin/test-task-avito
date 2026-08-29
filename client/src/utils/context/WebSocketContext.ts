import { createContext } from 'react'

export interface WebSocketContextType {
    isConnected: boolean
    error: Error | null
    sendMessage: (message: string) => void
    closeConnection: () => void
    createdActions: CreatedAction[]
    cancelledActions: CancelledAction[]
    availabilityActions: RoomChangeAvailabilityAction[]
    removeCreatedAction: (action: CreatedAction) => void
    removeCancelledAction: (action: CancelledAction) => void
    removeAvailabilityAction: (action: RoomChangeAvailabilityAction) => void
}

export const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    error: null,
    sendMessage: () => {},
    closeConnection: () => {},
    createdActions: [],
    cancelledActions: [],
    availabilityActions: [],
    removeCreatedAction: () => {},
    removeCancelledAction: () => {},
    removeAvailabilityAction: () => {},
})
