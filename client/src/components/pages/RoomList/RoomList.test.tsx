import '@/test/mockModelFunction'
import { describe, it, expect } from 'vitest'
import { RoomList } from './RoomList'
import { renderWithProviders } from '@/test/testUtils'

describe('RoomList', () => {
    it('renders without crashing', () => {
        const { container } = renderWithProviders(<RoomList />, {
            route: '/rooms',
            path: '/rooms',
        })

        expect(container.firstChild).toBeTruthy()
    })
})
