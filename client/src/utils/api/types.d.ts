export * from '@avito/server/src/domain/models'

interface BaseResponse<T>{
    items: T[]
}

export interface OfficeListResponse extends BaseResponse<Office>{

}
export interface RoomsListResponse extends BaseResponse<Room>{

}