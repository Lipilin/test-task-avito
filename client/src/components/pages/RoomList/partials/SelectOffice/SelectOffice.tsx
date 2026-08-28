import officeBuildingIcon from '@/assets/office-building.svg'
import styles from './SelectOffice.module.css'

export function SelectOffice() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <img src={officeBuildingIcon} alt="" className={styles.icon} />
                </div>
                <h3 className={styles.title}>Выберите офис</h3>
                <p className={styles.description}>
                    Для просмотра доступных переговорных сначала выберите офис из списка выше
                </p>
            </div>
        </div>
    )
}
