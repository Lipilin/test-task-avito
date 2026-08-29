import { useMemo } from 'react'
import type { Office, Room } from '@avito/server/src/domain/models'
import { Room as RoomComponent } from '@/components/layout/rooms/Room'
import searchEmptyIcon from '@/assets/search-empty.svg'
import { Error, Empty } from '@/components/layout'
import styles from '../../RoomList.module.css'
import { Loading } from '../Loading'
import { SelectOffice } from '../SelectOffice'

interface RoomListContentProps {
    hasError: boolean
    isLoading: boolean
    activeOffice: Office | null
    rooms: Room[]
    onRetry: () => void
    onBook: (room: Room) => void
}

export function RoomListContent({
    hasError,
    isLoading,
    activeOffice,
    rooms,
    onRetry,
    onBook,
}: RoomListContentProps) {
    const content = useMemo(() => {
        if (hasError) {
            return (
                <Error
                    description="Произошла ошибка при загрузке списка переговорных"
                    onAction={onRetry}
                />
            )
        }
        if (isLoading) return <Loading />
        if (!activeOffice) return <SelectOffice />
        if (rooms.length === 0) {
            return (
                <Empty
                    icon={searchEmptyIcon}
                    title="Нет доступных переговорных"
                    description="Попробуйте изменить параметры фильтрации или выбрать другой офис"
                    actionLabel="Сбросить фильтры"
                />
            )
        }
        return (
            <div className={styles.roomList}>
                <h3 className={styles.roomListTitle}>Доступные переговорные в этом офисе</h3>
                <div className={styles.rooms}>
                    {rooms.map((item) => (
                        <RoomComponent room={item} key={item.id} onBook={() => onBook(item)} />
                    ))}
                </div>
            </div>
        )
    }, [hasError, isLoading, activeOffice, rooms, onRetry, onBook])

    return content
}
