import { forwardRef, useMemo } from 'react'
import ReactDatePicker, {
    CalendarContainer,
    registerLocale,
    type ReactDatePickerCustomHeaderProps,
} from 'react-datepicker'
import { addDays, format, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import calendarIcon from '../../../assets/calendar.svg'
import chevronLeftIcon from '../../../assets/chevron-left.svg'
import chevronRightIcon from '../../../assets/chevron-right.svg'
import styles from './DatePickerField.module.css'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('ru', ru)

interface DatePickerFieldProps {
    title?: string
    placeholder?: string
    selected?: Date | null
    onChange: (date: Date | null) => void
    className?: string
}

function CalendarHeader({
    monthDate,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
    return (
        <div className={styles.header}>
            <span className={styles.headerTitle}>
                {format(monthDate, 'LLLL yyyy', { locale: ru })}
            </span>
            <div className={styles.headerNav}>
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    aria-label="Предыдущий месяц"
                >
                    <img src={chevronLeftIcon} alt="" />
                </button>
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    aria-label="Следующий месяц"
                >
                    <img src={chevronRightIcon} alt="" />
                </button>
            </div>
        </div>
    )
}

function BookingCalendarContainer({
    className,
    children,
}: React.PropsWithChildren<{ className?: string }>) {
    return (
        <CalendarContainer className={`${styles.calendar} ${className ?? ''}`}>
            {children}
        </CalendarContainer>
    )
}

const DateInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onClick, placeholder, className }, ref) => (
        <div className={styles.inputWrapper}>
            <img src={calendarIcon} alt="" className={styles.inputIcon} />
            <input
                ref={ref}
                readOnly
                value={typeof value === 'string' && value ? value : ''}
                onClick={onClick}
                placeholder={placeholder}
                className={`${styles.input} ${className ?? ''}`}
            />
        </div>
    ),
)

DateInput.displayName = 'DateInput'

export function DatePickerField({
    title = 'ДАТА',
    placeholder = 'Выберите дату',
    selected = null,
    onChange,
    className,
}: DatePickerFieldProps) {
    const maxDate = useMemo(() => addDays(startOfDay(new Date()), 30), [])
    const minDate = useMemo(() => startOfDay(new Date()), [])

    return (
        <div className={`${styles.wrapper} ${className ?? ''}`}>
            <span className={styles.title}>{title}</span>
            <ReactDatePicker
                selected={selected}
                onChange={onChange}
                locale="ru"
                dateFormat="d MMMM, EEE"
                placeholderText={placeholder}
                customInput={<DateInput />}
                renderCustomHeader={CalendarHeader}
                calendarContainer={BookingCalendarContainer}
                popperClassName={styles.popper}
                minDate={minDate}
                maxDate={maxDate}
                formatWeekDay={(name) => name.slice(0, 2).toUpperCase()}
                showPopperArrow={false}
            />
        </div>
    )
}
