import { useState, useEffect } from 'react'
import { getOffices, getRooms } from '../../../utils/api/modelFunction'
import type { Office } from '@avito/server/src/domain/models'
import { Dropdown, dropdownStyles } from '../../ui/Dropdown'
import type { Room } from '@avito/server/src/domain/models'
import { Room as RoomComponent } from '../../layout/rooms/Room'
import calendarIcon from '../../../assets/calendar.svg'
import clockIcon from '../../../assets/clock.svg'
import usersIcon from '../../../assets/users.svg'
import styles from './RoomList.module.css'

function getTimezoneLabel(timezone: string) {
    return timezone.split('/').pop() ?? timezone
}

export function RoomList() {
    const [offices, setOffices] = useState<Office[]>([])
    const [activeOffice, setActiveOffice] = useState<Office | null>(null)
    const [rooms, setRooms] = useState<Room[]>([])
    useEffect(() => {
        async function fetchOffices() {
            const offices = await getOffices()
            setOffices(offices)
            setActiveOffice(offices[0] || null)
        }
        fetchOffices()
    }, [])
    useEffect(() => {
        if (!activeOffice) return
        async function fetchRooms() {
            const rooms = await getRooms(activeOffice!.id)
            setRooms(rooms)
        }
        fetchRooms()
    }, [activeOffice])
    return (
        <div className={styles.container}>
            <div className={styles.officeForm}>
                <Dropdown
                    items={offices}
                    setItem={(value: Office) => setActiveOffice(value)}
                    activeItem={activeOffice}
                    title="ОФИС"
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
                <Dropdown
                    items={offices}
                    setItem={(value: Office) => setActiveOffice(value)}
                    activeItem={activeOffice}
                    title="ДАТА"
                    titleClassName={dropdownStyles.titleFilter}
                    className={dropdownStyles.dropdownFilter}
                    leadingIcon={<img src={calendarIcon} alt="" />}
                />
                <Dropdown
                    items={offices}
                    setItem={(value: Office) => setActiveOffice(value)}
                    activeItem={activeOffice}
                    title="ВРЕМЯ НАЧАЛА"
                    titleClassName={dropdownStyles.titleFilter}
                    className={dropdownStyles.dropdownFilter}
                    leadingIcon={<img src={clockIcon} alt="" />}
                />
                <Dropdown
                    items={offices}
                    setItem={(value: Office) => setActiveOffice(value)}
                    activeItem={activeOffice}
                    title="ДЛИТЕЛЬНОСТЬ"
                    titleClassName={dropdownStyles.titleFilter}
                    className={dropdownStyles.dropdownFilter}
                />

                <Dropdown
                    items={offices}
                    setItem={(value: Office) => setActiveOffice(value)}
                    activeItem={activeOffice}
                    title="ВМЕСТИМОСТЬ"
                    titleClassName={dropdownStyles.titleFilter}
                    className={dropdownStyles.dropdownFilter}
                    leadingIcon={<img src={usersIcon} alt="" />}
                />
            </div>
            <div className={styles.roomList}>
                <h3 className={styles.roomListTitle}>Доступные переговорные в этом офисе</h3>
                <div className={styles.rooms}>
                    {rooms.map((item) => (
                        <RoomComponent room={item} key={item.id} />
                    ))}
                </div>
            </div>
        </div>
    )
}
