import infoTriangleIcon from '../../../../../assets/info-triangle.svg'
import styles from './ConnectionLost.module.css'

export function ConnectionLost() {
    return (
        <div className={styles.banner}>
            <img src={infoTriangleIcon} alt="" className={styles.icon} />
            <span>Соединение потеряно. Переподключение...</span>
        </div>
    )
}
