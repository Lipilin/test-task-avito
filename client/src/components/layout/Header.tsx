import { Link, useLocation } from 'react-router-dom'
import logo from '../../../public/favicon.svg'
import styles from './Header.module.css'

export function Header() {
    const location = useLocation()

    const navLinkClass = (path: string) =>
        `${styles.navLink} ${location.pathname === path ? styles.navLinkActive : ''}`

    return (
        <div className={styles.header}>
            <div className={styles.brand}>
                <img src={logo} alt="BookRoom" />
                <Link to="/">
                    <h2>BookRoom</h2>
                </Link>
            </div>
            <div className={styles.nav}>
                <Link to="/rooms" className={navLinkClass('/rooms')}>
                    Переговорные
                </Link>
                <Link to="/booking" className={navLinkClass('/booking')}>
                    Мои бронирования
                </Link>
            </div>
            <div className={styles.user}>
                <div className={styles.userName}>Тестовый</div>
                <div className={styles.avatarWrapper}>
                    <img src={logo} alt="Avatar" />
                </div>
            </div>
        </div>
    )
}
