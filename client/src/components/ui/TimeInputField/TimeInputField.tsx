import { IMaskInput } from 'react-imask'
import clockIcon from '../../../assets/clock.svg'
import styles from './TimeInputField.module.css'

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
    return (
        <div className={`${styles.wrapper} ${className ?? ''}`}>
            <span className={styles.title}>{title}</span>
            <div className={styles.inputWrapper}>
                <img src={clockIcon} alt="" className={styles.inputIcon} />
                <IMaskInput
                    className={styles.input}
                    mask="00:00"
                    lazy
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    unmask={false}
                    onAccept={(nextValue) => onChange(String(nextValue))}
                />
            </div>
        </div>
    )
}
