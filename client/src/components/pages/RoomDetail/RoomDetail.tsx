import styles from './RoomDetail.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Room } from '../../../utils/api/types'
import { getRoomById } from '../../../utils/api/modelFunction'
import usersIcon from '../../../assets/room-detail/users.svg'
import displayIcon from '../../../assets/room-detail/display.svg'
import whiteboardIcon from '../../../assets/room-detail/whiteboard.svg'
import videoIcon from '../../../assets/room-detail/video.svg'
import { BookRoomModal } from '../../layout/modals'

const featureIcons: Record<string, string> = {
    display: displayIcon,
    whiteboard: whiteboardIcon,
    video: videoIcon,
}

export function RoomDetail() {
    const { id } = useParams()
    const [room, setRoom] = useState<Room | null>(null)
    const [isBookRoomModalOpen, setIsBookRoomModalOpen] = useState(false)
    useEffect(() => {
        if(!id) return
        async function fetchRoom() {
            const room = await getRoomById(id!)
            setRoom(room)
        }
        fetchRoom()
    }, [id])
    return (
        <div className={styles.container}>
            <BookRoomModal isOpen={isBookRoomModalOpen} onClose={() => setIsBookRoomModalOpen(false)} />
            {
                room ? (
                    <div className = {styles.wrapper}>
                        <div className = {styles.roomInfo}>
                            <div className={styles.roomName}>
                                { room.name }
                            </div> 
                            <div className = {styles.delimeter}></div>
                            <div className={styles.features}>
                                <div className={styles.featureItem}>
                                    <img src={usersIcon} alt="" className={styles.featureIcon} />
                                    Вместимость: до { room.capacity } человек
                                </div>
                                { room.features.map((item) => (
                                    <div className={styles.featureItem} key={item.code}>
                                        {featureIcons[item.code] ? (
                                            <img
                                                src={featureIcons[item.code]}
                                                alt=""
                                                className={styles.featureIcon}
                                            />
                                        ) : null}
                                        { item.name }
                                    </div>
                                )) }
                            </div>
                        </div>
                        <div className = { styles.roomBookings }>
                            <div className={styles.scheduleTitle}>
                                Расписание на день
                            </div>
                            <div className = { styles.actions }>
                                <div className = { styles.bookButton } onClick={() => setIsBookRoomModalOpen(true)}>
                                    Забронировать комнату
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}