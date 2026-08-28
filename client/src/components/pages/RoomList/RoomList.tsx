import { useState, useEffect, useMemo } from 'react'
import { getOffices, getRooms } from '../../../utils/api/modelFunction'
import type { Office } from '@avito/server/src/domain/models'
import { Dropdown, dropdownStyles } from '../../ui/Dropdown'
import type { Room } from '@avito/server/src/domain/models'
import { Room as RoomComponent } from '../../layout/rooms/Room'
import usersIcon from '../../../assets/users.svg'
import styles from './RoomList.module.css'
import { SelectOffice } from './partials/SelectOffice/SelectOffice'
import { Loading } from './partials/Loading/Loading'
import { Error } from './partials/Error/Error'
import { Empty } from './partials/Empty/Empty'
import { DatePickerField } from '../../ui/DatePickerField'
import { TimeInputField } from '../../ui/TimeInputField'
import { DURATION_OPTIONS, CAPACITY_OPTIONS } from '../../../utils/api/general'
import {
    applyTimeToDate,
    formatTime,
    getDefaultStartTime,
    getTimezoneLabel,
} from '../../../utils/other'

export function RoomList() {
    const [offices, setOffices] = useState<Office[]>([])
    const [activeOffice, setActiveOffice] = useState<Office | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [onRetry, setOnRetry] = useState(0)
    const [request, setRequest] = useState<RoomListFilters>({
        from: getDefaultStartTime(),
        duration: DURATION_OPTIONS[0].id,
        minCapacity: CAPACITY_OPTIONS[0].id,
    })
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
                officeId: activeOffice?.id
            }
        })
    }, [activeOffice])
    useEffect(() => {
        if (!activeOffice) return
        async function fetchRooms() {
            try {
                setHasError(false)
                const to = new Date(request.from!)
                to.setMinutes(to.getMinutes() + request.duration!)
                const rooms = await getRooms({
                    officeId: activeOffice!.id,
                    from: request.from?.toISOString(),
                    to: to.toISOString(),
                    minCapacity: request.minCapacity,
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
    }, [onRetry, activeOffice, request.minCapacity, request.from, request.duration])
    const component = useMemo(() => {
        if (hasError) return <Error onRetry={() => setOnRetry((count) => count + 1)} />
        if (isLoading) return <Loading />
        if (!activeOffice) return <SelectOffice />
        if (rooms.length === 0) return <Empty />
        return (
            <div className={styles.roomList}>
                <h3 className={styles.roomListTitle}>Доступные переговорные в этом офисе</h3>
                <div className={styles.rooms}>
                    {rooms.map((item) => (
                        <RoomComponent room={item} key={item.id} />
                    ))}
                </div>
            </div>
        )
    }, [hasError, isLoading, activeOffice, rooms])
    return (
        <div className={styles.container}>
            <div className={styles.officeForm}>
                <Dropdown
                    items={offices}
                    setItem={(value: Office) => setActiveOffice(value)}
                    activeItem={activeOffice}
                    title="ОФИС"
                    placeholder='Выберите офис'
                    titleClassName={dropdownStyles.titleOffice}
                    className={dropdownStyles.dropdownOffice}
                />
                {activeOffice ? (
                    <div className={styles.officeData}>
                        <span>{activeOffice.address}</span>
                        <span className={styles.officeDataSeparator}>•</span>
                        <span>
                            Местное время:{' '}
                            {new Date().toLocaleTimeString('ru-RU', {
                                timeZone: activeOffice.timezone,
                                hour: '2-digit',
                                minute: '2-digit',
                            })}{' '}
                            {getTimezoneLabel(activeOffice.timezone)}
                        </span>
                    </div>
                ) : null}
            </div>
            <div className={styles.filterForm}>
                <div className={styles.filterItemDate}>
                    <DatePickerField
                        selected={ request.from || new Date()}
                        onChange={(date: Date | null) =>
                            setRequest((prev) => ({
                                ...prev,
                                from: date ?? new Date(),
                            }))
                        }
                    />
                </div>
                <div className={styles.filterItemTime}>
                    <TimeInputField
                        value={formatTime(request.from)}
                        onChange={(startTime) =>
                            setRequest((prev) => ({
                                ...prev,
                                from: applyTimeToDate(prev.from, startTime),
                            }))
                        }
                    />
                </div>
                <div className={styles.filterItemDuration}>
                    <Dropdown
                        items={DURATION_OPTIONS}
                        setItem={(value) => {
                            setRequest((prev) => ({
                                ...prev,
                                duration: value.id
                            }))
                        }}
                        activeItem={DURATION_OPTIONS.find((item) => item.id === request?.duration) || null}
                        title="ДЛИТЕЛЬНОСТЬ"
                        placeholder='Выберите'
                        titleClassName={dropdownStyles.titleFilter}
                        className={dropdownStyles.dropdownFilter}
                    />
                </div>

                <div className={styles.filterItemCapacity}>
                    <Dropdown
                        items={ CAPACITY_OPTIONS }
                        setItem={(value) => setRequest((prev) => ({
                            ...prev,
                            minCapacity: value.id
                        }))}
                        activeItem={ CAPACITY_OPTIONS.find((item) => item.id === request?.minCapacity) || null }
                        title="ВМЕСТИМОСТЬ"
                        placeholder='Не указано'
                        titleClassName={dropdownStyles.titleFilter}
                        className={dropdownStyles.dropdownFilter}
                        leadingIcon={<img src={usersIcon} alt="" />}
                    />
                </div>
            </div>
            { component  }
        </div>
    )
}
