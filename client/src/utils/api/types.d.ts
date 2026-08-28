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

}

declare module '@avito/server/src/domain/models' {
    interface Room {
        available?: boolean
    }
}

export {}