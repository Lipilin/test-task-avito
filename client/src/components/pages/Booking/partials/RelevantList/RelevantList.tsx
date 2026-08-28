import type { BookingView } from '@/utils/api/types'
import officeBuildingIcon from '@/assets/office-building.svg'
import { Empty } from '@/components/layout'
import styles from '../../Booking.module.css'
import { RelevantBooking } from '../Relevant'

interface RelevantListProps {
    bookings: BookingView[]
    onDelete: (booking: BookingView) => void
}

export function RelevantList({ bookings, onDelete }: RelevantListProps) {
    if (bookings.length === 0) {
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
            {bookings.map((item) => (
                <RelevantBooking
                    key={item.id}
                    item={item}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
