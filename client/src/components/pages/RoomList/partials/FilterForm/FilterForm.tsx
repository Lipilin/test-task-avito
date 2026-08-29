import type { Dispatch, SetStateAction } from 'react'
import { Dropdown } from '@/components/ui/Dropdown'
import { dropdownStyles } from '@/components/ui/dropdownStyles'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { TimeInputField } from '@/components/ui/TimeInputField'
import { DURATION_OPTIONS, CAPACITY_OPTIONS } from '@/utils/api/general'
import { applyTimeToDate, formatTime } from '@/utils/other'
import usersIcon from '@/assets/users.svg'
import styles from '../../RoomList.module.css'

interface FilterFormProps {
    request: RoomListFilters
    setRequest: Dispatch<SetStateAction<RoomListFilters>>
}

export function FilterForm({ request, setRequest }: FilterFormProps) {
    return (
        <div className={styles.filterForm}>
            <div className={styles.filterItemDate}>
                <DatePickerField
                    selected={request.from || new Date()}
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
                            duration: value.id,
                        }))
                    }}
                    activeItem={DURATION_OPTIONS.find((item) => item.id === request?.duration) || null}
                    title="ДЛИТЕЛЬНОСТЬ"
                    placeholder="Выберите"
                    titleClassName={dropdownStyles.titleFilter}
                    className={dropdownStyles.dropdownFilter}
                />
            </div>
            <div className={styles.filterItemCapacity}>
                <Dropdown
                    items={CAPACITY_OPTIONS}
                    setItem={(value) => setRequest((prev) => ({
                        ...prev,
                        minCapacity: value.id,
                    }))}
                    activeItem={CAPACITY_OPTIONS.find((item) => item.id === request?.minCapacity) || null}
                    title="ВМЕСТИМОСТЬ"
                    placeholder="Не указано"
                    titleClassName={dropdownStyles.titleFilter}
                    className={dropdownStyles.dropdownFilter}
                    leadingIcon={<img src={usersIcon} alt="" />}
                />
            </div>
        </div>
    )
}
