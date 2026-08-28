import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { BookingView } from '@/utils/api/types'
import calendarIcon from '@/assets/calendar.svg'
import officeBuildingIcon from '@/assets/office-building.svg'
import styles from './DeleteBooking.module.css'

interface DeleteBookingProps {
    onClose: () => void
    booking: BookingView
    onDelete: () => void
}

function capitalizeFirst(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export function DeleteBooking({ onClose, booking, onDelete }: DeleteBookingProps) {
    const startsAt = new Date(booking.startsAt)
    const endsAt = new Date(booking.endsAt)
    const scheduleLabel = `${capitalizeFirst(format(startsAt, 'EEEE', { locale: ru }))}, ${format(startsAt, 'd MMMM', { locale: ru })}, ${format(startsAt, 'HH:mm')} - ${format(endsAt, 'HH:mm')}`

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    Отменить бронирование?
                </div>
                <div className={styles.warning}>
                    Это действие нельзя будет отменить. Освободившееся время станет доступно другим сотрудникам.
                </div>
                <div className={styles.information}>
                    <div className={styles.bookingTitle}>
                        {booking.title}
                    </div>
                    <div className={styles.infoRow}>
                        <img src={officeBuildingIcon} alt="" className={styles.infoIcon} />
                        <span className={styles.infoText}>
                            Комната «{booking.room.name}», {booking.room.floor} этаж
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                        <img src={calendarIcon} alt="" className={styles.infoIcon} />
                        <span className={styles.infoText}>
                            {scheduleLabel}
                        </span>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonCancel} onClick={onClose}>
                        Нет, оставить
                    </div>
                    <div className={styles.buttonDelete} onClick={onDelete}>
                        Да, отменить
                    </div>
                </div>
            </div>
            <div className={styles.backdrop} />
        </div>
    )
}