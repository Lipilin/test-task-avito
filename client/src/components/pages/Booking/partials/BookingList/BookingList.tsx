import type { BookingView } from '@/utils/api/types'
import officeBuildingIcon from '@/assets/office-building.svg'
import { Empty } from '@/components/layout'
import styles from '../../Booking.module.css'
import { BookingItem } from '../BookingItem'

type BookingListProps =
    | {
        type: 'relevant'
        bookings: BookingView[]
        onDelete: (booking: BookingView) => void
    }
    | {
        type: 'past'
        bookings: BookingView[]
    }

export function BookingList(props: BookingListProps) {
    const { type, bookings } = props

    if (bookings.length === 0) {
        if (type === 'relevant') {
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
            <Empty
                icon={officeBuildingIcon}
                variant="accent"
                title="Нет бронирований"
                description="У вас пока нет прошедших бронирований."
            />
        )
    }

    return (
        <div className={styles.bookingsList}>
            {bookings.map((item) => (
                <BookingItem
                    key={item.id}
                    item={item}
                    type={type}
                    onDelete={type === 'relevant' ? props.onDelete : undefined}
                />
            ))}
        </div>
    )
}
