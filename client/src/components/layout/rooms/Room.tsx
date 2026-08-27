import type { Room } from '@avito/server/src/domain/models'
import usersIcon from '../../../assets/users.svg'
import clockIcon from '../../../assets/clock.svg'
import styles from './Room.module.css'

interface RoomProps {
    room: Room
}

export function Room({ room }: RoomProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <div className={styles.header}>
                    <h3 className={styles.name}>{room.name}</h3>
                    <span className={styles.floor}>{room.floor} этаж</span>
                </div>
                <ul className={styles.meta}>
                    <li className={styles.metaItem}>
                        <img src={usersIcon} alt="" className={styles.metaIcon} />
                        Вместимость: до {room.capacity} человек
                    </li>
                    <li className={styles.metaItem}>
                        <img src={clockIcon} alt="" className={styles.metaIcon} />
                        Свободна весь день
                    </li>
                </ul>
                <div className={`${styles.badge} ${styles.badgeAvailable}`}>
                    <span className={styles.badgeDot} />
                    Доступно на выбранное время
                </div>
                <div className={styles.buttons}>
                    <div className={styles.detailButton}>Подробнее</div>
                    <div className={styles.bookButton}>Забронировать</div>
                </div>
            </div>
        </div>
    )
}
