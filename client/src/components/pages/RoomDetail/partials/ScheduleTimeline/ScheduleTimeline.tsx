import type { Booking } from '@/utils/api/types'
import { AVAILABLE_TIME } from '@/utils/api/general'
import { BookingGraph } from '@/components/layout/Other/BookingGraph'
import styles from '../../RoomDetail.module.css'

const [fromHour] = AVAILABLE_TIME.from.split(':').map(Number)
const [toHour] = AVAILABLE_TIME.to.split(':').map(Number)
const hourCount = toHour - fromHour + 1

interface ScheduleTimelineProps {
    bookings: Booking[]
}

export function ScheduleTimeline({ bookings }: ScheduleTimelineProps) {
    return (
        <div className={styles.timeline}>
            <div className={styles.timelineTimes}>
                {Array.from({ length: hourCount }, (_, index) => {
                    const time = `${String(fromHour + index).padStart(2, '0')}:00`

                    return (
                        <div className={styles.timeline_item_time} key={time}>
                            {time}
                        </div>
                    )
                })}
            </div>
            <div className={styles.timelineCanvas}>
                {Array.from({ length: hourCount }, (_, index) => {
                    const time = `${String(fromHour + index).padStart(2, '0')}:00`

                    return (
                        <div className={styles.timeline_line} key={time}>
                            <div className={styles.delimeter} />
                        </div>
                    )
                })}
                {bookings.map((item) => (
                    <BookingGraph
                        key={item.id}
                        title={item.title}
                        startsAt={item.startsAt}
                        endsAt={item.endsAt}
                    />
                ))}
            </div>
        </div>
    )
}
