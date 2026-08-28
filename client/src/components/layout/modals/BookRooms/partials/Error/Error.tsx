import alertTriangleIcon from '@/assets/alert-triangle.svg'
import styles from './Error.module.css'

interface ErrorProps {
    onStateBack: () => void
    onClose: () => void
}

export function Error({ onStateBack, onClose }: ErrorProps) {
    return (
        <div className={styles.content}>
            <div className={styles.iconWrapper}>
                <img src={alertTriangleIcon} alt="" className={styles.icon} />
            </div>
            <h3 className={styles.title}>Время уже занято</h3>
            <p className={styles.description}>
                Выбранный интервал был забронирован другим сотрудником. Расписание обновлено.
            </p>
            <button type="button" className={styles.button} onClick={onStateBack}>
                Выбрать другое время
            </button>
        </div>
    )
}
