import { startOfDay } from 'date-fns'
import type { Booking } from '@/utils/api/types'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { ScheduleTimeline } from '../ScheduleTimeline'
import styles from '../../RoomDetail.module.css'

interface RoomScheduleProps {
    bookings: Booking[]
    selectedDate: Date
    onDateChange: (date: Date) => void
    available: boolean
    onBookClick: () => void
}

export function RoomSchedule({
    bookings,
    selectedDate,
    onDateChange,
    available,
    onBookClick,
}: RoomScheduleProps) {
    return (
        <div className={styles.roomBookings}>
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
                            onDateChange(startOfDay(date))
                        }
                    }}
                />
            </div>
            <ScheduleTimeline bookings={bookings} />
            <div className={styles.actions}>
                <div
                    className={available ? styles.bookButton : styles.bookButtonDisabled}
                    onClick={available ? onBookClick : undefined}
                >
                    Забронировать комнату
                </div>
            </div>
        </div>
    )
}
