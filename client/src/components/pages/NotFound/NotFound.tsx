import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function HomeIcon() {
    return (
        <svg
            className={styles.buttonIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M3 8.5L10 2.5L17 8.5V16.5C17 17.0523 16.5523 17.5 16 17.5H4C3.44772 17.5 3 17.0523 3 16.5V8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.5 17.5V11.5H12.5V17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function NotFound() {
    return (
        <div className={styles.page}>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Страница не найдена</h1>
            <p className={styles.description}>
                Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.
            </p>
            <Link to="/rooms" className={styles.button}>
                <HomeIcon />
                Вернуться к переговорным
            </Link>
        </div>
    )
}
