export * from '@avito/server/src/domain/models'

declare global{

    interface BaseResponse<T>{
        items: T[]
    }

    interface BaseRequest{
        
    }

    interface OfficeListResponse extends BaseResponse<Office>{

    }
    interface RoomsListResponse extends BaseResponse<Room>{
    
    }

    interface RoomListFilters{
        duration: number
        from: Date
        minCapacity: number
        startTime?: string
    }
    
    interface RoomListRequest{
        officeId?: string | number
        minCapacity?: number
        from?: string
        to?: string
    }

    interface RoomInfoRequest{
        id: string
    }

    interface BookRoomRequest{
        id: string, 
        from?: string
        to?: string
    }

    interface CreateBookingRequest{
        roomId: string
        title: string
        comment?: string
        startsAt: string
        endsAt: string
    }

    interface CreateBookingResponse{
        success: boolean
    }

    interface BookingsListResponse extends BaseResponse<BookingView>{

    }

    interface BookingGraphResponse extends BaseResponse<Booking>{

    }

    interface BaseAction{
        type: string
        occurredAt: string
        data: Record<string, any>
    }

    interface CreatedAction extends BaseAction{
        type: 'booking.created'
        data: {
            booking: BookingView
        }
    }

    interface CancelledAction extends BaseAction{
        type: 'booking.cancelled'
        data: {
            booking: BookingView
        }
    }

    interface RoomChangeAvailabilityAction extends BaseAction{
        type: 'room.availability_changed'
        data: {
            roomId: string
            officeId: string
            startsAt: string
            endsAt: string
            available: boolean
        }
    }

    type WebSocketActions = CreatedAction | CancelledAction | RoomChangeAvailabilityAction
}

declare module '@avito/server/src/domain/models' {
    interface Room {
        available?: boolean
    }
}

export {}