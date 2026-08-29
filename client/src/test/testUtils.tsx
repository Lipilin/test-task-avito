import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { WebSocketContext, type WebSocketContextType } from '@/utils/context/WebSocketContext'

export const mockWebSocketContext: WebSocketContextType = {
    isConnected: true,
    error: null,
    sendMessage: () => {},
    closeConnection: () => {},
    createdActions: [],
    cancelledActions: [],
    availabilityActions: [],
    removeCreatedAction: () => {},
    removeCancelledAction: () => {},
    removeAvailabilityAction: () => {},
}

interface RenderWithProvidersOptions {
    route?: string
    path?: string
}

export function renderWithProviders(
    ui: ReactElement,
    { route = '/', path = route }: RenderWithProvidersOptions = {},
) {
    return render(
        <WebSocketContext.Provider value={mockWebSocketContext}>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path={path} element={ui} />
                </Routes>
            </MemoryRouter>
        </WebSocketContext.Provider>,
    )
}

export function renderWithRouter(ui: ReactNode, route = '/') {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>,
    )
}
