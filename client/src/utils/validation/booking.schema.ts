import { z } from 'zod'
import { BOOKING_VALIDATION_MESSAGES as MSG } from '@/utils/api/general'

export const bookingSchema = z
    .object({
        title: z
            .string({ message: MSG.title.required })
            .min(3, { message: MSG.title.min })
            .max(255, { message: MSG.title.max }),
        startsAt: z
            .string({ message: MSG.startsAt.required })
            .refine((date) => Number.isFinite(new Date(date).getTime()), {
                message: MSG.startsAt.invalid,
            })
            .refine((date) => new Date(date) > new Date(), {
                message: MSG.startsAt.past,
            }),
        endsAt: z
            .string({ message: MSG.endsAt.required })
            .refine((date) => Number.isFinite(new Date(date).getTime()), {
                message: MSG.endsAt.invalid,
            }),
        comment: z
            .string()
            .max(2000, { message: MSG.comment.max })
            .optional(),
    })
    .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
        message: MSG.endsAt.beforeStart,
        path: ['endsAt'],
    })
