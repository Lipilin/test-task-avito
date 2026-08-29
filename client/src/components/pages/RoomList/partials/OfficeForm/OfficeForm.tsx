import type { Office } from '@avito/server/src/domain/models'
import { Dropdown } from '@/components/ui/Dropdown'
import { dropdownStyles } from '@/components/ui/dropdownStyles'
import { getTimezoneLabel } from '@/utils/other'
import styles from '../../RoomList.module.css'

interface OfficeFormProps {
    offices: Office[]
    activeOffice: Office | null
    onOfficeChange: (office: Office) => void
}

export function OfficeForm({ offices, activeOffice, onOfficeChange }: OfficeFormProps) {
    return (
        <div className={styles.officeForm}>
            <Dropdown
                items={offices}
                setItem={onOfficeChange}
                activeItem={activeOffice}
                title="ОФИС"
                placeholder="Выберите офис"
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
    )
}
