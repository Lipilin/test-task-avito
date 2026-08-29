import type { Booking } from '@/utils/api/types'
import { BookingGraph } from '@/components/layout/Other/BookingGraph'
import {
    getTimelineHeight,
    getTimelineHourLabels,
    getTimelineTopByHour,
    TIMELINE_HOUR_HEIGHT,
} from '@/utils/other'
import styles from '../../RoomDetail.module.css'

const timelineHeight = getTimelineHeight(TIMELINE_HOUR_HEIGHT)
const timelineHourLabels = getTimelineHourLabels()

interface ScheduleTimelineProps {
    bookings: Booking[]
}

export function ScheduleTimeline({ bookings }: ScheduleTimelineProps) {
    return (
        <div className={styles.timeline}>
            <div className={styles.timelineTimes} style={{ height: timelineHeight }}>
                {timelineHourLabels.map((hour) => (
                    <div
                        className={styles.timeline_item_time}
                        key={hour}
                        style={{ top: getTimelineTopByHour(hour, TIMELINE_HOUR_HEIGHT) }}
                    >
                        {`${String(hour).padStart(2, '0')}:00`}
                    </div>
                ))}
            </div>
            <div className={styles.timelineCanvas} style={{ height: timelineHeight }}>
                {timelineHourLabels.map((hour) => (
                    <div
                        className={styles.timeline_line}
                        key={hour}
                        style={{ top: getTimelineTopByHour(hour, TIMELINE_HOUR_HEIGHT) }}
                    >
                        <div className={styles.delimeter} />
                    </div>
                ))}
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
