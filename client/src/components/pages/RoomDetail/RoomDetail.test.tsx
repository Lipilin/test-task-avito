import '@/test/mockModelFunction'
import { describe, it, expect } from 'vitest'
import { RoomDetail } from './RoomDetail'
import { renderWithProviders } from '@/test/testUtils'

describe('RoomDetail', () => {
    it('renders without crashing', () => {
        const { container } = renderWithProviders(<RoomDetail />, {
            route: '/room/room-1',
            path: '/room/:id',
        })

        expect(container.firstChild).toBeTruthy()
    })
})
