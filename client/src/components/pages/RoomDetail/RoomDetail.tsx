import styles from './RoomDetail.module.css'
import { useLocation, useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { addDays, startOfDay } from 'date-fns'
import type { Booking, Room } from '@/utils/api/types'
import { getRoomBookings, getRoomById } from '@/utils/api/modelFunction'
import { WebSocketContext } from '@/utils/context/WebSocketContext'
import { isBookingOnDay } from '@/utils/other'
import { BookRoomModal } from '@/components/layout/modals'
import { Loading, RoomInfo, RoomSchedule } from './partials'
import { Error } from '@/components/layout'

function getBookingRoomId(booking: { roomId: string; room?: { id: string } }) {
    return booking.roomId ?? booking.room?.id
}

export function RoomDetail() {
    const { id } = useParams()
    const location = useLocation()
    const {
        createdActions,
        cancelledActions,
        availabilityActions,
        removeCreatedAction,
        removeCancelledAction,
        removeAvailabilityAction,
    } = useContext(WebSocketContext)
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

    useEffect(() => {
        if (!id || createdActions.length === 0) return

        createdActions.forEach((action) => {
            const { booking } = action.data
            if (getBookingRoomId(booking) === id && isBookingOnDay(booking.startsAt, selectedDate)) {
                setBookings((prev) => {
                    if (prev.some((item) => item.id === booking.id)) return prev

                    return [...prev, booking].sort(
                        (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
                    )
                })
            }
            removeCreatedAction(action)
        })
    }, [createdActions, id, selectedDate, removeCreatedAction])

    useEffect(() => {
        if (!id || cancelledActions.length === 0) return

        cancelledActions.forEach((action) => {
            const { booking } = action.data
            if (getBookingRoomId(booking) === id) {
                setBookings((prev) => prev.filter((item) => item.id !== booking.id))
            }
            removeCancelledAction(action)
        })
    }, [cancelledActions, id, removeCancelledAction])

    useEffect(() => {
        if (!id || availabilityActions.length === 0) return

        availabilityActions.forEach((action) => {
            const { roomId, available } = action.data
            if (roomId === id) {
                setRoom((prev) => (prev ? { ...prev, available } : prev))
            }
            removeAvailabilityAction(action)
        })
    }, [availabilityActions, id, removeAvailabilityAction])

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
