import styles from './Booking.module.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BookingView } from '@/utils/api/types'
import { deleteBooking, getBookings } from '@/utils/api/modelFunction'
import calendarIcon from '@/assets/calendar.svg'
import chevronDownIcon from '@/assets/chevron-down.svg'
import { Loading, RelevantList } from './partials'
import { Error } from '@/components/layout'
import { DeleteBooking } from '@/components/layout/modals/DeleteBooking/DeleteBooking'

type choosenBlock = 'relevant' | 'past'

export function Booking() {
    const [bookings, setBookings] = useState<BookingView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [chosenBlock, setChosenBlock] = useState<choosenBlock>('relevant')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<BookingView | null>(null)
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
        switch (chosenBlock) {
            case 'relevant':
                return (
                    <RelevantList
                        bookings={relevantBookings}
                        onDelete={(booking) => {
                            setSelectedBooking(booking)
                            setIsModalOpen(true)
                        }}
                    />
                )
            case 'past':
                return null
        }
    }, [hasError, isLoading, isModalOpen, selectedBooking, chosenBlock, relevantBookings, handleDelete])

    return (
        <>
            {
                isModalOpen && selectedBooking && (
                    <DeleteBooking
                        onClose={() => setIsModalOpen(false)}
                        booking={selectedBooking}
                        onDelete={() => handleDelete(selectedBooking.id)}
                    />
                )
            }

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
                    <div
                        onClick={() => setChosenBlock('relevant')}
                        className={`${styles.tabNavigationItem} ${chosenBlock === 'relevant' ? styles.tabNavigationItemActive : ''}`}
                    >
                        Предстоящие ({relevantBookings.length})
                    </div>
                    <div
                        className={`${styles.tabNavigationItem} ${chosenBlock === 'past' ? styles.tabNavigationItemActive : ''}`}
                        onClick={() => setChosenBlock('past')}
                    >
                        Прошедшие ({pastBookings.length})
                    </div>
                </div>
                {content}
            </div>
        </>
    )
}
