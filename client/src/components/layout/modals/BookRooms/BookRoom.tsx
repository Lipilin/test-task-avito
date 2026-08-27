import styles from './BookRoom.module.css'

interface BookRoomProps {
    isOpen: boolean
    onClose: () => void
}

export function BookRoom({ isOpen }: BookRoomProps) {
    if(!isOpen) return null;
    return (
        <div className={styles.modal_container}>
            <div className={styles.modal_content}>
                <div className = {styles.title}>
                    Новое бронирование
                </div>
            </div>
            <div className={styles.modal_backdrop}></div>
        </div>
    )
}