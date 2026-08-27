import searchEmptyIcon from '../../../../../assets/search-empty.svg'
import styles from './Empty.module.css'

export function Empty() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <img src={searchEmptyIcon} alt="" className={styles.icon} />
                </div>
                <h3 className={styles.title}>Нет доступных переговорных</h3>
                <p className={styles.description}>
                    Попробуйте изменить параметры фильтрации или выбрать другой офис
                </p>
                <button type="button" className={styles.button}>
                    Сбросить фильтры
                </button>
            </div>
        </div>
    )
}
