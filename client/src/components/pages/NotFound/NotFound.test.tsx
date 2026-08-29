import { describe, it, expect } from 'vitest'
import { NotFound } from './NotFound'
import { renderWithRouter } from '@/test/testUtils'

describe('NotFound', () => {
    it('renders without crashing', () => {
        const { getByRole } = renderWithRouter(<NotFound />)

        expect(getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
    })
})
