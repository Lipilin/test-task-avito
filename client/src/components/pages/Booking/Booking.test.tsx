import '@/test/mockModelFunction'
import { describe, it, expect } from 'vitest'
import { Booking } from './Booking'
import { renderWithProviders } from '@/test/testUtils'

describe('Booking', () => {
    it('renders without crashing', () => {
        const { container } = renderWithProviders(<Booking />, {
            route: '/booking',
            path: '/booking',
        })

        expect(container.firstChild).toBeTruthy()
    })
})
