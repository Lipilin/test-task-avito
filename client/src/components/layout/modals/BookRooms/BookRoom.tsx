import { useMemo, useState, useCallback, useEffect } from 'react'
import { addMinutes, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import styles from './BookRoom.module.css'
import type { Room } from '@/utils/api/types'
import { DURATION_OPTIONS } from '@/utils/api/general'
import {
    formatTime,
    getBookRoomInitialDuration,
    getBookRoomInitialFrom,
} from '@/utils/other'
import { createBooking } from '@/utils/api/modelFunction'
import { Entering, Success, Error } from './partials'
import { bookingSchema } from '@/utils/validation/booking.schema'

interface BookRoomProps {
    room: Room | null
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    defaultDate?: Date | null
    defaultDuration?: number | null
    defaultStartTime?: string | null
}

function capitalizeFirst(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

type modalStates = 'entering' | 'sucess' | 'error'

export function BookRoom({
    room,
    isOpen,
    onClose,
    onSuccess,
    defaultDate = null,
    defaultDuration = null,
    defaultStartTime = null,
}: BookRoomProps) {
    const [modalState, setModalState] = useState<modalStates>('entering')
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [from, setFrom] = useState(() => getBookRoomInitialFrom(defaultDate, defaultStartTime))
    const [duration, setDuration] = useState(() => getBookRoomInitialDuration(defaultDuration))
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')

    const resetFormValues = useCallback(() => {
        setFrom(getBookRoomInitialFrom(defaultDate, defaultStartTime))
        setDuration(getBookRoomInitialDuration(defaultDuration))
        setTitle('')
        setComment('')
        setModalState('entering')
    }, [defaultDate, defaultDuration, defaultStartTime])

    useEffect(() => {
        if (!isOpen) return
        resetFormValues()
    }, [isOpen, resetFormValues])

    const durationActiveItem = useMemo(() => {
        const option = DURATION_OPTIONS.find((item) => item.id === duration)
        if (!option) return null

        const end = new Date(from)
        end.setMinutes(end.getMinutes() + duration)

        return {
            ...option,
            name: `${option.name} (до ${formatTime(end)})`,
        }
    }, [duration, from])

    const summaryText = useMemo(() => {
        const end = new Date(from)
        end.setMinutes(end.getMinutes() + duration)
        const durationLabel = DURATION_OPTIONS.find((item) => item.id === duration)?.name ?? ''
        const dayLabel = capitalizeFirst(format(from, 'EEEE', { locale: ru }))
        const dateLabel = format(from, 'd MMMM', { locale: ru })

        return `Бронирование на ${dayLabel}, ${dateLabel}, ${formatTime(from)} - ${formatTime(end)} (${durationLabel})`
    }, [duration, from])

    const successDetails = useMemo(() => {
        const end = addMinutes(from, duration)
        const dateLabel = format(from, 'd MMMM', { locale: ru })

        return `Комната ${room?.name}, ${dateLabel}, ${formatTime(from)}–${formatTime(end)} MSK`
    }, [room, from, duration])

    const handleStateBack = useCallback(() => {
        setModalState('entering')
    }, [])

    const resetForm = useCallback(() => {
        resetFormValues()
        onClose()
    }, [resetFormValues, onClose])

    const handleSuccessClose = useCallback(() => {
        setShowSuccessToast(false)
        setSuccessMessage('')
    }, [])

    const handleBookClick = useCallback(async () => {
        if(!room) return
        const request: CreateBookingRequest = {
            roomId: room.id,
            title,
            comment,
            startsAt: from.toISOString(),
            endsAt: addMinutes(from, duration).toISOString(),
        }
        const validation = bookingSchema.safeParse(request)
        if(validation.error) {
            console.log(validation.error)
            return
        }
        createBooking(request).then(() => {
            setSuccessMessage(successDetails)
            resetForm()
            setShowSuccessToast(true)
            onSuccess?.()
        }).catch(() => {
            setModalState('error')
        })
    }, [room, title, comment, from, duration, successDetails, resetForm, onSuccess])

    if(!room) return null;

    return (
        <>
            {showSuccessToast ? (
                <Success
                    successDetails={successMessage}
                    onClose={handleSuccessClose}
                />
            ) : null}
            {isOpen ? (
                <div className={styles.modal_container}>
                    <div className={`${styles.modal_content} ${modalState === 'error' ? styles.modal_contentStatus : ''}`}>
                        {modalState === 'entering' ? (
                            <Entering
                                room={room}
                                title={title}
                                setTitle={setTitle}
                                comment={comment}
                                setComment={setComment}
                                from={from}
                                setFrom={setFrom}
                                duration={duration}
                                setDuration={setDuration}
                                durationActiveItem={durationActiveItem}
                                summaryText={summaryText}
                                onBook={handleBookClick}
                                onClose={onClose}
                            />
                        ) : (
                            <Error
                                onStateBack={handleStateBack}
                                onClose={onClose}
                            />
                        )}
                    </div>
                    <div className={styles.modal_backdrop}></div>
                </div>
            ) : null}
        </>
    )
}
