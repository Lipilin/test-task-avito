import { Link } from 'react-router-dom'
import homeIcon from '@/assets/home.svg'
import styles from './NotFound.module.css'

export function NotFound() {
    return (
        <div className={styles.page}>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Страница не найдена</h1>
            <p className={styles.description}>
                Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.
            </p>
            <Link to="/rooms" className={styles.button}>
                <img src={homeIcon} alt="" className={styles.buttonIcon} />
                Вернуться к переговорным
            </Link>
        </div>
    )
}
