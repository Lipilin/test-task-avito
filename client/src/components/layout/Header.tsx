import { Link, useLocation } from 'react-router-dom'
import logo from '@/assets/favicon.svg'
import styles from './Header.module.css'
import type { User } from '@/utils/api/types'

interface HeaderProps{
    user: User | null
}

export function Header({ user }: HeaderProps) {
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
                {
                    user ? (
                        <>
                            <div className={styles.userName}>{user.displayName}</div>
                            <div className={styles.avatarWrapper}>
                                {
                                    user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Avatar" />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <span>{user.initials}</span>
                                        </div>
                                    )
                                }
                            </div> 
                        </>
                    ) : null
                }
            </div>
        </div>
    )
}
