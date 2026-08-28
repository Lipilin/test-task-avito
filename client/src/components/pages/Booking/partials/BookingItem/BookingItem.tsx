import type { BookingView } from '@/utils/api/types'
import type { ChosenBlock } from '../../Booking.d'
import officeBuildingIcon from '@/assets/office-building.svg'
import styles from '../../Booking.module.css'

interface BookingItemProps {
    item: BookingView
    type: ChosenBlock
    onDelete?: (booking: BookingView) => void
}

export function BookingItem({ item, type, onDelete }: BookingItemProps) {
    const startsAt = new Date(item.startsAt)
    const endsAt = new Date(item.endsAt)

    return (
        <div className={styles.bookingItem}>
            <div className={styles.bookingItemContent}>
                <div className={styles.bookingItemBadge}>
                    <span className={styles.badgeMonth}>
                        {startsAt.toLocaleDateString('ru-RU', { month: 'long' })}
                    </span>
                    <span className={styles.badgeDay}>
                        {startsAt.toLocaleDateString('ru-RU', { day: 'numeric' })}
                    </span>
                </div>
                <div className={styles.bookingItemInfo}>
                    <div className={styles.bookingItemTitle}>
                        {item.title}
                    </div>
                    <div className={styles.bookingItemMeta}>
                        <span className={styles.metaRoom}>
                            <img src={officeBuildingIcon} alt="" className={styles.metaRoomIcon} />
                            {item.room.name}
                        </span>
                        <span className={styles.metaDot}>·</span>
                        <span>{item.room.floor} этаж</span>
                        <span className={styles.metaDot}>·</span>
                        <span>
                            {startsAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            {' '}-{' '}
                            {endsAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            {' '}MSK
                        </span>
                    </div>
                </div>
            </div>
            {type === 'relevant' && onDelete ? (
                <button
                    type="button"
                    className={styles.buttonDelete}
                    onClick={() => onDelete(item)}
                >
                    Отменить
                </button>
            ) : null}
        </div>
    )
}
