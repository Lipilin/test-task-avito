import { useState, useEffect, useMemo } from 'react'
import { getOffices, getRooms } from '../../../utils/api/modelFunction'
import type { Office } from '@avito/server/src/domain/models'
import { Dropdown, dropdownStyles } from '../../ui/Dropdown'
import type { Room } from '@avito/server/src/domain/models'
import { Room as RoomComponent } from '../../layout/rooms/Room'
import clockIcon from '../../../assets/clock.svg'
import usersIcon from '../../../assets/users.svg'
import styles from './RoomList.module.css'
import { SelectOffice } from './partials/SelectOffice/SelectOffice'
import { Loading } from './partials/Loading/Loading'
import { Empty } from './partials/Empty/Empty'
import { DatePickerField } from '../../ui/DatePickerField'
import { DURATION_OPTIONS, CAPACITY_OPTIONS } from '../../../utils/api/general'
import { IMaskInput } from 'react-imask'
 
function getTimezoneLabel(timezone: string) {
    return timezone.split('/').pop() ?? timezone
}

export function RoomList() {
    const [offices, setOffices] = useState<Office[]>([])
    const [activeOffice, setActiveOffice] = useState<Office | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [request, setRequest] = useState<RoomListRequest>({
        duration: 15,
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
        if (!request.officeId) return
        async function fetchRooms() {
            const rooms = await getRooms(request)
            setRooms(rooms)
            setIsLoading(false)
        }
        setIsLoading(true)
        fetchRooms()
    }, [request.officeId, request.minCapacity, request.from, request.duration])
    const component = useMemo(() => {
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
    }, [isLoading, activeOffice, rooms])
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
                <DatePickerField
                    selected={request.from ? new Date(request.from) : null}
                    onChange={(date: Date | null) =>
                        setRequest((prev) => ({
                            ...prev,
                            from: date?.toISOString(),
                        }))
                    }
                />

                <Dropdown
                    items={ DURATION_OPTIONS }
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
            { component  }
        </div>
    )
}
