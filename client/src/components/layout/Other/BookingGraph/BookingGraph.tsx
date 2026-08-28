import { AVAILABLE_TIME } from '@/utils/api/general'
import styles from './BookingGraph.module.css'

export type BookingGraphVariant = 'booked' | 'occupied'

export interface BookingGraphProps {
    title: string
    startsAt: Date | string
    endsAt: Date | string
    variant?: BookingGraphVariant
    hourHeight?: number
    dayStartHour?: number
}

const DEFAULT_HOUR_HEIGHT = 48

function getTimelinePosition(
    startsAt: Date | string,
    endsAt: Date | string,
    dayStartHour: number,
    hourHeight: number,
) {
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    const startMinutes = start.getHours() * 60 + start.getMinutes()
    const endMinutes = end.getHours() * 60 + end.getMinutes()
    const dayStartMinutes = dayStartHour * 60

    return {
        top: ((startMinutes - dayStartMinutes) / 60) * hourHeight,
        height: ((endMinutes - startMinutes) / 60) * hourHeight,
    }
}

export function BookingGraph({
    title,
    startsAt,
    endsAt,
    variant = 'booked',
    hourHeight = DEFAULT_HOUR_HEIGHT,
    dayStartHour = Number(AVAILABLE_TIME.from.split(':')[0]),
}: BookingGraphProps) {
    const { top, height } = getTimelinePosition(startsAt, endsAt, dayStartHour, hourHeight)
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
