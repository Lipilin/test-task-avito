import { z } from 'zod'
import { AVAILABLE_TIME, BOOKING_VALIDATION_MESSAGES as MSG } from '@/utils/api/general'

function getMinutesOfDay(date: Date): number {
    return date.getHours() * 60 + date.getMinutes()
}

const maxEndMinutes = (() => {
    const [hours, minutes] = AVAILABLE_TIME.to.split(':').map(Number)
    return hours * 60 + minutes
})()

export const bookingSchema = z.object({
    title: z.string().min(1, { message: MSG.title.required  }),
    startsAt: z.string({ message: MSG.startsAt.required }).refine((date) => Number.isFinite(new Date(date).getTime()), {
        message: MSG.startsAt.invalid,
        path: ['startsAt']
    }).refine((date) => new Date(date) > new Date(), {
        message: MSG.startsAt.past,
        path: ['startsAt']
    }),
    endsAt: z
        .string({ message: MSG.endsAt.required })
        .refine((date) => Number.isFinite(new Date(date).getTime()), {  
            message: MSG.endsAt.invalid,
        }),
    comment: z
        .string()
        .optional(),
}).refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    message: MSG.endsAt.beforeStart,
    path: ['endsAt'],
}).refine((data) => getMinutesOfDay(new Date(data.endsAt)) <= maxEndMinutes, {
    message: MSG.endsAt.afterWorkingHours,
    path: ['endsAt'],
})
