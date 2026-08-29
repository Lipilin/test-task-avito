import { useMemo } from 'react'
import type { z } from 'zod'
import type { Room } from '@/utils/api/types'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { TimeInputField } from '@/components/ui/TimeInputField'
import { Dropdown } from '@/components/ui/Dropdown'
import { dropdownStyles } from '@/components/ui/dropdownStyles'
import { DURATION_OPTIONS } from '@/utils/api/general'
import { applyTimeToDate, formatTime } from '@/utils/other'
import infoCircleIcon from '@/assets/info-circle.svg'
import styles from './Entering.module.css'

interface DurationOption {
    id: number
    name: string | number
}

interface EnteringProps {
    room: Room
    title: string
    setTitle: (value: string) => void
    comment: string
    setComment: (value: string) => void
    from: Date
    setFrom: (date: Date) => void
    duration: number
    setDuration: (duration: number) => void
    durationActiveItem: DurationOption | null
    summaryText: string
    validationError?: z.ZodError | null
    onBook: () => void
    onClose: () => void
}

function getErrorPaths(validationError: z.ZodError | null | undefined): Set<string> {
    if (!validationError) return new Set()

    return new Set(
        validationError.issues
            .map((issue) => String(issue.path[0] ?? ''))
            .filter(Boolean),
    )
}

export function Entering({
    room,
    title,
    setTitle,
    comment,
    setComment,
    from,
    setFrom,
    setDuration,
    durationActiveItem,
    summaryText,
    validationError = null,
    onBook,
    onClose,
}: EnteringProps) {
    const errorPaths = useMemo(() => getErrorPaths(validationError), [validationError])

    const hasTitleError = errorPaths.has('title')
    const hasStartsAtError = errorPaths.has('startsAt')
    const hasEndsAtError = errorPaths.has('endsAt')
    const hasCommentError = errorPaths.has('comment')

    return (
        <>
            <div className={styles.title}>Новое бронирование</div>
            <div className={styles.roomInfo}>
                Переговорная: <span className={styles.roomName}>{room.name}</span>
            </div>
            <div className={styles.form}>
                <div className={styles.formField}>
                    <div className={styles.titleLabel}>Тема встречи*</div>
                    <input
                        type="text"
                        placeholder="Введите названи встречи"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className={hasTitleError ? styles.inputError : undefined}
                    />
                </div>
                <div className={styles.date}>
                    <DatePickerField
                        selected={from}
                        onChange={(date) => setFrom(date ?? from)}
                        className={hasStartsAtError ? styles.fieldError : undefined}
                    />
                </div>
                <div className={styles.startTime}>
                    <TimeInputField
                        value={formatTime(from)}
                        readOnly
                        onChange={(startTime) => setFrom(applyTimeToDate(from, startTime))}
                        className={hasStartsAtError ? styles.fieldError : undefined}
                    />
                </div>
                <div className={styles.formField}>
                    <Dropdown
                        items={DURATION_OPTIONS}
                        setItem={(value) => setDuration(value.id)}
                        activeItem={durationActiveItem}
                        title="ДЛИТЕЛЬНОСТЬ"
                        placeholder="Выберите"
                        titleClassName={dropdownStyles.titleFilter}
                        className={`${dropdownStyles.dropdownFilter} ${hasEndsAtError ? styles.dropdownError : ''}`}
                    />
                </div>
                <div className={styles.comment}>
                    <div className={styles.commentLabel}>Комментарий</div>
                    <textarea
                        placeholder="Дополнительная информация для участников встречи..."
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        className={hasCommentError ? styles.inputError : undefined}
                    />
                </div>
            </div>
            <div className={styles.summary}>
                <img src={infoCircleIcon} alt="" className={styles.summaryIcon} />
                <span>{summaryText}</span>
            </div>
            {validationError && validationError.issues.length > 0 ? (
                <ul className={styles.validationErrors}>
                    {validationError.issues.map((issue, index) => (
                        <li key={`${String(issue.path[0] ?? 'form')}-${index}`}>
                            {issue.message}
                        </li>
                    ))}
                </ul>
            ) : null}
            <div className={styles.buttons}>
                <div className={styles.declineButton} onClick={onClose}>
                    Отмена
                </div>
                <div className={styles.bookButton} onClick={onBook}>
                    Бронировать
                </div>
            </div>
        </>
    )
}
