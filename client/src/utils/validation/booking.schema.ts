import { z } from 'zod'
import { BOOKING_VALIDATION_MESSAGES as MSG } from '@/utils/api/general'

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
})
