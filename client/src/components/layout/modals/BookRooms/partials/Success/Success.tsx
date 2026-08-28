import checkCircleFilledIcon from '../../../../../../assets/check-circle-filled.svg'
import styles from './Success.module.css'

interface SuccessProps {
    successDetails: string
    onClose: () => void
}

export function Success({ successDetails, onClose }: SuccessProps) {
    return (
        <div className={styles.toast}>
            <img src={checkCircleFilledIcon} alt="" className={styles.icon} />
            <div className={styles.text}>
                <div className={styles.title}>Бронирование создано</div>
                <div className={styles.description}>{successDetails}</div>
            </div>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
                ×
            </button>
        </div>
    )
}
