import { AVAILABLE_TIME } from '@/utils/api/general'

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
