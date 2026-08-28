import styles from './Booking.module.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BookingView } from '../../../utils/api/types'
import { deleteBooking, getBookings } from '../../../utils/api/modelFunction'

export function Booking() {
    const [ bookings, setBookings] = useState<BookingView[]>([])
    const [relevantBookings, pastBookings] = useMemo(() => {
        return [bookings.filter((booking) => {
            return new Date(booking.startsAt) > new Date()
        }), bookings.filter((booking) => {
            return new Date(booking.startsAt) < new Date()
        })]
    }, [bookings])
    useEffect(() => {
        getBookings().then((bookings) => {
            setBookings(bookings)
        })
    }, [])
    const handleDelete = useCallback((id: string) => {
        deleteBooking(id)
    }, [])
    return (
        <div className={styles.container}>
            <div className = { styles.header }>
                <div className = { styles.header_title }>
                    Мои бронирования
                </div>
            </div>
            <div className = { styles.tabNavigation}>
                <div className = { styles.tabNavigation_item }>
                    Предстоящие({relevantBookings.length})
                </div>
                <div className = { styles.tabNavigation_item }>
                    Прошедшие({pastBookings.length})
                </div>
            </div>
            <div className = { styles.bookingsList }>
                { relevantBookings.map((item) => {
                    return (
                        <div className = { styles.bookingItem } key = { item.id }>
                            <div className = { styles.bookingItem_content }>
                                <div className = { styles.bookingItem_badge }>
                                    <span>
                                        Октябрь
                                    </span>
                                    <span>
                                        24
                                    </span>
                                </div>
                                <div className = { styles.bookingItem_title }>
                                    { item.title }
                                </div>
                            </div>
                            <div className={styles.button_delete} onClick={() => handleDelete(item.id)}>
                                Отменить
                            </div>
                        </div>
                    )
                }) }
            </div>
        </div>
    )
}