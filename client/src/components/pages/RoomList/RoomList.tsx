import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOffices, getRooms } from '@/utils/api/modelFunction'
import type { Office, Room } from '@avito/server/src/domain/models'
import { DURATION_OPTIONS, CAPACITY_OPTIONS } from '@/utils/api/general'
import { getDefaultStartTime } from '@/utils/other'
import useDebounce from '@/utils/hooks/useDebounce'
import styles from './RoomList.module.css'
import { FilterForm, OfficeForm, RoomListContent } from './partials'

export function RoomList() {
    const [offices, setOffices] = useState<Office[]>([])
    const navigate = useNavigate()
    const [activeOffice, setActiveOffice] = useState<Office | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [request, setRequest] = useState<RoomListFilters>({
        from: getDefaultStartTime(),
        duration: DURATION_OPTIONS[0].id,
        minCapacity: CAPACITY_OPTIONS[0].id,
    })
    const debouceRequest = useDebounce(request, 500)
    const [rooms, setRooms] = useState<Room[]>([])

    useEffect(() => {
        async function fetchOffices() {
            const offices = await getOffices()
            setOffices(offices)
        }
        fetchOffices()
    }, [])

    useEffect(() => {
        setRequest((prev) => {
            return {
                ...prev,
                officeId: activeOffice?.id,
            }
        })
    }, [activeOffice])

    useEffect(() => {
        if (!activeOffice) return
        if (!debouceRequest.from) return
        async function fetchRooms() {
            try {
                setHasError(false)
                const to = new Date(debouceRequest.from!)
                to.setMinutes(to.getMinutes() + debouceRequest.duration!)
                const rooms = await getRooms({
                    officeId: activeOffice!.id,
                    from: debouceRequest.from?.toISOString(),
                    to: to.toISOString(),
                    minCapacity: debouceRequest.minCapacity,
                })
                setRooms(rooms)
            } catch {
                setHasError(true)
                setRooms([])
            } finally {
                setIsLoading(false)
            }
        }
        setIsLoading(true)
        fetchRooms()
    }, [activeOffice, debouceRequest.minCapacity, debouceRequest.from, debouceRequest.duration])

    const handleBook = useCallback((room: Room) => {
        navigate(`/room/${room.id}`, {
            state: debouceRequest,
        })
    }, [debouceRequest.startTime, debouceRequest.from, debouceRequest.duration])

    const handleRetry = useCallback(() => {
        setOnRetry((count) => count + 1)
    }, [])

    return (
        <div className={styles.container}>
            <OfficeForm
                offices={offices}
                activeOffice={activeOffice}
                onOfficeChange={setActiveOffice}
            />
            <FilterForm
                request={request}
                setRequest={setRequest}
            />
            <RoomListContent
                hasError={hasError}
                isLoading={isLoading}
                activeOffice={activeOffice}
                rooms={rooms}
                onRetry={handleRetry}
                onBook={handleBook}
            />
        </div>
    )
}
