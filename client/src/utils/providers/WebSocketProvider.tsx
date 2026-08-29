import { WebSocketContext } from '@/utils/context/WebSocketContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import { WEBSOCKET_URL, WEBSOCKET_ACTIONS } from '@/utils/api/general'

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const webSocketRef = useRef<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [createdActions, setCreatedActions] = useState<CreatedAction[]>([])
    const [cancelledActions, setCancelledActions] = useState<CancelledAction[]>([])
    const [availabilityActions, setAvailabilityActions] = useState<RoomChangeAvailabilityAction[]>([])

    const removeCreatedAction = useCallback((action: CreatedAction) => {
        setCreatedActions((prev) => prev.filter((item) => item !== action))
    }, [])

    const removeCancelledAction = useCallback((action: CancelledAction) => {
        setCancelledActions((prev) => prev.filter((item) => item !== action))
    }, [])

    const removeAvailabilityAction = useCallback((action: RoomChangeAvailabilityAction) => {
        setAvailabilityActions((prev) => prev.filter((item) => item !== action))
    }, [])

    useEffect(() => {
        const ws = new WebSocket(WEBSOCKET_URL)
        ws.onopen = () => {
            setIsConnected(true)
        }
        ws.onclose = () => {
            setIsConnected(false)
        }
        ws.onmessage = (event) => {
            try {
                const data: WebSocketActions = JSON.parse(event.data)

                switch (data.type) {
                    case WEBSOCKET_ACTIONS.BOOKING_CREATED:
                        setCreatedActions((prev) => [...prev, data])
                        break
                    case WEBSOCKET_ACTIONS.BOOKING_CANCELLED:
                        setCancelledActions((prev) => [...prev, data])
                        break
                    case WEBSOCKET_ACTIONS.ROOM_CHANGE_AVAILABILITY:
                        setAvailabilityActions((prev) => [...prev, data])
                        break
                }
            } catch {
                setError(new Error('WebSocket error'))
            }
        }
        ws.onerror = () => {
            setError(new Error('WebSocket error'))
        }
        webSocketRef.current = ws
        return () => {
            ws.close()
            webSocketRef.current = null
        }
    }, [])

    return (
        <WebSocketContext.Provider value={{
            webSocket: webSocketRef.current,
            isConnected,
            error,
            sendMessage: () => {},
            closeConnection: () => {},
            createdActions,
            cancelledActions,
            availabilityActions,
            removeCreatedAction,
            removeCancelledAction,
            removeAvailabilityAction,
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}
