export * from '@avito/server/src/domain/models'

declare global{
    interface BaseResponse<T>{
        items: T[]
    }

    interface BaseRequest{
        
    }

    export interface OfficeListResponse extends BaseResponse<Office>{

    }
    export interface RoomsListResponse extends BaseResponse<Room>{
    
    }
    
    export interface RoomListRequest{
        officeId?: string | number
        minCapacity?: number
        from?: string
        to?: string
        duration: number
    }
}