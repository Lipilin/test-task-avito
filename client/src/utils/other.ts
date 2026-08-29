import { AVAILABLE_TIME, DURATION_OPTIONS } from '@/utils/api/general'
import { addDays, startOfDay } from 'date-fns'

export const TIME_PATTERN = /^(\d{2}):(\d{2})$/

function parseConfigTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}

export const AVAILABLE_TIME_MINUTES = {
    min: parseConfigTimeToMinutes(AVAILABLE_TIME.from),
    max: parseConfigTimeToMinutes(AVAILABLE_TIME.to),
    step: AVAILABLE_TIME.stepMinutes,
    minHour: Math.floor(parseConfigTimeToMinutes(AVAILABLE_TIME.from) / 60),
    maxHour: Math.floor(parseConfigTimeToMinutes(AVAILABLE_TIME.to) / 60),
}

export function parseTimeToMinutes(value: string): number | null {
    const match = value.match(TIME_PATTERN)
    if (!match) return null

    const hours = Number(match[1])
    const minutes = Number(match[2])
    if (hours > 23 || minutes > 59) return null

    return hours * 60 + minutes
}

export function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function getTimezoneLabel(timezone: string) {
    return timezone.split('/').pop() ?? timezone
}

export function getDefaultStartTime() {
    const date = new Date()
    const minutes = date.getMinutes()
    const roundedMinutes = Math.ceil(minutes / AVAILABLE_TIME.stepMinutes) * AVAILABLE_TIME.stepMinutes
    date.setMinutes(roundedMinutes)
    return date
}

export function getBookRoomInitialFrom(
    defaultDate: Date | null,
    defaultStartTime: string | null,
): Date {
    if (defaultDate === null && defaultStartTime === null) {
        return getDefaultStartTime()
    }

    const day = startOfDay(defaultDate ?? new Date())
    const time = defaultStartTime
        ?? (defaultDate ? formatTime(defaultDate) : formatTime(getDefaultStartTime()))

    return applyTimeToDate(day, time)
}

export function getBookRoomInitialDuration(defaultDuration: number | null): number {
    return defaultDuration ?? DURATION_OPTIONS[0].id
}

export function intervalsOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime()
}

export function matchesRoomListAvailabilityEvent(
    data: { officeId: string; startsAt: string; endsAt: string },
    activeOfficeId: string | undefined,
    from: Date,
    duration: number,
): boolean {
    if (!activeOfficeId || activeOfficeId !== data.officeId) return false

    const filterEnd = new Date(from)
    filterEnd.setMinutes(filterEnd.getMinutes() + duration)

    return intervalsOverlap(
        from,
        filterEnd,
        new Date(data.startsAt),
        new Date(data.endsAt),
    )
}

export function isBookingOnDay(startsAt: string | Date, day: Date): boolean {
    const dayStart = startOfDay(day)
    const dayEnd = addDays(dayStart, 1)
    const start = new Date(startsAt)

    return start >= dayStart && start < dayEnd
}

export function formatTime(date: Date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export function applyTimeToDate(date: Date, time: string): Date {
    const match = time.match(TIME_PATTERN)
    if (!match) return date

    const next = new Date(date)
    next.setHours(Number(match[1]), Number(match[2]), 0, 0)
    return next
}
