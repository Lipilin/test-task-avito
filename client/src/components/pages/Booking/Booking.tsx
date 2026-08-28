import styles from './Booking.module.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BookingView } from '@/utils/api/types'
import type { ChosenBlock } from './Booking.d'
import { deleteBooking, getBookings } from '@/utils/api/modelFunction'
import { Loading, BookingList } from './partials'
import { Error } from '@/components/layout'
import { DeleteBooking } from '@/components/layout/modals/DeleteBooking/DeleteBooking'

export function Booking() {
    const [bookings, setBookings] = useState<BookingView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [chosenBlock, setChosenBlock] = useState<ChosenBlock>('relevant')
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
                    <BookingList
                        type="relevant"
                        bookings={relevantBookings}
                        onDelete={(booking) => {
                            setSelectedBooking(booking)
                            setIsModalOpen(true)
                        }}
                    />
                )
            case 'past':
                return (
                    <BookingList
                        type="past"
                        bookings={pastBookings}
                    />
                )
        }
    }, [hasError, isLoading, chosenBlock, relevantBookings, pastBookings])

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
