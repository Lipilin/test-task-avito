import styles from './Booking.module.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BookingView } from '@/utils/api/types'
import { deleteBooking, getBookings } from '@/utils/api/modelFunction'
import calendarIcon from '@/assets/calendar.svg'
import chevronDownIcon from '@/assets/chevron-down.svg'
import officeBuildingIcon from '@/assets/office-building.svg'
import { Loading } from './partials'
import { Error, Empty } from '@/components/layout'

export function Booking() {
    const [bookings, setBookings] = useState<BookingView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [relevantBookings, pastBookings] = useMemo(() => {
        return [bookings.filter((booking) => {
            return new Date(booking.startsAt) > new Date()
        }), bookings.filter((booking) => {
            return new Date(booking.startsAt) < new Date()
        })]
    }, [bookings])
    useEffect(() => {
        async function fetchBookings() {
            try {
                setHasError(false)
                setIsLoading(true)
                const items = await getBookings()
                setBookings(items)
            } catch {
                setHasError(true)
                setBookings([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchBookings()
    }, [onRetry])
    const handleDelete = useCallback((id: string) => {
        deleteBooking(id)
    }, [])

    const content = useMemo(() => {
        if (hasError) {
            return (
                <Error
                    description="Произошла ошибка при загрузке ваших бронирований"
                    onAction={() => setOnRetry((count) => count + 1)}
                />
            )
        }
        if (isLoading) {
            return <Loading />
        }
        if (relevantBookings.length === 0) {
            return (
                <Empty
                    icon={officeBuildingIcon}
                    variant="accent"
                    title="Нет бронирований"
                    description={
                        <>
                            У вас пока нет предстоящих бронирований.
                            <br />
                            Перейдите в раздел переговорных, чтобы забронировать комнату.
                        </>
                    }
                    actionLabel="Перейти к переговорным"
                    actionHref="/rooms"
                />
            )
        }
        return (
            <div className={styles.bookingsList}>
                { relevantBookings.map((item) => {
                    const startsAt = new Date(item.startsAt)
                    const endsAt = new Date(item.endsAt)

                    return (
                        <div className={styles.bookingItem} key={item.id}>
                            <div className={styles.bookingItemContent}>
                                <div className={styles.bookingItemBadge}>
                                    <span className={styles.badgeMonth}>
                                        {startsAt.toLocaleDateString('ru-RU', { month: 'long' })}
                                    </span>
                                    <span className={styles.badgeDay}>
                                        {startsAt.toLocaleDateString('ru-RU', { day: 'numeric' })}
                                    </span>
                                </div>
                                <div className={styles.bookingItemInfo}>
                                    <div className={styles.bookingItemTitle}>
                                        { item.title }
                                    </div>
                                    <div className={styles.bookingItemMeta}>
                                        <span className={styles.metaRoom}>
                                            <img src={officeBuildingIcon} alt="" className={styles.metaRoomIcon} />
                                            { item.room.name }
                                        </span>
                                        <span className={styles.metaDot}>·</span>
                                        <span>{ item.room.floor } этаж</span>
                                        <span className={styles.metaDot}>·</span>
                                        <span>
                                            {startsAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                            {' '}-{' '}
                                            {endsAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                            {' '}MSK
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.buttonDelete}
                                onClick={() => handleDelete(item.id)}
                            >
                                Отменить
                            </button>
                        </div>
                    )
                }) }
            </div>
        )
    }, [hasError, isLoading, relevantBookings, handleDelete])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>Мои бронирования</h1>
                <div className={styles.headerFilters}>
                    <div className={styles.filterButton}>
                        <span>Все офисы</span>
                        <img src={chevronDownIcon} alt="" className={styles.filterChevron} />
                    </div>
                    <div className={styles.filterButton}>
                        <img src={calendarIcon} alt="" className={styles.filterIcon} />
                        <span>За все время</span>
                    </div>
                </div>
            </div>
            <div className={styles.tabNavigation}>
                <div className={`${styles.tabNavigationItem} ${styles.tabNavigationItemActive}`}>
                    Предстоящие ({relevantBookings.length})
                </div>
                <div className={styles.tabNavigationItem}>
                    Прошедшие ({pastBookings.length})
                </div>
            </div>
            {content}
        </div>
    )
}
