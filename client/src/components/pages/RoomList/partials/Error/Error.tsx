import alertTriangleIcon from '../../../../../assets/alert-triangle.svg'
import styles from './Error.module.css'

interface ErrorProps {
    title?: string
    description?: string
    onRetry?: () => void
}

export function Error({
    title = 'Не удалось загрузить данные',
    description = 'Произошла ошибка при загрузке списка переговорных',
    onRetry,
}: ErrorProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <img src={alertTriangleIcon} alt="" className={styles.icon} />
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <button type="button" className={styles.button} onClick={onRetry}>
                    Попробовать снова
                </button>
            </div>
        </div>
    )
}
