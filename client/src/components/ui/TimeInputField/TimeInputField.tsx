import type { KeyboardEvent } from 'react'
import { useEffect } from 'react'
import { IMaskInput } from 'react-imask'
import IMask from 'imask'
import clockIcon from '../../../assets/clock.svg'
import chevronDownIcon from '../../../assets/chevron-down.svg'
import styles from './TimeInputField.module.css'

const STEP_MINUTES = 15
const MIN_MINUTES = 9 * 60
const MAX_MINUTES = 20 * 60
const TIME_PATTERN = /^(\d{2}):(\d{2})$/

function parseTimeToMinutes(value: string): number | null {
    const match = value.match(TIME_PATTERN)
    if (!match) return null

    const hours = Number(match[1])
    const minutes = Number(match[2])
    if (hours > 23 || minutes > 59) return null

    return hours * 60 + minutes
}

const timeMaskOptions = {
    mask: 'HH:MM',
    lazy: true,
    skipInvalid: true,
    blocks: {
        HH: {
            mask: IMask.MaskedRange,
            from: 9,
            to: 20,
            maxLength: 2,
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 59,
            maxLength: 2,
        },
    },
    validate: (value: string) => {
        const totalMinutes = parseTimeToMinutes(value)
        if (totalMinutes === null) return true
        return totalMinutes >= MIN_MINUTES && totalMinutes <= MAX_MINUTES
    },
} as const

function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function clampTime(value: string): string {
    const totalMinutes = parseTimeToMinutes(value)
    if (totalMinutes === null) return value

    const clampedMinutes = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, totalMinutes))
    return formatMinutes(clampedMinutes)
}

function adjustTimeByMinutes(value: string, deltaMinutes: number): string {
    const currentMinutes = parseTimeToMinutes(value) ?? MIN_MINUTES
    const nextMinutes = Math.min(
        MAX_MINUTES,
        Math.max(MIN_MINUTES, currentMinutes + deltaMinutes),
    )

    return formatMinutes(nextMinutes)
}

interface TimeInputFieldProps {
    title?: string
    placeholder?: string
    value?: string
    onChange: (value: string) => void
    className?: string
    disabled?: boolean
}

export function TimeInputField({
    title = 'ВРЕМЯ НАЧАЛА',
    placeholder = '--:--',
    value = '',
    onChange,
    className,
    disabled = false,
}: TimeInputFieldProps) {
    useEffect(() => {
        if (!TIME_PATTERN.test(value)) return

        const clamped = clampTime(value)
        if (clamped !== value) {
            onChange(clamped)
        }
    }, [value, onChange])

    function handleAccept(nextValue: unknown) {
        const nextTime = String(nextValue)

        if (!TIME_PATTERN.test(nextTime)) {
            onChange(nextTime)
            return
        }

        onChange(clampTime(nextTime))
    }

    function changeTime(deltaMinutes: number) {
        onChange(adjustTimeByMinutes(value, deltaMinutes))
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (disabled) return

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            changeTime(STEP_MINUTES)
        } else if (event.key === 'ArrowDown') {
            event.preventDefault()
            changeTime(-STEP_MINUTES)
        }
    }

    return (
        <div className={`${styles.wrapper} ${className ?? ''}`}>
            <span className={styles.title}>{title}</span>
            <div className={styles.inputWrapper}>
                <img src={clockIcon} alt="" className={styles.inputIcon} />
                <IMaskInput
                    className={styles.input}
                    {...timeMaskOptions}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    unmask={false}
                    onAccept={handleAccept}
                    onKeyDown={handleKeyDown}
                />
                <div className={styles.steppers}>
                    <button
                        type="button"
                        className={styles.stepperButton}
                        aria-label="Увеличить время"
                        disabled={disabled}
                        onClick={() => changeTime(STEP_MINUTES)}
                    >
                        <img
                            src={chevronDownIcon}
                            alt=""
                            className={`${styles.stepperIcon} ${styles.stepperIconUp}`}
                        />
                    </button>
                    <button
                        type="button"
                        className={styles.stepperButton}
                        aria-label="Уменьшить время"
                        disabled={disabled}
                        onClick={() => changeTime(-STEP_MINUTES)}
                    >
                        <img src={chevronDownIcon} alt="" className={styles.stepperIcon} />
                    </button>
                </div>
            </div>
        </div>
    )
}
