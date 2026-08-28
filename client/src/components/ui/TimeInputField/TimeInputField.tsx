import type { KeyboardEvent } from 'react'
import { useEffect } from 'react'
import { IMaskInput } from 'react-imask'
import IMask from 'imask'
import clockIcon from '../../../assets/clock.svg'
import chevronDownIcon from '../../../assets/chevron-down.svg'
import { AVAILABLE_TIME_MINUTES, formatMinutes, parseTimeToMinutes, TIME_PATTERN } from '../../../utils/other'
import styles from './TimeInputField.module.css'

const { min: MIN_MINUTES, max: MAX_MINUTES, step: STEP_MINUTES, minHour: MIN_HOUR, maxHour: MAX_HOUR } =
    AVAILABLE_TIME_MINUTES

const timeMaskOptions = {
    mask: 'HH:MM',
    lazy: true,
    skipInvalid: true,
    blocks: {
        HH: {
            mask: IMask.MaskedRange,
            from: MIN_HOUR,
            to: MAX_HOUR,
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
