import styles from './Booking.module.css'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { BookingView } from '@/utils/api/types'
import type { ChosenBlock } from './Booking.d'
import { deleteBooking, getBookings, getUser } from '@/utils/api/modelFunction'
import { WebSocketContext } from '@/utils/context/WebSocketContext'
import { Loading, BookingList } from './partials'
import { Error } from '@/components/layout'
import { DeleteBooking } from '@/components/layout/modals/DeleteBooking/DeleteBooking'

export function Booking() {
    const {
        createdActions,
        cancelledActions,
        removeCreatedAction,
        removeCancelledAction,
    } = useContext(WebSocketContext)
    const [bookings, setBookings] = useState<BookingView[]>([])
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
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
        async function fetchUser() {
            const user = await getUser()
            setCurrentUserId(user?.id ?? null)
        }
        fetchUser()
    }, [])

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

    useEffect(() => {
        if (createdActions.length === 0 || !currentUserId) return

        createdActions.forEach((action) => {
            const { booking } = action.data
            if (booking.userId === currentUserId) {
                setBookings((prev) => {
                    if (prev.some((item) => item.id === booking.id)) return prev

                    return [...prev, booking].sort(
                        (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
                    )
                })
            }
            removeCreatedAction(action)
        })
    }, [createdActions, currentUserId, removeCreatedAction])

    useEffect(() => {
        if (cancelledActions.length === 0) return

        cancelledActions.forEach((action) => {
            const { booking } = action.data
            setBookings((prev) => prev.filter((item) => item.id !== booking.id))
            setSelectedBooking((prev) => {
                if (prev?.id === booking.id) {
                    setIsModalOpen(false)
                    return null
                }
                return prev
            })
            removeCancelledAction(action)
        })
    }, [cancelledActions, removeCancelledAction])

    const handleDelete = useCallback(async (id: string) => {
        await deleteBooking(id)
        setIsModalOpen(false)
        setSelectedBooking(null)
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
