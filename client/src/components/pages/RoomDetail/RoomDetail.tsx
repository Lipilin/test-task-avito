import styles from './RoomDetail.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { addDays, startOfDay } from 'date-fns'
import type { Booking, Room } from '@/utils/api/types'
import { getRoomBookings, getRoomById } from '@/utils/api/modelFunction'
import { AVAILABLE_TIME } from '@/utils/api/general'
import usersIcon from '@/assets/room-detail/users.svg'
import displayIcon from '@/assets/room-detail/display.svg'
import whiteboardIcon from '@/assets/room-detail/whiteboard.svg'
import videoIcon from '@/assets/room-detail/video.svg'
import { BookRoomModal } from '@/components/layout/modals'
import { Loading } from './partials/Loading'
import { Error } from '@/components/layout'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { BookingGraph } from '@/components/layout/Other/BookingGraph'

const featureIcons: Record<string, string> = {
    display: displayIcon,
    whiteboard: whiteboardIcon,
    video: videoIcon,
}

const [fromHour] = AVAILABLE_TIME.from.split(':').map(Number)
const [toHour] = AVAILABLE_TIME.to.split(':').map(Number)

export function RoomDetail() {
    const { id } = useParams()
    const [room, setRoom] = useState<Room | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [isBookRoomModalOpen, setIsBookRoomModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
    useEffect(() => {
        if(!id) return
        async function fetchRoom() {
            try {
                setHasError(false)
                setIsLoading(true)
                const room  = await getRoomById({
                    id: id!
                })
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
        if(!id) return
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
            <BookRoomModal room={room} isOpen={isBookRoomModalOpen} onClose={() => setIsBookRoomModalOpen(false)} />
            {
                hasError ? (
                    <Error
                        description="Произошла ошибка при загрузке переговорной"
                        onAction={() => setOnRetry((count) => count + 1)}
                    />
                ) : isLoading === true && !room ? (
                    <Loading />
                ) : room ? (
                    <div className = {styles.wrapper}>
                        <div className = {styles.roomInfo}>
                            <div className={styles.roomName}>
                                { room.name }
                            </div> 
                            <div className = {styles.delimeter}></div>
                            <div className={styles.features}>
                                <div className={styles.featureItem}>
                                    <img src={usersIcon} alt="" className={styles.featureIcon} />
                                    Вместимость: до { room.capacity } человек
                                </div>
                                { room.features.map((item) => (
                                    <div className={styles.featureItem} key={item.code}>
                                        {featureIcons[item.code] ? (
                                            <img
                                                src={featureIcons[item.code]}
                                                alt=""
                                                className={styles.featureIcon}
                                            />
                                        ) : null}
                                        { item.name }
                                    </div>
                                )) }
                            </div>
                        </div>
                        <div className = { styles.roomBookings }>
                            <div className={styles.scheduleHeader}>
                                <div className={styles.scheduleTitle}>
                                    Расписание на день
                                </div>
                                <DatePickerField
                                    variant="schedule"
                                    hideTitle
                                    selected={selectedDate}
                                    onChange={(date) => {
                                        if (date) {
                                            setSelectedDate(startOfDay(date))
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles.timeline}>
                                <div className={styles.timelineTimes}>
                                    {Array.from({ length: toHour - fromHour + 1 }, (_, index) => {
                                        const time = `${String(fromHour + index).padStart(2, '0')}:00`

                                        return (
                                            <div className={styles.timeline_item_time} key={time}>
                                                {time}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={styles.timelineCanvas}>
                                    {Array.from({ length: toHour - fromHour + 1 }, (_, index) => {
                                        const time = `${String(fromHour + index).padStart(2, '0')}:00`

                                        return (
                                            <div className={styles.timeline_line} key={time}>
                                                <div className={styles.delimeter} />
                                            </div>
                                        )
                                    })}
                                    {bookings.map((item) => (
                                        <BookingGraph
                                            key={item.id}
                                            title={item.title}
                                            startsAt={item.startsAt}
                                            endsAt={item.endsAt}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className = { styles.actions }>
                                <div className = { room.available === false ? styles.bookButtonDisabled : styles.bookButton } onClick={() => setIsBookRoomModalOpen(true)}>
                                    Забронировать комнату
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}