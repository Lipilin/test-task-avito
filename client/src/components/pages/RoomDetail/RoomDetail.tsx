import styles from './RoomDetail.module.css'
import { useLocation, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { addDays, startOfDay } from 'date-fns'
import type { Booking, Room } from '@/utils/api/types'
import { getRoomBookings, getRoomById } from '@/utils/api/modelFunction'
import { BookRoomModal } from '@/components/layout/modals'
import { Loading, RoomInfo, RoomSchedule } from './partials'
import { Error } from '@/components/layout'

export function RoomDetail() {
    const { id } = useParams()
    const location = useLocation()
    const locationState = location.state as RoomListFilters | undefined
    const [room, setRoom] = useState<Room | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [isBookRoomModalOpen, setIsBookRoomModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(() => startOfDay(locationState?.from || new Date()))

    useEffect(() => {
        if (!id) return
        async function fetchRoom() {
            try {
                setHasError(false)
                setIsLoading(true)
                const room = await getRoomById({ id: id! })
                setRoom(room)
            } catch {
                setHasError(true)
                setRoom(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRoom()
    }, [id, onRetry])

    useEffect(() => {
        if (!id) return
        async function fetchBookings() {
            const dayStart = startOfDay(selectedDate)
            const dayEnd = addDays(dayStart, 1)
            const bookings = await getRoomBookings({
                id: id!,
                from: dayStart.toISOString(),
                to: dayEnd.toISOString(),
            })
            setBookings(bookings)
        }
        fetchBookings()
    }, [id, onRetry, selectedDate])

    return (
        <div className={styles.container}>
            <BookRoomModal
                room={room}
                isOpen={isBookRoomModalOpen}
                onClose={() => setIsBookRoomModalOpen(false)}
                defaultDate={locationState?.from || null}
                defaultDuration={locationState?.duration || null}
                defaultStartTime={locationState?.startTime || null}
            />
            {hasError ? (
                <Error
                    description="Произошла ошибка при загрузке переговорной"
                    onAction={() => setOnRetry((count) => count + 1)}
                />
            ) : isLoading === true && !room ? (
                <Loading />
            ) : room ? (
                <div className={styles.wrapper}>
                    <RoomInfo room={room} />
                    <RoomSchedule
                        bookings={bookings}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        available={room.available !== false}
                        onBookClick={() => setIsBookRoomModalOpen(true)}
                    />
                </div>
            ) : null}
        </div>
    )
}
