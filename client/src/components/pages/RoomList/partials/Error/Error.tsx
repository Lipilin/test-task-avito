import alertTriangleIcon from '../../../../../assets/alert-triangle.svg'
import styles from './Error.module.css'

export function Error() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <img src={alertTriangleIcon} alt="" className={styles.icon} />
                </div>
                <h3 className={styles.title}>Не удалось загрузить данные</h3>
                <p className={styles.description}>
                    Произошла ошибка при загрузке списка переговорных
                </p>
                <button type="button" className={styles.button}>
                    Попробовать снова
                </button>
            </div>
        </div>
    )
}
