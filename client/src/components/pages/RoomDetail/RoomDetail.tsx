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
import { Loading } from './partials/Loading'
import { Error } from '../RoomList/partials/Error'

const featureIcons: Record<string, string> = {
    display: displayIcon,
    whiteboard: whiteboardIcon,
    video: videoIcon,
}

export function RoomDetail() {
    const { id } = useParams()
    const [room, setRoom] = useState<Room | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [isBookRoomModalOpen, setIsBookRoomModalOpen] = useState(false)
    useEffect(() => {
        if(!id) return
        async function fetchRoom() {
            try {
                setHasError(false)
                setIsLoading(true)
                const room = await getRoomById(id!)
                setRoom(room)
            } catch {
                setHasError(true)
                setRoom(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRoom()
    }, [id, onRetry])
    return (
        <div className={styles.container}>
            <BookRoomModal isOpen={isBookRoomModalOpen} onClose={() => setIsBookRoomModalOpen(false)} />
            {
                hasError ? (
                    <Error
                        description="Произошла ошибка при загрузке переговорной"
                        onRetry={() => setOnRetry((count) => count + 1)}
                    />
                ) : isLoading ? (
                    <Loading />
                ) : room ? (
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
                            <div className = {styles.timeline}>
                                <div className = {styles.timeline_item}>
                                    <div className = {styles.timeline_item_time}>
                                        09:00
                                    </div>
                                    <div className = {styles.timeline_item_content}>
                                            
                                    </div>
                                    <div className = { styles.delimeter }></div>
                                </div>
                                <div className = {styles.timeline_item}>
                                    <div className = {styles.timeline_item_time}>
                                        10:00
                                    </div>
                                    <div className = {styles.timeline_item_content}>
                                            
                                    </div>
                                    <div className = { styles.delimeter }></div>
                                </div>
                            </div>
                            <div className = { styles.actions }>
                                <div className = { room.available === false ? styles.bookButtonDisabled : styles.bookButton } onClick={() => setIsBookRoomModalOpen(true)}>
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