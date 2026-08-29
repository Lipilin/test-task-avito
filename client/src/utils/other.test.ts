import { describe, it, expect, vi, afterEach } from 'vitest'
import { startOfDay } from 'date-fns'
import { AVAILABLE_TIME, DURATION_OPTIONS } from '@/utils/api/general'
import {
    AVAILABLE_TIME_MINUTES,
    TIMELINE_HOUR_HEIGHT,
    applyTimeToDate,
    formatMinutes,
    formatTime,
    getBookRoomInitialDuration,
    getBookRoomInitialFrom,
    getBookingTimelinePosition,
    getDefaultStartTime,
    getTimelineHeight,
    getTimelineHourLabels,
    getTimelineTopByHour,
    getTimelineTopByMinutes,
    getTimezoneLabel,
    intervalsOverlap,
    isBookingOnDay,
    matchesRoomListAvailabilityEvent,
    parseTimeToMinutes,
} from './other'

describe('other.ts', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    describe('time parsing and formatting', () => {
        it('parseTimeToMinutes parses valid HH:mm', () => {
            expect(parseTimeToMinutes('09:30')).toBe(570)
            expect(parseTimeToMinutes('20:00')).toBe(1200)
        })

        it('parseTimeToMinutes returns null for invalid values', () => {
            expect(parseTimeToMinutes('9:30')).toBeNull()
            expect(parseTimeToMinutes('25:00')).toBeNull()
            expect(parseTimeToMinutes('ab:cd')).toBeNull()
        })

        it('formatMinutes formats total minutes as HH:mm', () => {
            expect(formatMinutes(570)).toBe('09:30')
            expect(formatMinutes(1200)).toBe('20:00')
        })

        it('formatTime formats Date as HH:mm', () => {
            const date = new Date(2026, 7, 18, 14, 45)
            expect(formatTime(date)).toBe('14:45')
        })

        it('applyTimeToDate sets hours and minutes on the given date', () => {
            const day = new Date(2026, 7, 18, 0, 0, 0, 0)
            const result = applyTimeToDate(day, '10:15')

            expect(result.getHours()).toBe(10)
            expect(result.getMinutes()).toBe(15)
            expect(result.getDate()).toBe(18)
        })

        it('applyTimeToDate returns original date for invalid time', () => {
            const day = new Date(2026, 7, 18, 12, 0, 0, 0)
            expect(applyTimeToDate(day, 'invalid')).toBe(day)
        })
    })

    describe('available time constants', () => {
        it('AVAILABLE_TIME_MINUTES matches AVAILABLE_TIME from general.ts', () => {
            expect(AVAILABLE_TIME_MINUTES.min).toBe(9 * 60)
            expect(AVAILABLE_TIME_MINUTES.max).toBe(20 * 60)
            expect(AVAILABLE_TIME_MINUTES.step).toBe(AVAILABLE_TIME.stepMinutes)
            expect(AVAILABLE_TIME_MINUTES.minHour).toBe(9)
            expect(AVAILABLE_TIME_MINUTES.maxHour).toBe(20)
        })
    })

    describe('timeline positioning', () => {
        it('getTimelineHeight returns height for the working day span', () => {
            expect(getTimelineHeight()).toBe(11 * TIMELINE_HOUR_HEIGHT)
        })

        it('getTimelineHourLabels returns hour markers from start to end', () => {
            expect(getTimelineHourLabels()).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
        })

        it('getTimelineTopByMinutes maps minutes to pixel offset', () => {
            expect(getTimelineTopByMinutes(9 * 60)).toBe(0)
            expect(getTimelineTopByMinutes(10 * 60)).toBe(TIMELINE_HOUR_HEIGHT)
        })

        it('getTimelineTopByHour maps hour to pixel offset', () => {
            expect(getTimelineTopByHour(9)).toBe(0)
            expect(getTimelineTopByHour(20)).toBe(11 * TIMELINE_HOUR_HEIGHT)
        })

        it('getBookingTimelinePosition calculates top and height for a booking block', () => {
            const position = getBookingTimelinePosition(
                new Date(2026, 7, 18, 9, 30),
                new Date(2026, 7, 18, 10, 15),
            )

            expect(position).toEqual({
                top: TIMELINE_HOUR_HEIGHT / 2,
                height: (TIMELINE_HOUR_HEIGHT * 3) / 4,
            })
        })
    })

    describe('booking form defaults', () => {
        it('getDefaultStartTime rounds minutes up to the configured step', () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date(2026, 7, 18, 10, 7, 0, 0))

            const result = getDefaultStartTime()

            expect(result.getHours()).toBe(10)
            expect(result.getMinutes()).toBe(15)
        })

        it('getBookRoomInitialFrom uses defaults when no values are passed', () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date(2026, 7, 18, 10, 7, 0, 0))

            const result = getBookRoomInitialFrom(null, null)

            expect(result.getMinutes()).toBe(15)
        })

        it('getBookRoomInitialFrom applies explicit date and start time', () => {
            const day = new Date(2026, 7, 20, 0, 0, 0, 0)
            const result = getBookRoomInitialFrom(day, '11:30')

            expect(formatTime(result)).toBe('11:30')
            expect(result.getDate()).toBe(20)
        })

        it('getBookRoomInitialDuration returns passed duration or default option', () => {
            expect(getBookRoomInitialDuration(60)).toBe(60)
            expect(getBookRoomInitialDuration(null)).toBe(DURATION_OPTIONS[0].id)
        })
    })

    describe('intervals and filtering', () => {
        it('intervalsOverlap detects overlapping ranges', () => {
            const startA = new Date(2026, 7, 18, 10, 0)
            const endA = new Date(2026, 7, 18, 11, 0)
            const startB = new Date(2026, 7, 18, 10, 30)
            const endB = new Date(2026, 7, 18, 12, 0)

            expect(intervalsOverlap(startA, endA, startB, endB)).toBe(true)
        })

        it('intervalsOverlap returns false for non-overlapping ranges', () => {
            const startA = new Date(2026, 7, 18, 10, 0)
            const endA = new Date(2026, 7, 18, 11, 0)
            const startB = new Date(2026, 7, 18, 11, 0)
            const endB = new Date(2026, 7, 18, 12, 0)

            expect(intervalsOverlap(startA, endA, startB, endB)).toBe(false)
        })

        it('matchesRoomListAvailabilityEvent checks office and interval overlap', () => {
            const from = new Date(2026, 7, 18, 10, 0)
            const event = {
                officeId: 'office-1',
                startsAt: new Date(2026, 7, 18, 10, 30).toISOString(),
                endsAt: new Date(2026, 7, 18, 11, 30).toISOString(),
            }

            expect(matchesRoomListAvailabilityEvent(event, 'office-1', from, 60)).toBe(true)
            expect(matchesRoomListAvailabilityEvent(event, 'office-2', from, 60)).toBe(false)
        })

        it('isBookingOnDay checks whether booking starts on the selected day', () => {
            const day = new Date(2026, 7, 18, 0, 0, 0, 0)
            const sameDay = new Date(2026, 7, 18, 15, 0).toISOString()
            const nextDay = new Date(2026, 7, 19, 9, 0).toISOString()

            expect(isBookingOnDay(sameDay, day)).toBe(true)
            expect(isBookingOnDay(nextDay, day)).toBe(false)
            expect(isBookingOnDay(sameDay, startOfDay(nextDay))).toBe(false)
        })
    })

    describe('misc helpers', () => {
        it('getTimezoneLabel returns the last segment of IANA timezone', () => {
            expect(getTimezoneLabel('Europe/Moscow')).toBe('Moscow')
            expect(getTimezoneLabel('UTC')).toBe('UTC')
        })
    })
})
