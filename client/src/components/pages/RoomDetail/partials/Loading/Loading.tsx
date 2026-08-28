import styles from './Loading.module.css'

function TimelineRow() {
    return (
        <div className={styles.timelineRow}>
            <div className={`${styles.line} ${styles.lineTime}`} />
            <div className={`${styles.line} ${styles.lineTimeline}`} />
        </div>
    )
}

export function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.roomInfo}>
                    <div className={`${styles.line} ${styles.lineTitle}`} />
                    <div className={`${styles.line} ${styles.lineDelimiter}`} />
                    <div className={`${styles.line} ${styles.featureLine}`} />
                    <div className={`${styles.line} ${styles.featureLine}`} />
                    <div className={`${styles.line} ${styles.featureLine}`} />
                    <div className={`${styles.line} ${styles.featureLine}`} />
                </div>
                <div className={styles.roomBookings}>
                    <div className={`${styles.line} ${styles.lineScheduleTitle}`} />
                    <TimelineRow />
                    <TimelineRow />
                    <TimelineRow />
                    <TimelineRow />
                    <div className={`${styles.line} ${styles.lineButton}`} />
                </div>
            </div>
        </div>
    )
}
