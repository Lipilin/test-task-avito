import { getBookingTimelinePosition, TIMELINE_HOUR_HEIGHT } from '@/utils/other'
import styles from './BookingGraph.module.css'

export type BookingGraphVariant = 'booked' | 'occupied'

export interface BookingGraphProps {
    title: string
    startsAt: Date | string
    endsAt: Date | string
    variant?: BookingGraphVariant
    hourHeight?: number
}

export function BookingGraph({
    title,
    startsAt,
    endsAt,
    variant = 'booked',
    hourHeight = TIMELINE_HOUR_HEIGHT,
}: BookingGraphProps) {
    const { top, height } = getBookingTimelinePosition(startsAt, endsAt, hourHeight)
    const label = variant === 'occupied' ? title || 'Занято' : title

    return (
        <div
            className={`${styles.container} ${variant === 'occupied' ? styles.occupied : styles.booked}`}
            style={{ top, height }}
        >
            <span className={styles.title}>{label}</span>
        </div>
    )
}
