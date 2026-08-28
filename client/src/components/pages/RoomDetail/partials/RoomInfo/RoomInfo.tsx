import type { Room } from '@/utils/api/types'
import usersIcon from '@/assets/room-detail/users.svg'
import displayIcon from '@/assets/room-detail/display.svg'
import whiteboardIcon from '@/assets/room-detail/whiteboard.svg'
import videoIcon from '@/assets/room-detail/video.svg'
import styles from '../../RoomDetail.module.css'

const featureIcons: Record<string, string> = {
    display: displayIcon,
    whiteboard: whiteboardIcon,
    video: videoIcon,
}

interface RoomInfoProps {
    room: Room
}

export function RoomInfo({ room }: RoomInfoProps) {
    return (
        <div className={styles.roomInfo}>
            <div className={styles.roomName}>
                {room.name}
            </div>
            <div className={styles.delimeter} />
            <div className={styles.features}>
                <div className={styles.featureItem}>
                    <img src={usersIcon} alt="" className={styles.featureIcon} />
                    Вместимость: до {room.capacity} человек
                </div>
                {room.features.map((item) => (
                    <div className={styles.featureItem} key={item.code}>
                        {featureIcons[item.code] ? (
                            <img
                                src={featureIcons[item.code]}
                                alt=""
                                className={styles.featureIcon}
                            />
                        ) : null}
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
